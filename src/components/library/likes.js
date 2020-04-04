import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import Tracks from '../favourites/tracks'
import Albums from '../favourites/albums'
import Artists from '../favourites/artists'
import Playlists from '../favourites/playlists'
import { CircularProgress } from '@material-ui/core';

import { deleteLike, getAllLikes, getAllTracks, deleteTrack, addTrack } from '../../actions'
import Sidebar from '../partials/sidebar'
import config from '../../config/config'

import '../../App.css';

class Favourites extends Component {
    state = {
        name: localStorage.name,
        inputValue: '',
        path: null,
        mounted: false,
        searchResult: null,
        type: null,
        id: 0,
        likes: null,
        availableTracks: [],
        url: this.props.match.params.query
    }

    componentDidMount() {
        this.getPathName()
        this.setState({ mounted: true })
        this.props.getTracks()
        this.props.getLikes()
    }

    getPathName = () => {
        const path = this.props.location.pathname.split('/')[1]
        this.setState({
            path
        })
    }

    play = (type, id) => {
        this.setState({
            type,
            id
        })
    }

    addAlbPl = (type, id, trackId, index) => {
        axios.post(`${config().url}/addAlbPlayTrack`, { type, id, trackId }, config().headers)
        let newState = this.state.availableTracks
        newState[index] = true
        this.setState({
            availableTracks: newState
        })
    }

    removeAlbPl = (id, trackId, index) => {
        axios.post(`${config().url}/removeAlbPlayTrack`, { id, trackId }, config().headers)
        let newState = this.state.availableTracks
        newState[index] = false
        this.setState({
            availableTracks: newState
        })
    }

    showIcon = (clas, secClas) => {
        clas.style.zIndex = 1
        clas.style.opacity = 1
        secClas.style.opacity = 0.8
    }
    hideIcon = (clas, secClas) => {
        clas.style.zIndex = -1
        clas.style.opacity = 0
        secClas.style.opacity = 1
    }

    expandPlay = (clas) => {
        clas.style.width = '35px'
        clas.style.height = '35px'
    }
    shrinkPlay = (clas) => {
        clas.style.width = '30px'
        clas.style.height = '30px'
    }
    expandLike = (clas) => {
        clas.style.width = '35px'
        clas.style.height = '35px'
    }
    shrinkLike = (clas) => {
        clas.style.width = '30px'
        clas.style.height = '30px'
    }

    clearValue = () => {
        this.searchTrack.value = ''
        this.setState({ inputValue: '' })
    }

    changeValue = () => {
        this.setState({ inputValue: this.searchTrack.value })
    }


    render() {
        const { type, path, id, name, mounted, inputValue } = this.state
        const { trackLikes, artistLikes, albumLikes, playlistLikes, tracks, deleteLike, deleteTrack, addTrack } = this.props

        return (
            <div className="main_container">
                <div className="general_container">
                    <Sidebar current="favourites" />
                    <div className='nav_child_container nav_child_container_margin'>
                        <div className="explorenav_container">
                            <div className="explorenav_search">
                                <input type="search" placeholder="Search Tracks" className="explorenav_search_input" onInput={() => { this.changeValue() }} ref={el => this.searchTrack = el} />
                            </div>
                            <div className="explorenav_buttons">
                                <p className="display_name">{name}</p>
                            </div>
                        </div>
                        {tracks && trackLikes && mounted ?
                            <div className="search_container">
                                <div className="artist_discography search_headers">
                                    <Link to={`/${path}`} style={{ textDecoration: 'none' }}><p className="artist_discography_text" id={this.props.location.pathname === `/${path}` ? 'artist_border' : ''}>Tracks</p></Link>

                                    <Link to={`/${path}/albums`} style={{ textDecoration: 'none' }}><p className="artist_discography_text" id={this.props.location.pathname === `/${path}/albums` ? 'artist_border' : ''}>Albums</p></Link>

                                    <Link to={`/${path}/artists`} style={{ textDecoration: 'none' }}><p className="artist_discography_text" id={this.props.location.pathname === `/${path}/artists` ? 'artist_border' : ''}>Artists</p></Link>

                                    <Link to={`/${path}/playlists`} style={{ textDecoration: 'none' }}><p className="artist_discography_text" id={this.props.location.pathname === `/${path}/playlists` ? 'artist_border' : ''}>Playlists</p></Link>
                                </div>
                                <div>
                                    <Route exact path='/favourites' render={(props) => <Tracks {...props} trackLikes={trackLikes} play={this.play} likeUndownloadAction={this.likeUndownloadAction} deleteLike={deleteLike} inputValue={inputValue} tracks={tracks} deleteTrack={deleteTrack} addTrack={addTrack} clearValue={this.clearValue} />}></Route>

                                    <Route path='/favourites/albums' render={(props) => <Albums {...props} albumLikes={albumLikes} showIcon={this.showIcon} hideIcon={this.hideIcon} expandLike={this.expandLike} shrinkLike={this.shrinkLike} deleteLike={deleteLike} inputValue={inputValue} clearValue={this.clearValue} expandPlay={this.expandPlay} shrinkPlay={this.shrinkPlay} play={this.play} />}></Route>

                                    <Route path='/favourites/artists' render={(props) => <Artists {...props} artistLikes={artistLikes} showIcon={this.showIcon} hideIcon={this.hideIcon} expandLike={this.expandLike} shrinkLike={this.shrinkLike} deleteLike={deleteLike} inputValue={inputValue} clearValue={this.clearValue} />}></Route>

                                    <Route path='/favourites/playlists' render={(props) => <Playlists {...props} playlistLikes={playlistLikes} showIcon={this.showIcon} hideIcon={this.hideIcon} expandLike={this.expandLike} shrinkLike={this.shrinkLike} deleteLike={deleteLike} inputValue={inputValue} clearValue={this.clearValue} expandPlay={this.expandPlay} shrinkPlay={this.shrinkPlay} play={this.play} />}></Route>
                                </div>
                            </div> :
                            <div className="spinner">
                                <CircularProgress />
                            </div>}
                    </div>

                </div>
                {type ? <div className="iframe_container">
                    <iframe title="music-player" scrolling="no" frameBorder="0" allowtransparency="true" src={`https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=false&width=700&height=350&color=ff0000&layout=dark&size=medium&type=${type}&id=${id}&app_id=1`} width="100%" height="100%"></iframe>
                </div> : ''}
            </div>
        )
    }
}


function mapStateToProps(state) {
    if (state.likes) {
        return {
            tracks: state.tracks,
            trackLikes: state.likes.trackLikes,
            albumLikes: state.likes.albumLikes,
            artistLikes: state.likes.artistLikes,
            playlistLikes: state.likes.playlistLikes
        }
    } else {
        return {
            tracks: '',
            trackLikes: '',
            albumLikes: '',
            artistLikes: '',
            playlistLikes: ''
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteLike: (category, data) => dispatch(deleteLike(category, data)),
        getLikes: () => dispatch(getAllLikes()),
        getTracks: () => dispatch(getAllTracks()),
        deleteTrack: (albumId, trackId) => dispatch(deleteTrack(albumId, trackId)),
        addTrack: (data) => dispatch(addTrack(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favourites)