import React, { Component } from 'react';
import { connect } from 'react-redux'
import { CircularProgress } from '@material-ui/core';
import { MdPlayArrow } from "react-icons/md";
import { MdExplicit } from "react-icons/md";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";

import { deleteLike, addLike, deleteTrack, getAllLikes, getAllTracks } from '../../actions'
import Sidebar from '../partials/sidebar'
import { trimString, trackTime } from '../../helper/helper'

import '../../App.css';

class MyPlaylists extends Component {
    state = {
        name: localStorage.name,
        inputValue: '',
        mounted: false,
        sort: 'Title',
        displayTracks: null,
        type: null,
        id: 0,
    }

    componentDidMount() {
        this.setState({ mounted: true })
        this.props.getTracks()
        this.props.getLikes()
    }

    shouldComponentUpdate() {
        return true
    }

    play = (type, id) => {
        this.setState({
            type,
            id
        })
    }

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
            this.props.deleteLike('trackLikes', obj)
        } else {
            s.style.display = 'block'
            s.style.color = 'red'
            u.style.display = 'none'
            currentClass.className = "track_like_holder is_liked"
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

    showPlayButton = async (number, button, plIcon, index) => {
        number.style.display = 'none'
        button.style.backgroundColor = 'black'
        button.style.display = 'flex'
        button.style.alignItems = 'center'
        button.style.justifyContent = 'center'
        plIcon.style.display = 'block';
        plIcon.style.position = 'relative'
    }

    hidePlayButton = (number, button, plIcon) => {
        number.style.display = 'block'
        button.style.backgroundColor = 'white'
        number.style.display = 'flex'
        number.style.justifyContent = 'center'
        number.style.width = '30px';
        plIcon.style.display = 'none'
    }

    sortTracks = (e) => {
        console.log(e.target.value)
        this.setState({ sort: e.target.value })
    }

    changeValue = () => {
        this.setState({ inputValue: this.searchTrack.value })
    }

    filterTracks = () => {
        let display = this.props.tracks
        if (this.state.sort === 'Artist') {
            display = display.sort((a, b) => a.information.artist.name < b.information.artist.name ? -1 : a.information.artist.name > b.information.artist.name ? 1 : 0)
        } else if (this.state.sort === 'Title') {
            display = display.sort((a, b) => a.information.title < b.information.title ? -1 : a.information.title > b.information.title ? 1 : 0)
        } else {
            display = display.sort((a, b) => (b.information.createdAt ? b.information.createdAt : b.createdAt) - (a.information.createdAt ? a.information.createdAt : a.createdAt))
        }
        if (!this.searchTrack.value) {
            return display
        }
        if (this.searchTrack.value) {
            display = display.filter(cur => {
                const lower = cur.information.title.toLowerCase()
                const filterLower = this.searchTrack.value.toLowerCase()
                return lower.includes(filterLower)
            })
        }
        return display
    }

    render() {
        const { type, id, name, mounted } = this.state
        const { tracks, trackLikes, deleteTrack } = this.props
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
                                <input type="search" placeholder="Search Tracks" className="explorenav_search_input" onInput={() => { this.changeValue() }} ref={el => this.searchTrack = el} />
                            </div>
                            <div className="explorenav_buttons">
                                <p className="display_name">{name}</p>
                            </div>
                        </div>
                        {tracks && trackLikes && mounted ? (!tracks.length ?
                            <div className="no_track">
                                <p className="discography_header_text">You don't currently have any tracks added</p>
                            </div> : <div className="top_search_result search_tracks remove_search_border my_tracks">
                                <div className="select_holder">
                                    <p className="discography_header_text">Tracks</p>
                                    <select defaultValue="Sort Tracks" onChange={(e) => this.sortTracks(e)} className="select_options">
                                        <option disabled>Sort Tracks</option>
                                        <option>Title</option>
                                        <option>Artist</option>
                                        <option>Recently Added</option>
                                    </select>
                                </div>
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
                                                    <div onClick={() => { this.addToLikes(track, this.trackLike[index]) }} ref={el => this.trackLike[index] = el} className={`track_like_holder ${this.newLikes(track) ? 'is_liked' : 'is_unliked'}`}>

                                                        <IoIosHeart className={this.newLikes(track) ? 'track_liked' : 'hide'} id="liked_track" />
                                                        <IoMdHeartEmpty className={this.newLikes(track) ? 'hide' : 'track_not_liked'} id="unliked_track" />
                                                    </div>
                                                </div>
                                                <div className="track_title">
                                                    <p style={{ width: '70%' }}>{trimString(track.information.title, 27)}</p>
                                                    <div className="add_icon_holder">
                                                        <div ref={el => this.addIconPl[index] = el} className="add_library_icon" onClick={() => { deleteTrack(track.albumId, track.information.id) }}>
                                                            <IoIosRemoveCircleOutline className="add_icons_play" />
                                                            <span className="tooltiptext">Remove from library</span>
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
                            </div>)
                            :
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

export default connect(mapStateToProps, mapDispatchToProps)(MyPlaylists)