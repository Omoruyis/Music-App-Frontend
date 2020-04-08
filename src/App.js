import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';

import { login, changeSong } from './actions/index'
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
    this.props.changeSong()
    this.setState({ show: true })
  }

  render() {
    const { id, type } = this.props

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
            <Route path='/changepassword' component={Reset} />
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
            {id && type ? <div className="iframe_container">
                <iframe title="music-player" scrolling="no" frameBorder="0" allowtransparency="true" src={`https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=false&width=700&height=350&color=ff0000&layout=dark&size=medium&type=${type}&id=${id}&app_id=1`} width="100%" height="100%"></iframe>
            </div> : ''}
          </div>: ''}
      </div>
    );
  }
}

function mapStateToProps({ deezerId, deezerType}) {
  return {
    id: deezerId,
    type: deezerType 
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: () => dispatch(login()),
    changeSong: () => dispatch(changeSong())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
