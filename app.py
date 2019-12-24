# sasha iatsenia 2019 for glint

import os
from werkzeug.utils import secure_filename
import pandas as pd
import uuid
import redis
import pickle
from job import validate_extension, create_job
from flask_cors import CORS
import sys
from flask import (
    Flask, request, redirect, jsonify, render_template,
    send_from_directory
)


# flask config, load react frontend
app = Flask(__name__,
    static_folder = './public',
    template_folder="./static")

# enable CORS on app
CORS(app)

# redis config
r = redis.from_url(os.environ.get("REDIS"))

# upload file config
UPLOAD_FOLDER = 'data/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/upload', methods=['POST'])
def upload_file():
    """Process file uploaded from frontend"""
    if 'file' not in request.files:
        return 'No file present in headers'

    file = request.files['file']

    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        return 'No file uploaded'

    if file:
        # clean file name for safety
        file_name = secure_filename(file.filename)

        # validate the file to make sure the filetype is supported
        print(file_name)
        validated, file_type = validate_extension(file_name)

        # create job if validated
        if validated == True:
            # save file
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], file_name))

            # create a job
            file_name, job_id = create_job(file_name, file_type)
            print(f'Created {file_name} job with id {job_id}')
        else:
            return 'Invalid filetype'

        return redirect(f'/data?jobId={job_id}', code=302)
 

@app.route('/data')
def get_data():
    """Return data to user with corresponding job ID"""
    # get job id from url
    job_id = request.args.get('jobId')

    # check that we were able to get a url param
    if job_id == None:
        return jsonify({'error': True, 
            'error_description': 'Missing job id'})

    # validate job id
    try:
        val = uuid.UUID(job_id, version=4)
    except ValueError:
        return jsonify({'error': True, 
            'error_description': 'Invalid job id'})

    # pull data from redis
    try:
        p_data = r.get(str(job_id))
        data = pickle.loads(p_data)
        return jsonify(data)
    except:
        return jsonify({'error': True, 
            'error_description': 'Unable to pull data from queue'})


@app.route('/insights/<insight>')
def get_insights(insight):
    """Returns static insights after analysis has been completed"""
    # send static file from insights directory
    return send_from_directory('insights', insight)


@app.route('/test')
def test():
    return 'Hello docker'


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react(path):
    """Serve the user the frontend react code"""
    return render_template('index.html')


if __name__ == "__main__":
    # test if redis is running
    try:
        r.ping()
    except redis.ConnectionError:
        sys.exit('Error connecting to redis')

    # start app normally
    app.run(debug=True, host='0.0.0.0')
