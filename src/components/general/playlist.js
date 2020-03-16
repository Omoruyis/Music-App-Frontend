import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios'
import { CircularProgress } from '@material-ui/core';
import { MdPlayArrow } from "react-icons/md";
import { MdPlayCircleOutline } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { IoMdHeartEmpty } from "react-icons/io";

import Nav from '../partials/nav'
import Sidebar from '../partials/sidebar'
import config from '../../config/config'
import time from '../../helper/helper'

import '../../App.css';

class Playlist extends Component {
    state = {
        path: null,
        playlist: null,
        loggedIn: false,
        type: null,
        id: 0,
        liked: false,
        available: false
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

    checkAvailable = async (id, type) => {
        const result = await axios.post(`${config().url}/checkavailable`, { id, type }, config().headers)
        this.setState({
            available: result.data
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

    libraryAction = (id, type, action, newState) => {
        axios.post(`${config().url}/${action}`, { id, type }, config().headers)
        console.log(id, type)
        console.log(3155776842 )
        this.setState({
            available: newState
        })
    }

    addToLikes = (type, obj, clas, classs) => {
        const currentClass = clas
        const secondClass = currentClass.className.split(' ')
        if (secondClass[1] === 'white_favourite') {
            currentClass.className = `${classs} red_favourite`
            axios.post(`${config().url}/likeUndownload`, { type, data: obj }, config().headers)
        } else {
            currentClass.className = `${classs} white_favourite`
            axios.post(`${config().url}/unlikeUndownload`, { type, data: obj }, config().headers)
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

    login = () => {
        this.props.history.push(`/login?redirect_link=playlist/${this.props.match.params.id}`)
    }

    render() {
        const { loggedIn, playlist, type, id, liked, available, path } = this.state
        const { match } = this.props

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
                                                <GoPlus className="playlist_button_icon" />
                                            Remove
                                        </button>}
                                        <button className="playlist_button">
                                            <IoMdHeartEmpty className="playlist_button_icon" />
                                            Like
                                        </button>
                                    </div>
                                    <input type="search" placeholder="Search within tracks" />
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