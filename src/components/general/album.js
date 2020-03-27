import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import { CircularProgress } from '@material-ui/core';
import { MdPlayArrow } from "react-icons/md";
import { MdPlayCircleOutline } from "react-icons/md";
import { MdExplicit } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { IoIosHeartDislike } from "react-icons/io";
import { IoMdRemove } from "react-icons/io";

import { getAllAlbums, getAllPlaylists, getAllLikes, getAllTracks } from '../../actions'
import Nav from '../partials/nav'
import Sidebar from '../partials/sidebar'
import config from '../../config/config'
import { trimString, time, trackTime } from '../../helper/helper'

import '../../App.css';

class Album extends Component {
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
        likes: null,
        availableTracks: []
    }

    componentDidMount() {
        this.getPathName()
        this.checkLogin()
        this.getPlaylist()

    }

    componentWillUnmount() {
        if(!this.state.loggedIn) {
            return
        }
        this.props.getAlbums()
        this.props.getTracks()
        this.props.getPlaylists()
        this.props.getLikes()
    }

    getPathName = () => {
        const path = this.props.location.pathname.split('/')[1]
        this.setState({
            path
        })
    }

    getPlaylist = async () => {
        const result = await axios.post(`${config().url}/search/album`, { id: parseInt(this.props.match.params.id) }, config().headers)
        this.setState({
            playlist: result.data,
            displayTracks: result.data.tracks.data
        })
        if (this.state.loggedIn) {
            let availableTracks = []
            result.data.tracks.data.forEach(async (cur, index) => {
                const res = await axios.post(`${config().url}/checkTrackInAlbum`, { id: parseInt(this.props.match.params.id), trackId: cur.id }, config().headers)
                availableTracks[index] = res.data
            })
            this.setState({
                availableTracks
            })
        }
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
        this.checkLike(parseInt(this.props.match.params.id), 'album')
        this.checkAvailable(parseInt(this.props.match.params.id), 'album')
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
            liked: result.data
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
            if (this.state.likes[type][i].information.id === value.id && this.state.likes[type][i].type === value.type) {
                answer = true
                break
            } else {
                answer = false
            }
        }
        return answer
    }

    addAlbPl = (type, id, index) => {
        axios.post(`${config().url}/addAlbPlayTrack`, { type, id, index }, config().headers)
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

    showPlayButton = async (number, button, icon, plIcon, index) => {
        number.style.display = 'none'
        button.style.backgroundColor = 'black'
        button.style.display = 'flex'
        button.style.alignItems = 'center'
        button.style.justifyContent = 'center'
        if (!this.state.loggedIn) {
            icon.style.display = 'block';
            plIcon.style.display = 'none';
            return
        }
        if (this.state.availableTracks[index] !== true) {
            icon.style.display = 'block';
            plIcon.style.display = 'none';
        } else {
            icon.style.display = 'none';
            plIcon.style.display = 'block';
        }
    }

    hidePlayButton = (number, button, icon, plIcon) => {
        number.style.display = 'block'
        button.style.backgroundColor = 'white'
        number.style.display = 'flex'
        number.style.justifyContent = 'center'
        number.style.width = '30px';
        icon.style.display = 'none';
        plIcon.style.display = 'none'
    }

    filterTracks = () => {
        if (!this.searchTrack.value) {
            this.setState({
                displayTracks: this.state.playlist.tracks.data
            })
            return 
        }
        const display = this.state.playlist.tracks.data.filter(cur => {
            const lower = cur.title.toLowerCase()
            const filterLower = this.searchTrack.value.toLowerCase()
            return lower.includes(filterLower)
        })
        this.setState({
            displayTracks: display
        })
    }

    login = () => {
        this.props.history.push(`/login?redirect_link=${this.state.path}/${this.props.match.params.id}`)
    }

    render() {
        const { loggedIn, playlist, type, id, liked, available, path, _id, displayTracks, likes } = this.state
        const { match, history } = this.props
        this.trackLike = []
        this.trackNumber = []
        this.playSong = []
        this.addIcon = []
        this.addIconPl = []

        return (
            <div className="main_container">
                <div className="general_container">
                    {loggedIn ? <Sidebar current="explore" /> : ''}
                    <div className={`nav_child_container ${loggedIn ? 'nav_child_container_margin' : ''}`}>
                        <Nav type={path} id={match.params.id} history={history} />
                        {playlist && (loggedIn ? likes : true) ?
                            <div className="playlist_container">
                                <div className="playlist_header" id={loggedIn ? "playlist_header" : ''}>
                                    <img src={playlist.cover_medium} alt="album-cover" className="playlist_image" />
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
                                    <input type="search" className="search_track" placeholder="Search within tracks" onInput={() => this.filterTracks()} ref={el => this.searchTrack = el} />
                                </div>
                                <div>
                                    <div className="tracks_header">
                                        <div className="playlist_tracks_header" id="track_album_number"><p className="u">#</p></div>
                                        <p className="playlist_tracks_header" id="track_album_title" >TRACK</p>
                                        <p className="playlist_tracks_header" id="track_album_duration">DURATION</p>
                                    </div>
                                    {displayTracks.map((track, index) => {
                                        return (
                                            <div className="tracks_header tracks_header_background" key={index} onMouseOver={() => this.showPlayButton(this.trackNumber[index], this.playSong[index], this.addIcon[index], this.addIconPl[index], index)} onMouseOut={() => this.hidePlayButton(this.trackNumber[index], this.playSong[index], this.addIcon[index], this.addIconPl[index])}>
                                                <div className="track_number">
                                                    <div className="u" ref={el => this.trackNumber[index] = el}>
                                                        <p style={{ marginBottom: '0' }}>{index + 1}</p>
                                                    </div>
                                                    <div className="play_track_button" ref={el => this.playSong[index] = el} onClick={() => { loggedIn ? this.play('tracks', track.id) : this.login() }}>
                                                        <MdPlayArrow style={{ fontSize: '25px', color: 'white' }} />
                                                    </div>
                                                    <div onClick={() => loggedIn ? this.addToLikes(track.type, track, this.trackLike[index]) : this.login()} ref={el => this.trackLike[index] = el} className={`track_like_holder ${loggedIn ? (this.newLikes(track, 'trackLikes') ? 'is_liked' : 'is_unliked') : ''}`}>

                                                        <IoIosHeart className={!loggedIn ? 'hide' : (this.newLikes(track, 'trackLikes') ? 'track_liked' : 'hide')} id="liked_track" />
                                                        <IoMdHeartEmpty className={!loggedIn ? 'show' : (this.newLikes(track, 'trackLikes') ? 'hide' : 'track_not_liked')} id="unliked_track" />
                                                    </div>
                                                </div>
                                                <div className="track_album_title">
                                                    <p style={{ width: '70%' }}>{trimString(track.title, 40)}</p>
                                                    <div className="add_icon_holder">
                                                        <div ref={el => this.addIcon[index] = el} className="add_library_icon" onClick={() => { loggedIn ? this.addAlbPl(path, parseInt(match.params.id), index) : this.login() }}>
                                                            <IoIosAddCircleOutline className="add_icons_play" />
                                                        </div>
                                                        <div ref={el => this.addIconPl[index] = el} className="add_library_icon" onClick={() => { loggedIn ? this.removeAlbPl(parseInt(match.params.id), track.id, index) : this.login() }}>
                                                            <IoIosRemoveCircleOutline className="add_icons_play" />
                                                        </div>
                                                    </div>
                                                    <div style={{ width: '10%' }}>
                                                        {track.explicit_lyrics ? <MdExplicit /> : ''}
                                                    </div>
                                                </div>
                                                <p className="track_duration">{trackTime(track.duration)}</p>
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

function mapStateToProps() {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        getAlbums: () => dispatch(getAllAlbums()),
        getTracks: () => dispatch(getAllTracks()),
        getPlaylists: () => dispatch(getAllPlaylists()),
        getLikes: () => dispatch(getAllLikes()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Album)