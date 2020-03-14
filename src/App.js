import React from 'react';
import { connect } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Signup from './components/signup'
import Login from './components/login'
import Welcome from './components/welcome'
import ExploreNav from './components/explorenav'
import Explore from './components/explore'

function App() {
  return (
    <div>
      <Explore />
    </div>
  );
}

export default connect()(App);
