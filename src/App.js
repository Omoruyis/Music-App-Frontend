import React from 'react';
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Signup from './components/signup'
import Login from './components/login'
import Welcome from './components/welcome'
import Nav from './components/partials/nav'
import Explore from './components/explore'
import Playlist from './components/playlist'
import Sidebar from './components/partials/sidebar'

function App() {
  return (
    <div>
      <Route exact path='/' component={Welcome} />
      <Route path='/explore' component={Explore} />
      <Route path='/playlist:id' component={Playlist} />
      <Route path='/login' component={Login} />
      {/* <Explore />  */}
    </div>
  );
}

export default connect()(App);
