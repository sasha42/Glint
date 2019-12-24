# sasha iatsenia 2019 for glint

import redis
import uuid
import pickle
import time
from shutil import copyfile
import pandas as pd
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
from traitlets.config import Config
from nbconvert import HTMLExporter
import papermill as pm
import os
import traceback


# configure redis and data path
r = redis.from_url(os.environ.get("REDIS"))
data_path = 'data/'
insights_path = 'insights/'
notebooks_path = 'notebooks/'


def run_notebook(notebook, job_id):
    # get latest data
    p_data = r.get(str(job_id))
    data = pickle.loads(p_data)

    # define output path
    notebook_name = notebook.split('.')[0]
    output_path = f'{insights_path}{job_id}-{notebook_name}'

    # run notebook with papermill, passing the input filename
    # and output path. Output html is provided for kepler.gl
    # geospatial visualizations
    pm.execute_notebook(
        f"notebooks/{notebook}",
        parameters = dict(file_name=f'{data_path}{data["file_name"]}',
                            output_html=output_path+'.html'),
        output_path = output_path+'.json',
        progress_bar = False, # surpress spammy log output
        log_output=False
    )

    # add insight to data
    data['insights'].append(output_path)

    # push to redis
    p_data = pickle.dumps(data)
    r.set(str(job_id), p_data)

    print(f'Completed {notebook_name} analysis')
    

def run_analysis(data):
    """This function runs notebooks asyncronously when it receives a
    new file to process.

    Args:
        data (dict): A dictionary containing data about the job 
    
    Returns:
        body (html): a resulting blob of html"""
    
    # get list of available notebooks
    files = os.listdir(notebooks_path)

    # run each available notebook
    for notebook in files:
        # only run notebook if it's a notebook file
        if notebook.split('.')[-1] == 'ipynb':
            try:
                print(f'RUNNING {notebook}')
                run_notebook(notebook, data["id"])
            except:
                traceback.print_exc()
                print(f'FAILED running notebook {notebook}')

    # get latest data
    p_data = r.get(str(data["id"]))
    data = pickle.loads(p_data)

    # add completed timestamp
    data['timestamp_completed'] = int(time.time()*1000)

    # push to redis
    p_data = pickle.dumps(data)
    r.set(str(data['id']), p_data)
    print('pushed to redis')
    
    return 'ok'  


def validate_extension(file_path):
    """Validates if an extension is eligible for processing. Checks if 
    it's a supported filetype like csv, excel or json.
    
    Args:
        file_path (str): the path of the file
    
    Returns:
        validated (boolean): True or False whether this file can be 
        parsed"""
    
    # extract the file type
    file_type = file_path.split('.')[-1]

    # check if it's in the list of supported filetypes
    if file_type in ['csv', 'xls', 'xslx', 'json']:
        validated = True
    else:
        validated = False
    
    return validated, file_type


def create_job(file_path, file_type):
    """Creates a job to process data in the queue. A file_path and
    file_type is inputted, and out comes an ID that can be used 
    to track the progress of the job. 

    Args:
        file_path (str): path of file for job
        file_type (str): the extension of the file
    
    Returns:
        job_id (str): job identifier"""
    
    # get redis config
    global r

    # generate job metadata
    job_id = uuid.uuid4()
    loaded_timestamp = int(time.time()*1000)
    file_name = file_path.split('/')[-1]

    # make sure we have a file in the right place
    #copyfile(file_path, data_path+file_name)

    # generate the dictionary for the job
    data = {'id': job_id,
            'file_name': file_name,
            'timestamp_loaded': loaded_timestamp,
            'timestamp_completed': None,
            'insights': [],
            'error': False}

    # publish data into the queue and create a job
    p_data = pickle.dumps(data)
    r.set(str(job_id), p_data)
    r.publish(f'job_{job_id}', p_data)

    return file_name, job_id
