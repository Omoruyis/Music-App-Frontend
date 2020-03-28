import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { MdPlayArrow } from "react-icons/md";
import { MdExplicit } from "react-icons/md";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";

import { trimString, trackTime } from '../../helper/helper'

class Tracks extends Component {
    showPlayButton = (number, button, icon, plIcon, index) => {
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
        if (this.props.availableTracks[index] !== true) {
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

    play = (type, id) => {
        this.props.play(type, id)
    }

    addToLikes = (type, obj, clas) => {
        this.props.addToLikes(type, obj, clas)
    }

    newLikes = (value, type) => {
        return this.props.newLikes(value, type)
    }

    addAlbPl = (type, id, trackId, index) => {
        this.props.addAlbPl(type, id, trackId, index)
    }

    removeAlbPl = (id, trackId, index) => {
        this.props.removeAlbPl(id, trackId, index)
    }

    login = () => {
        this.props.history.push(`/login?redirect_link=${this.props.path}/${this.props.match.params.query}/tracks`)
    }

    render() {
        const { loggedIn, path } = this.props
        const { tracks } = this.props.searchResult
        this.trackLike = []
        this.trackNumber = []
        this.playSong = []
        this.addIcon = []
        this.addIconPl = []

        return (
            <div className="top_search_result search_tracks remove_search_border">
                <p className="discography_header_text">{`${tracks.length}  ${tracks.length > 1 ? 'tracks' : 'track'}`}</p>
                <div>
                    <div className="tracks_header">
                        <div className="playlist_tracks_header" id="track_number"><p className="u"></p></div>
                        <p className="playlist_tracks_header" id="track_title" >TRACK</p>
                        <p className="playlist_tracks_header track_artist">ARTIST</p>
                        <p className="playlist_tracks_header track_artist">ALBUM</p>
                        <p className="playlist_tracks_header" id="track_duration">DURATION</p>
                    </div>
                    {tracks.map((track, index) => {
                        return (
                            <div className="tracks_header tracks_header_background remove_search_border_top" key={index} onMouseOver={() => this.showPlayButton(this.trackNumber[index], this.playSong[index], this.addIcon[index], this.addIconPl[index], index)} onMouseOut={() => this.hidePlayButton(this.trackNumber[index], this.playSong[index], this.addIcon[index], this.addIconPl[index])}>
                                <div className="track_number">
                                    <div className="u" ref={el => this.trackNumber[index] = el}>
                                        {/* <p style={{ marginBottom: '0' }}>{index + 1}</p> */}
                                        <img src={track.album.cover} alt="small album cover" style={{ width: '30px', height: '30px', borderRadius: '5px' }} />
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
                                <p className="track_artist">
                                    <Link to={`/${track.artist.type}/${track.artist.id}`} style={{ textDecoration: 'none' }}><p className="turn_red">{trimString(track.artist.name, 17)}</p></Link>
                                </p>

                                <p className="track_album">
                                    <Link to={`/${track.album.type}/${track.album.id}`} style={{ textDecoration: 'none' }}><p className="turn_red">{trimString(track.album.title, 17)}</p></Link>
                                </p>
                                <p className="track_duration">{trackTime(track.duration)}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Tracks