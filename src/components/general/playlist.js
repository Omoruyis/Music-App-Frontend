import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import axios from 'axios'
import { CircularProgress } from '@material-ui/core';
import { MdPlayArrow } from "react-icons/md";
import { MdPlayCircleOutline } from "react-icons/md";
import { MdExplicit } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { IoIosHeartDislike } from "react-icons/io";
import { IoMdRemove } from "react-icons/io";

import { getAllAlbums, getAllPlaylists, getAllLikes, getAllTracks, getAllRecent, changeSong } from '../../actions'
import Nav from '../partials/nav'
import Sidebar from '../partials/sidebar'
import config from '../../config/config'
import { trimString, time, trackTime } from '../../helper/helper'

import '../../App.css';

class Playlist extends Component {
    state = {
        path: null,
        playlist: null,
        displayTracks: null,
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
        if (this.props.loggedIn) {
            this.props.getAlbums()
            this.props.getTracks()
            this.props.getPlaylists()
            this.props.getLikes()
            this.props.getAllRecent()
        }
    }

    componentWillUnmount() {
        if (!this.props.loggedIn) {
            return
        }
        this.props.getAlbums()
        this.props.getTracks()
        this.props.getPlaylists()
        this.props.getLikes()
        this.props.getAllRecent()
    }

    getPathName = () => {
        const path = this.props.location.pathname.split('/')[1]
        this.setState({
            path
        })
    }

    getPlaylist = async () => {
        try {
            const result = await axios.post(`${config().url}/search/playlist`, { id: parseInt(this.props.match.params.id) }, config().headers)
            if (this.props.loggedIn) {
                let availableTracks = []
                if (!result.data.tracks) {
                    this.setState({
                        playlist: result.data,
                    })
                } else {
                    result.data.tracks.data.forEach(async (cur, index) => {
                        const res = await axios.post(`${config().url}/checkTrackInAlbum`, { id: cur.album.id, trackId: cur.id }, config().headers)
                        availableTracks[index] = res.data
                        if (index === (result.data.tracks.data.length - 1)) {
                            this.setState({
                                playlist: result.data,
                                displayTracks: result.data.tracks.data
                            })
                        }
                    })
                    this.setState({
                        availableTracks
                    })
                }
            } else {
                if (!result.data.tracks) {
                    this.setState({
                        playlist: result.data,
                    })
                } else {
                    this.setState({
                        playlist: result.data,
                        displayTracks: result.data.tracks.data
                    })
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    getLikes = async () => {
        try {
            if (!this.props.loggedIn) {
                return
            }
            const result = await axios.get(`${config().url}/getlikes`, config().headers)
            this.setState({
                likes: result.data
            })
        } catch (e) {
            console.log(e)
        }
    }

    checkLogin = async () => {
        if (!this.props.loggedIn) {
            return
        }
        this.getLikes()
        this.checkLike(parseInt(this.props.match.params.id), 'playlist')
        this.checkAvailable(parseInt(this.props.match.params.id), 'playlist')
    }

    checkAvailable = async (id, type) => {
        try {
            const result = await axios.post(`${config().url}/checkavailable`, { id, type }, config().headers)
            this.setState({
                available: result.data.status,
                _id: result.data._id
            })
        } catch (e) {
            console.log(e)
        }
    }

    checkLike = async (id, type) => {
        try {
            const result = await axios.post(`${config().url}/checklike`, { id, type }, config().headers)
            this.setState({
                liked: result.data
            })
        } catch (e) {
            console.log(e)
        }
    }

    play = (type, id) => {
        this.props.changeSong(id, type)
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
        try {
            this.setState({
                available: newState,
            })
            const result = await axios.post(`${config().url}/${action}`, { id, type }, config().headers)
            this.setState({
                _id: action === 'add' ? result.data._id : 0
            })
        } catch (e) {
            console.log(e)
        }
    }

    likeUndownloadAction = (type, obj, action) => {
        if (action === 'like') {
            this.setState({ liked: true })
            axios.post(`${config().url}/likeUndownload`, { type, data: { id: obj.id, title: obj.title, picture: obj.picture_medium } }, config().headers)
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
            axios.post(`${config().url}/likeUndownload`, { type, data: { ...obj, album: { id: obj.album.id, title: obj.album.title, picture: obj.album.cover_medium, type: obj.album.type } } }, config().headers)
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

    showPlayButton = async (number, button, icon, plIcon, index) => {
        number.style.display = 'none'
        button.style.backgroundColor = 'black'
        button.style.display = 'flex'
        button.style.alignItems = 'center'
        button.style.justifyContent = 'center'
        if (!this.props.loggedIn) {
            icon.style.display = 'block';
            icon.style.position = 'relative'
            plIcon.style.display = 'none';
            return
        }
        if (this.state.availableTracks[index] !== true) {
            icon.style.display = 'block';
            icon.style.position = 'relative'
            plIcon.style.display = 'none';
        } else {
            icon.style.display = 'none';
            plIcon.style.display = 'block';
            plIcon.style.position = 'relative'
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
        const { playlist, liked, available, path, displayTracks, likes } = this.state
        const { match, history, loggedIn } = this.props
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
                                {playlist.error ? <div className="no_playlist no_result">
                                    <p className="discography_header_text">404, page not found</p>
                                </div> : 
                                <div>
                                    <div className="playlist_header" id={loggedIn ? "playlist_header" : ''}>
                                        <img src={playlist.picture_medium} alt="playlist-cover" className="playlist_image" />
                                        <div className="playlist_details_holder">
                                            <p className="playlist_title">{trimString(playlist.title, 17)}</p>
                                            {available ? <p className="playlist_duration">In Library</p> : ''}
                                            <div className="playlist_duration">
                                                <p className="dura">{playlist.nb_tracks} {playlist.nb_tracks !== 1 ? 'tracks' : 'track'}</p>
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
                                                <button className="playlist_button" onClick={() => { !loggedIn ? this.login() : this.likeUndownloadAction(path, playlist, 'like') }}>
                                                    <IoMdHeartEmpty className="playlist_button_icon" />
                                                Like
                                            </button> :
                                                <button className="playlist_button" id="unlike_button" onClick={() => { !loggedIn ? this.login() : this.likeUndownloadAction(path, playlist, 'unlike') }}>
                                                    <IoIosHeartDislike className="playlist_button_icon" />
                                                Unlike
                                            </button>
                                            }
                                        </div>
                                        <input type="search" className="search_track" placeholder="Search within tracks" onInput={() => this.filterTracks()} ref={el => this.searchTrack = el} />
                                    </div>
                                    <div>
                                        <div className="tracks_header">
                                            <div className="playlist_tracks_header" id="track_number"><p className="u">#</p></div>
                                            <p className="playlist_tracks_header" id="track_title" >TRACK</p>
                                            <p className="playlist_tracks_header track_artist">ARTIST</p>
                                            <p className="playlist_tracks_header track_artist">ALBUM</p>
                                            <p className="playlist_tracks_header" id="track_duration">DURATION</p>
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
                                                    <div className="track_title">
                                                        <p style={{ width: '70%' }}>{trimString(track.title, 27)}</p>
                                                        <div className="add_icon_holder">
                                                            <div ref={el => this.addIcon[index] = el} className="add_library_icon" onClick={() => { loggedIn ? this.addAlbPl(path, track.album.id, track.id, index) : this.login() }}>
                                                                <IoIosAddCircleOutline className="add_icons_play" />
                                                                <span className="tooltiptext">Add to library</span>
                                                            </div>
                                                            <div ref={el => this.addIconPl[index] = el} className="add_library_icon" onClick={() => { loggedIn ? this.removeAlbPl(track.album.id, track.id, index) : this.login() }}>
                                                                <IoIosRemoveCircleOutline className="add_icons_play" />
                                                                <span className="tooltiptext">Remove from library</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ width: '10%' }}>
                                                            {track.explicit_lyrics ? <MdExplicit /> : ''}
                                                        </div>
                                                    </div>
                                                    <Link to={`/${track.artist.type}/${track.artist.id}`} style={{ textDecoration: 'none', color: 'black' }} className="track_artist"><p className="turn_red">{trimString(track.artist.name, 17)}</p></Link>

                                                    <Link to={`/${track.album.type}/${track.album.id}`} style={{ textDecoration: 'none', color: 'black' }} className="track_album"><p className="turn_red">{trimString(track.album.title, 17)}</p></Link>
                                                    <p className="track_duration">{trackTime(track.duration)}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>}
                            </div> :
                            <div className="spinner">
                                <CircularProgress />
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}



function mapStateToProps({ loggedIn }) {
    return {
        loggedIn
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAlbums: () => dispatch(getAllAlbums()),
        getTracks: () => dispatch(getAllTracks()),
        getPlaylists: () => dispatch(getAllPlaylists()),
        getLikes: () => dispatch(getAllLikes()),
        getAllRecent: () => dispatch(getAllRecent()),
        changeSong: (id, type) => dispatch(changeSong(id, type))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist)