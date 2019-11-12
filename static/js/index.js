import React from 'react'
import ReactDOM from 'react-dom'
//import './App.css'
import { Router } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import Analysis from './analysis'
import Upload from './upload'
import Notfound from './notfound'

import { Row, Col } from 'antd';

import logo from './logo-small.png';

// history hack
export const history = createBrowserHistory();

const routing = (
  <Router history={history}>
      <Row type="flex" justify="center">
        <Col span={16}>
        <Col span={3}>
          <div>
            <img src={logo} alt="Logo" style={{width: '180px', padding: '24'}} />
          </div>
          </Col>
        </Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span={16}>
        <div style={{ background: '#fff', padding: 24 }}>
          <Switch>
            <Route exact path="/" component={Upload} />
            <Route path="/analysis/:id" component={Analysis} />
            <Route component={Notfound} />
          </Switch>
        </div>
        </Col>
      </Row>
  </Router>
)

ReactDOM.render(routing, document.getElementById('content'))
