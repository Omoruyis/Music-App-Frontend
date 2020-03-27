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

import { deleteLike, addLike, deleteTrack, getAllLikes, getAllTracks } from '../../actions'
import Nav from '../partials/nav'
import Sidebar from '../partials/sidebar'
import config from '../../config/config'
import { trimString, time, trackTime } from '../../helper/helper'

import '../../App.css';

class MyTracks extends Component {
    state = {
        name: localStorage.name,
        inputValue: '',
        mounted: false,
        // path: null,
        // playlist: null,
        displayTracks: null,
        // loggedIn: false,
        type: null,
        id: 0,
        // liked: false,
        // available: null,
        // _id: null,
        // likes: null,
    }

    componentDidMount() {
        this.setState({ mounted: true })
        this.props.getTracks()
        this.props.getLikes()
    }

    shouldComponentUpdate() {
        return true
    }

    // checkAvailable = async (id, type) => {
    //     const result = await axios.post(`${config().url}/checkavailable`, { id, type }, config().headers)
    //     this.setState({
    //         available: result.data.status,
    //         _id: result.data._id
    //     })
    // }

    // checkLike = async (id, type) => {
    //     const result = await axios.post(`${config().url}/checklike`, { id, type }, config().headers)
    //     this.setState({
    //         liked: result.data
    //     })
    // }

    play = (type, id) => {
        this.setState({
            type,
            id
        })
    }

    // expandPlay = (clas) => {
    //     clas.style.width = '35px'
    //     clas.style.height = '35px'
    // }
    // shrinkPlay = (clas) => {
    //     clas.style.width = '30px'
    //     clas.style.height = '30px'
    // }

    // libraryAction = async (id, type, action, newState) => {
    //     this.setState({
    //         available: newState,
    //     })
    //     const result = await axios.post(`${config().url}/${action}`, { id, type }, config().headers)
    //     this.setState({
    //         _id: action === 'add' ? result.data._id : 0
    //     })
    // }

    // likeDownloadAction = (type, obj, action, _id) => {
    //     if (action === 'like') {
    //         this.setState({ liked: true })
    //         axios.post(`${config().url}/like`, { type, data: { id: obj.id }, _id }, config().headers)
    //     } else {
    //         this.setState({ liked: false })
    //         axios.post(`${config().url}/unlike`, { type, _id }, config().headers)
    //     }
    // }

    // likeUndownloadAction = (type, obj, action) => {
    //     if (action === 'like') {
    //         this.setState({ liked: true })
    //         axios.post(`${config().url}/likeUndownload`, { type, data: { id: obj.id } }, config().headers)
    //     } else {
    //         this.setState({ liked: false })
    //         axios.post(`${config().url}/unlikeUndownload`, { type, data: { id: obj.id } }, config().headers)
    //     }
    // }

    addToLikes = (obj, clas) => {
        const currentClass = clas
        const secondClass = currentClass.className.split(' ')
        const s = clas.querySelector('#liked_track')
        const u = clas.querySelector('#unliked_track')
        if (secondClass[1] === 'is_liked') {
            s.style.display = 'none'
            u.style.display = 'block'
            u.style.color = 'black'
            currentClass.className = "track_like_holder is_unliked"
            // axios.post(`${config().url}/unlikeUndownload`, { type, data: { id: obj.id } }, config().headers)
            this.props.deleteLike('trackLikes', obj)
        } else {
            s.style.display = 'block'
            s.style.color = 'red'
            u.style.display = 'none'
            currentClass.className = "track_like_holder is_liked"
            // axios.post(`${config().url}/likeUndownload`, { type, data: obj }, config().headers)
            this.props.addLike('trackLikes', obj)
        }
    }

    newLikes = (value) => {
        let answer
        for (let i = 0; i < this.props.trackLikes.length; i++) {
            if (this.props.trackLikes[i].information.id === value.information.id) {
                answer = true
                break
            } else {
                answer = false
            }
        }
        return answer
    }

    // addAlbPl = (type, id, trackId, index) => {
    //     axios.post(`${config().url}/addAlbPlayTrack`, { type, id, trackId }, config().headers)
    //     let newState = this.state.availableTracks
    //     newState[index] = true
    //     this.setState({
    //         availableTracks: newState
    //     })
    // }

    // removeAlbPl = (id, trackId, index) => {
    //     axios.post(`${config().url}/removeAlbPlayTrack`, { id, trackId }, config().headers)
    //     let newState = this.state.availableTracks
    //     newState[index] = false
    //     this.setState({
    //         availableTracks: newState
    //     })
    // }

    showPlayButton = async (number, button, plIcon, index) => {
        number.style.display = 'none'
        button.style.backgroundColor = 'black'
        button.style.display = 'flex'
        button.style.alignItems = 'center'
        button.style.justifyContent = 'center'
        plIcon.style.display = 'block';
    }

    hidePlayButton = (number, button, plIcon) => {
        number.style.display = 'block'
        button.style.backgroundColor = 'white'
        number.style.display = 'flex'
        number.style.justifyContent = 'center'
        number.style.width = '30px';
        plIcon.style.display = 'none'
    }

    changeValue = () => {
        this.setState({ inputValue: this.searchTrack.value })
    }

    filterTracks = () => {
        if (!this.searchTrack.value) {
            return this.props.tracks
        }
        const display = this.props.tracks.filter(cur => {
            const lower = cur.information.title.toLowerCase()
            const filterLower = this.searchTrack.value.toLowerCase()
            return lower.includes(filterLower)
        })
        return display
    }

    render() {
        const { playlist, type, id, liked, available, path, _id, displayTracks, likes, name, inputValue, mounted } = this.state
        const { match, tracks, trackLikes, deleteLike, addLike, deleteTrack } = this.props
        this.trackLike = []
        this.trackNumber = []
        this.playSong = []
        this.addIcon = []
        this.addIconPl = []

        return (
            <div className="main_container">
                <div className="general_container">
                    <Sidebar current="songs" />
                    <div className="nav_child_container nav_child_container_margin">
                        <div className="explorenav_container">
                            <div className="explorenav_search">
                                <input type="search" placeholder="Search" className="explorenav_search_input" onInput={() => { this.changeValue() }} ref={el => this.searchTrack = el}/>
                            </div>
                            <div className="explorenav_buttons">
                                <p className="display_name">{name}</p>
                            </div>
                        </div>
                        {tracks && trackLikes && mounted ?
                            <div className="top_search_result search_tracks remove_search_border my_tracks">
                                <p className="discography_header_text">Tracks</p>
                                <div my_tracks>
                                    <div className="tracks_header remove_header_border">
                                        <div className="playlist_tracks_header" id="track_number"><p className="u"></p></div>
                                        <p className="playlist_tracks_header" id="track_title" >TRACK</p>
                                        <p className="playlist_tracks_header track_artist">ARTIST</p>
                                        <p className="playlist_tracks_header track_artist">ALBUM</p>
                                        <p className="playlist_tracks_header" id="track_duration">DURATION</p>
                                    </div>
                                    {this.filterTracks().map((track, index) => {
                                        return (
                                            <div className="tracks_header tracks_header_background remove_search_border_top" key={index} onMouseOver={() => this.showPlayButton(this.trackNumber[index], this.playSong[index], this.addIconPl[index], index)} onMouseOut={() => this.hidePlayButton(this.trackNumber[index], this.playSong[index], this.addIconPl[index])}>
                                                <div className="track_number">
                                                    <div className="u" ref={el => this.trackNumber[index] = el}>
                                                        <img src={track.cover} alt="small album cover" style={{ width: '30px', height: '30px', borderRadius: '5px' }} />
                                                    </div>
                                                    <div className="play_track_button" ref={el => this.playSong[index] = el} onClick={() => { this.play('tracks', track.information.id) }}>
                                                        <MdPlayArrow style={{ fontSize: '25px', color: 'white' }} />
                                                    </div>
                                                    <div onClick={() => {this.addToLikes(track, this.trackLike[index])}} ref={el => this.trackLike[index] = el} className={`track_like_holder ${this.newLikes(track) ? 'is_liked' : 'is_unliked'}`}>

                                                        <IoIosHeart className={this.newLikes(track) ? 'track_liked' : 'hide'} id="liked_track" />
                                                        <IoMdHeartEmpty className={this.newLikes(track) ? 'hide' : 'track_not_liked'} id="unliked_track" />
                                                    </div>
                                                </div>
                                                <div className="track_title">
                                                    <p style={{ width: '70%' }}>{trimString(track.information.title, 27)}</p>
                                                    <div className="add_icon_holder">
                                                        <div ref={el => this.addIconPl[index] = el} className="add_library_icon" onClick={() => { deleteTrack(track.albumId, track.information.id) }}>
                                                            <IoIosRemoveCircleOutline className="add_icons_play" />
                                                        </div>
                                                    </div>
                                                    <div style={{ width: '10%' }}>
                                                        {track.information.explicit_lyrics ? <MdExplicit /> : ''}
                                                    </div>
                                                </div>
                                                <p className="track_artist">{trimString(track.information.artist.name, 17)}</p>

                                                <p className="track_album">{trimString(track.albumTitle, 17)}</p>
                                                <p className="track_duration">{trackTime(track.information.duration)}</p>
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

function mapStateToProps(state) {
    if (state.tracks && state.likes) {
        return {
            tracks: state.tracks,
            trackLikes: state.likes.trackLikes
        }
    } else {
        return {
            tracks: '',
            trackLikes: ''
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteLike: (category, data) => dispatch(deleteLike(category, data)),
        addLike: (category, data) => dispatch(addLike(category, data)),
        deleteTrack: (albumId, trackId) => dispatch(deleteTrack(albumId, trackId)),
        getTracks: () => dispatch(getAllTracks()),
        getLikes: () => dispatch(getAllLikes()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTracks)