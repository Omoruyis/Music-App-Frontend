import React from 'react';
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Signup from './components/welcome/signup'
import Login from './components/welcome/login'
import Welcome from './components/welcome/welcome'
import Nav from './components/partials/nav'
import Explore from './components/general/explore'
import Playlist from './components/general/playlist'
import Sidebar from './components/partials/sidebar'

function App() {
  return (
    <div>
      <Route exact path='/' component={Welcome} />
      <Route path='/explore' component={Explore} />
      <Route path='/playlist/:id' component={Playlist} />
      <Route path='/login' component={Login} />
      <Route path='/signup' component={Signup} />
      {/* <Explore />  */}
    </div>
  );
}

export default connect()(App);
