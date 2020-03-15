import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'

import { changeArtist, changeAlbum, changePlaylist, changeTrack } from '../actions'
import Nav from './partials/nav'
import Sidebar from './partials/sidebar'
import config from '../config/config'

class Playlist extends Component {
    state = {
        playlist: null
    }

    componentDidMount() {
        this.checkLogin()
        this.getPlaylists()
    }

    getPlaylists = async () => {
        const result = await axios.get(`${config().url}/search/playlist`, { id: this.props.match.params.id }, config().headers)
        this.setState({
            playlist: result.data
        })
    }

    checkLogin = async () => {
        if (!localStorage.getItem('token')) {
            return
        }
        const result = await axios.get(`${config().url}/authenticate`, config().headers)
        if (result.status !== 200) {
            return
        }
        this.setState({
            loggedIn: true
        })
    }

    render() {
        const { playlistId } = this.state
        const { match } = this.props

        return (
            <div className="general_container">
                {loggedIn ? <Sidebar current="explore" /> : ''}
                <div className={`nav_child_container ${loggedIn ? 'nav_child_container_margin' : ''}`}>
                    <Nav />
                    {playlist ?
                        <div className="playlist_container">
                            <img src={playlist.picture_medium} />
                        </div> : ''}
                </div>
            </div>
        )
    }
}

function mapStateToProps(reducer) {
    return {
        playlistId: reducer.playlist
    }
}



export default connect(mapStateToProps)(Playlist)