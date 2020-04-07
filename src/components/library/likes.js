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

import { deleteLike, getAllLikes, getAllTracks, deleteTrack, addTrack, getAllAlbums, getAllPlaylists, getAllRecent, getAllArtists, changeSong } from '../../actions'
import Sidebar from '../partials/sidebar'
import LibraryNav from '../partials/librarynav'
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

    componentWillUnmount() {
        this.props.getAlbums()
        this.props.getTracks()
        this.props.getPlaylists()
        this.props.getLikes()
        this.props.getAllRecent()
        this.props.getArtists()
    }

    getPathName = () => {
        const path = this.props.location.pathname.split('/')[1]
        this.setState({
            path
        })
    }

    play = (type, id) => {
        this.props.changeSong(id, type)
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
        const { path, mounted, inputValue } = this.state
        const { history, trackLikes, artistLikes, albumLikes, playlistLikes, tracks, deleteLike, deleteTrack, addTrack } = this.props

        return (
            <div className="main_container">
                <div className="general_container">
                    <Sidebar current="favourites" />
                    <div className='nav_child_container nav_child_container_margin'>
                        <div className="explorenav_container">
                            <div className="explorenav_search">
                                <input type="search" placeholder="Search Likes" className="explorenav_search_input" onInput={() => { this.changeValue() }} ref={el => this.searchTrack = el} />
                            </div>
                            <LibraryNav history={history}/>
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
        getAlbums: () => dispatch(getAllAlbums()),
        getPlaylists: () => dispatch(getAllPlaylists()),
        getAllRecent: () => dispatch(getAllRecent()),
        getArtists: () => dispatch(getAllArtists()),
        deleteTrack: (albumId, trackId) => dispatch(deleteTrack(albumId, trackId)),
        addTrack: (data) => dispatch(addTrack(data)),
        changeSong: (id, type) => dispatch(changeSong(id, type))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favourites)