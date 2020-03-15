import React from 'react';
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Signup from './components/signup'
import Login from './components/login'
import Welcome from './components/welcome'
import ExploreNav from './components/explorenav'
import Explore from './components/explore'
import Playlist from './components/playlist'
import Sidebar from './components/sidebar'

function App() {
  return (
    <div>
      <Route exact path='/explore' component={Explore} />
      <Route exact path='/playlist' component={Playlist} />
      <Route exact path='/login' component={Login} />
      {/* <Sidebar /> */}
    </div>
  );
}

export default connect()(App);
