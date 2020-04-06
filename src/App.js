import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';

import { login } from './actions/index'
import config from './config/config'
import Signup from './components/welcome/signup'
import Login from './components/welcome/login'
import Reset from './components/welcome/reset'
import Welcome from './components/welcome/welcome'
import Explore from './components/general/explore'
import Playlist from './components/general/playlist'
import Album from './components/general/album'
import Artist from './components/general/artist'
import Search from './components/general/search'
import MyTracks from './components/library/tracks'
import MyPlaylists from './components/library/playlists'
import MyAlbums from './components/library/albums'
import Favourites from './components/library/likes'
import Recent from './components/library/recent'
import MyArtists from './components/library/artists'
import PlaylistTracks from './components/library_tracks/playlist'
import AlbumTracks from './components/library_tracks/album'
import ArtistAlbums from './components/library_tracks/artist'

import './App.css';


class App extends Component {
  state= {
    show: false
  }

  async componentDidMount() {
    if (!localStorage.getItem('token')) {
      this.setState({ show: true })
      return
    }
    const result = await axios.get(`${config().url}/authenticate`, config().headers)
    if (result.status !== 200) {
      this.setState({ show: true })
        return
    }
    this.props.login()
    this.setState({ show: true })
  }

  render() {
    return (
      <div>
        {this.state.show ? 
          <div>
            <Route exact path='/' component={Welcome} />
            <Route path='/explore' component={Explore} />
            <Route path='/playlist/:id' component={Playlist} />
            <Route path='/album/:id' component={Album} />
            <Route path='/artist/:id' component={Artist} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <Route path='/reset' component={Reset} />
            <Route path='/search/:query' component={Search} />
            <Route path="/my_tracks" component={MyTracks} />
            <Route path="/my_playlists" component={MyPlaylists} />
            <Route path="/my_albums" component={MyAlbums} />
            <Route path="/favourites" component={Favourites} /> 
            <Route path="/recentlyAdded" component={Recent} /> 
            <Route path="/my_artists" component={MyArtists} /> 
            <Route path="/myplaylists/:id" component={PlaylistTracks} /> 
            <Route path="/myalbums/:id" component={AlbumTracks} /> 
            <Route path="/myartists/:id" component={ArtistAlbums} /> 
          </div>: ''}
        </div>
    );
  }
}

function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
      login: () => dispatch(login())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
