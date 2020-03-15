import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'

import { changeArtist, changeAlbum, changePlaylist, changeTrack } from '../actions'
import ExploreNav from './explorenav'
import config from '../config/config'

class Playlist extends Component {
    render() {
        const { playlistId } = this.props
        return (
            <div>
                {playlistId}
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