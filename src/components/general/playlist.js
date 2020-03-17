import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios'
import { CircularProgress } from '@material-ui/core';
import { MdPlayArrow } from "react-icons/md";
import { MdPlayCircleOutline } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { IoIosHeartDislike } from "react-icons/io";
import { IoMdRemove } from "react-icons/io";

import Nav from '../partials/nav'
import Sidebar from '../partials/sidebar'
import config from '../../config/config'
import time from '../../helper/helper'

import '../../App.css';

class Playlist extends Component {
    state = {
        path: null,
        playlist: null,
        displayTracks: null,
        loggedIn: false,
        type: null,
        id: 0,
        liked: false,
        available: null,
        _id: null,
        likes: null
    }

    componentDidMount() {
        this.getPathName()
        this.checkLogin()
        this.getPlaylist()
        this.checkLike(parseInt(this.props.match.params.id), 'playlist')
        this.checkAvailable(parseInt(this.props.match.params.id), 'playlist')
    }

    getPathName = () => {
        const path = this.props.location.pathname.split('/')[1]
        this.setState({
            path
        })
    }

    getPlaylist = async () => {
        const result = await axios.post(`${config().url}/search/playlist`, { id: parseInt(this.props.match.params.id) }, config().headers)
        this.setState({
            playlist: result.data,
            displayTracks: result.data.tracks.data
        })
    }

    getLikes = async () => {
        if (!this.state.loggedIn) {
            return
        }
        const result = await axios.get(`${config().url}/getlikes`, config().headers)
        this.setState({
            likes: result.data
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
        this.getLikes()
    }

    checkAvailable = async (id, type) => {
        const result = await axios.post(`${config().url}/checkavailable`, { id, type }, config().headers)
        this.setState({
            available: result.data.status,
            _id: result.data._id
        })
    }

    checkLike = async (id, type) => {
        const result = await axios.post(`${config().url}/checklike`, { id, type }, config().headers)
        this.setState({
            liking: result.data
        })
    }

    play = (type, id) => {
        this.setState({
            type,
            id
        })
    }

    expandPlay = (clas) => {
        clas.style.width = '35px'
        clas.style.height = '35px'
    }
    shrinkPlay = (clas) => {
        clas.style.width = '30px'
        clas.style.height = '30px'
    }

    libraryAction = async (id, type, action, newState) => {
        this.setState({
            available: newState,
        })
        const result = await axios.post(`${config().url}/${action}`, { id, type }, config().headers)
        this.setState({
            _id: action === 'add' ? result.data._id : 0
        })
    }

    likeDownloadAction = (type, obj, action, _id) => {
        if (action === 'like') {
            this.setState({ liked: true })
            axios.post(`${config().url}/like`, { type, data: { id: obj.id }, _id }, config().headers)
        } else {
            this.setState({ liked: false })
            axios.post(`${config().url}/unlike`, { type, _id }, config().headers)
        }
    }

    likeUndownloadAction = (type, obj, action) => {
        if (action === 'like') {
            this.setState({ liked: true })
            axios.post(`${config().url}/likeUndownload`, { type, data: { id: obj.id } }, config().headers)
        } else {
            this.setState({ liked: false })
            axios.post(`${config().url}/unlikeUndownload`, { type, data: { id: obj.id } }, config().headers)
        }
    }

    addToLikes = (type, obj, clas) => {
        const currentClass = clas
        const secondClass = currentClass.className.split(' ')
        const s = clas.querySelector('#liked_track')
        const u = clas.querySelector('#unliked_track')
        if (secondClass[1] === 'is_liked') {
            s.style.display = 'none'
            u.style.display = 'block'
            u.style.color = 'black'
            currentClass.className = "track_like_holder is_unliked"
            axios.post(`${config().url}/unlikeUndownload`, { type, data: { id: obj.id } }, config().headers)
        } else {
            s.style.display = 'block'
            s.style.color = 'red'
            u.style.display = 'none'
            currentClass.className = "track_like_holder is_liked"
            axios.post(`${config().url}/likeUndownload`, { type, data: obj }, config().headers)
        }
    }

    newLikes = (value, type) => {
        let answer
        for (let i = 0; i < this.state.likes[type].length; i++) {
            if (this.state.likes[type][i].information.id === value.id && this.state.likes[type][i].information.type === value.type) {
                answer = true
                break
            } else {
                answer = false
            }
        }
        return answer
    }

    showPlayButton = (number, button) => {
        number.style.display = 'none'
        button.style.display = 'block'
    }

    hidePlayButton = (number, button) => {
        number.style.display = 'block'
        button.style.display = 'none'
    }

    login = () => {
        this.props.history.push(`/login?redirect_link=playlist/${this.props.match.params.id}`)
    }

    render() {
        const { loggedIn, playlist, type, id, liked, available, path, _id, displayTracks } = this.state
        const { match } = this.props
        this.trackLike = []
        this.trackNumber = []
        this.playSong = []

        return (
            <div className="main_container">
                <div className="general_container">
                    {loggedIn ? <Sidebar current="explore" /> : ''}
                    <div className={`nav_child_container ${loggedIn ? 'nav_child_container_margin' : ''}`}>
                        <Nav type={path} id={match.params.id} />
                        {playlist ?
                            <div className="playlist_container">
                                <div className="playlist_header" id={loggedIn ? "playlist_header" : ''}>
                                    <img src={playlist.picture_medium} className="playlist_image" />
                                    <div className="playlist_details_holder">
                                        <p className="playlist_title">{playlist.title}</p>
                                        {available ? <p className="playlist_duration">In Library</p> : ''}
                                        <div className="playlist_duration">
                                            <p>{playlist.nb_tracks} {playlist.nb_tracks !== 1 ? 'tracks' : 'track'}</p>
                                            <p className="playlist_time">{time(playlist.duration)}</p>
                                        </div>
                                    </div>
                                    <div className="play_holder" ref={el => this.playTop = el} onClick={() => {
                                        loggedIn ? this.play(path, match.params.id) : this.login()
                                    }} onMouseOver={() => this.expandPlay(this.playTop)} onMouseOut={() => this.shrinkPlay(this.playTop)}>
                                        <MdPlayArrow style={{ fontSize: '25px' }} />
                                    </div>
                                </div>
                                <div className="playlist_actions_holder">
                                    <div className="playlist_button_holder">
                                        <button className="playlist_button" id="playlist_listen" onClick={() => {
                                            loggedIn ? this.play(path, match.params.id) : this.login()
                                        }}>
                                            <MdPlayCircleOutline className="playlist_button_icon" />
                                            Listen
                                        </button>
                                        {!available ? <button className="playlist_button" onClick={() => loggedIn ? this.libraryAction(parseInt(match.params.id), path, 'add', true) : this.login()}>
                                            <GoPlus className="playlist_button_icon" />
                                            Add
                                        </button> :
                                            <button className="playlist_button" onClick={() => loggedIn ? this.libraryAction(parseInt(match.params.id), path, 'delete', false) : this.login()}>
                                                <IoMdRemove className="playlist_button_icon" />
                                            Remove
                                        </button>}
                                        {!liked ?
                                            <button className="playlist_button" onClick={() => { !loggedIn ? this.login() : (available ? this.likeDownloadAction(path, playlist, 'like', _id) : this.likeUndownloadAction(path, playlist, 'like')) }}>
                                                <IoMdHeartEmpty className="playlist_button_icon" />
                                            Like
                                        </button> :
                                            <button className="playlist_button" id="unlike_button" onClick={() => { !loggedIn ? this.login() : (_id ? this.likeDownloadAction(path, playlist, 'unlike', _id) : this.likeUndownloadAction(path, playlist, 'unlike')) }}>
                                                <IoIosHeartDislike className="playlist_button_icon" />
                                        Unlike
                                    </button>
                                        }
                                    </div>
                                    <input type="search" placeholder="Search within tracks" />
                                </div>
                                <div>
                                    <div className="tracks_header">
                                        <p className="playlist_tracks_header" id="track_number">#</p>
                                        <p className="playlist_tracks_header" id="track_title" >TRACK</p>
                                        <p className="playlist_tracks_header track_artist">ARTIST</p>
                                        <p className="playlist_tracks_header track_artist">ALBUM</p>
                                        <p className="playlist_tracks_header" id="track_duration">DURATION</p>
                                    </div>
                                    {displayTracks.map((track, index) => {
                                        return (
                                            <div className="tracks_header" key={index} onMouseOver={() => this.showPlayButton(this.trackNumber[index], this.playSong[index])} onMouseOut={() => this.hidePlayButton(this.trackNumber[index], this.playSong[index])}>
                                                <div className="track_number">
                                                    <p style={{marginBottom: '0'}} ref={el => this.trackNumber[index] = el}>{index + 1}</p>
                                                    <div className="play_track_button" ref={el => this.playSong[index] = el} onClick={() => { loggedIn ? this.play('track', track.id) : this.login() }}>
                                                                <MdPlayArrow style={{ fontSize: '25px' }} />
                                                            </div>
                                                    <div onClick={() => loggedIn ? this.addToLikes(track.type, track, this.trackLike[index]) : this.login()} ref={el => this.trackLike[index] = el} className={`track_like_holder ${this.newLikes(track, 'trackLikes') ? 'is_liked' : 'is_unliked'}`}>
                                                        <IoIosHeart className={!loggedIn ? 'hide' : (this.newLikes(track, 'trackLikes') ? 'track_liked' : 'hide')} id="liked_track"/>
                                                        <IoMdHeartEmpty className={!loggedIn ? 'show' : (this.newLikes(track, 'trackLikes') ? 'hide' : 'track_not_liked')} id="unliked_track" />
                                                    </div>
                                                </div>
                                                <div className="track_title">{track.title}</div>
                                                <p className="track_artist"></p>
                                                <p className="track_album"></p>
                                                <p className="track_duration"></p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div> :
                            <div className="spinner">
                                <CircularProgress />
                            </div>
                        }
                    </div>
                </div>
                {type ? <div className="iframe_container">
                    <iframe title="music-player" scrolling="no" frameBorder="0" allowtransparency="true" src={`https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=false&width=700&height=350&color=ff0000&layout=dark&size=medium&type=${type}&id=${id}&app_id=1`} width="100%" height="100%"></iframe>
                </div> : ''}
            </div>
        )
    }
}

// function mapStateToProps(reducer) {
//     return {
//         playlistId: reducer.playlist
//     }
// }



export default Playlist