import React from "react";
import {Redirect} from 'react-router-dom';
import { Layout, Upload, Icon, message } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const { Dragger } = Upload;
import { history } from "./index.js"

// get api endpoint from environment variable
const api_endpoint = process.env.API_URL + '/';

const props = {
    name: 'file',
    multiple: true,
    action: api_endpoint + 'upload',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            //console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            console.log('Upload: done uploading')
            history.push(`/analysis/${info.file.response.id}`)
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            console.log('Upload: failed to upload')
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

class Contact extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('Upload: mounted')
    }

  render() {
    return (
    <div>
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">Drag and drop data</p>
            <p className="ant-upload-hint">
                Supported filetypes .csv, .json, .xls, .xslx
            </p>
        </Dragger>
    </div>
    );
  }
}

export default Contact;
