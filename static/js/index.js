import React from 'react'
import ReactDOM from 'react-dom'
//import './App.css'
import { Router } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import Analysis from './analysis'
import Upload from './upload'
import Notfound from './notfound'

import { Layout } from 'antd';
const { Header, Content } = Layout;

// history hack
export const history = createBrowserHistory();

const routing = (
  <Router history={history}>
    <Layout className="layout">
    <Header>
      <div className="logo">GLINT</div>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <br />
      <div style={{ background: '#fff', padding: 24 }}>
        <Switch>
          <Route exact path="/" component={Upload} />
          <Route path="/analysis/:id" component={Analysis} />
          <Route component={Notfound} />
        </Switch>
      </div>
    </Content>
  </Layout>
  </Router>
)

ReactDOM.render(routing, document.getElementById('content'))
