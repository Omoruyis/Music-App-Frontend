import React from 'react';
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Signup from './components/welcome/signup'
import Login from './components/welcome/login'
import Welcome from './components/welcome/welcome'
import Explore from './components/general/explore'
import Playlist from './components/general/playlist'
import Album from './components/general/album'
import Artist from './components/general/artist'
import Search from './components/general/search'
import MyTracks from './components/library/tracks'

function App() {
  return (
    <div>
      <Route exact path='/' component={Welcome} />
      <Route path='/explore' component={Explore} />
      <Route path='/playlist/:id' component={Playlist} />
      <Route path='/album/:id' component={Album} />
      <Route path='/artist/:id' component={Artist} />
      <Route path='/login' component={Login} />
      <Route path='/signup' component={Signup} />
      <Route path='/search/:query' component={Search} />
      <Route path="/my_tracks" component={MyTracks} />
    </div>
  );
}

export default connect()(App);
