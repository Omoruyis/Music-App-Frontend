import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { MdPlayArrow } from "react-icons/md";
import { MdExplicit } from "react-icons/md";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";

import { trimString } from '../../helper/helper'

import '../../App.css';

class Discography extends Component {
    showPlayButton = (number, button) => {
        number.style.display = 'none'
        button.style.backgroundColor = 'black'
        button.style.display = 'flex'
        button.style.alignItems = 'center'
        button.style.justifyContent = 'center'
    }

    hidePlayButton = (number, button) => {
        number.style.display = 'block'
        button.style.backgroundColor = 'white'
        number.style.display = 'flex'
        number.style.justifyContent = 'center'
        number.style.width = '30px';
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

    likeUndownloadAction = (type, obj, action) => {
        this.props.likeUndownloadAction(type, obj, action)
    }

    login = () => {
        this.props.history.push(`/login?redirect_link=${this.props.path}/${this.props.match.params.id}`)
    }

    render() {
        const { topTracks, loggedIn, match, path } = this.props
        this.trackLike = []
        this.playlistLike = []
        this.trackNumber = []
        this.playSong = []

        return (
            <div>
                <div className="discography_first">
                    {topTracks.mostPlayed ? <div className="discography_top_tracks">
                        <p className="discography_header_text">Top Tracks</p>
                        <div className="discography_mapped_container">
                            {topTracks.mostPlayed.map((track, index) => {
                                return (
                                    <div className="tracks_header remove_border_top" key={index} onMouseOver={() => this.showPlayButton(this.trackNumber[index], this.playSong[index])} onMouseOut={() => this.hidePlayButton(this.trackNumber[index], this.playSong[index])}>
                                        <div className="track_number_discograph">
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
                                        <div className="track_album_title_discograph">
                                            <p style={{ width: '70%', marginBottom: '0' }}>{trimString(track.title, 27)}</p>
                                            <div style={{ width: '10%' }}>
                                                {track.explicit_lyrics ? <MdExplicit /> : ''}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <Link to={`/${path}/${match.params.id}/top_tracks`} style={{ textDecoration: 'none', width: '100%' }}>
                                <div className="discography_see_more_tracks">See more tracks</div>
                            </Link>
                        </div>
                    </div> : ''}
                    {topTracks.playlists ? <div className="discography_playlists">
                        <p className="discography_header_text">Playlists</p>
                        <div>
                            {topTracks.playlists.map((cur, index) => {
                                if (index < 4) {
                                    return (
                                        <div className="discography_playlist" key={index}>
                                            <div style={{ width: '30%' }}>
                                                <img src={cur.picture} className="discography_playlist_image" />
                                            </div>
                                            <Link to={`/${cur.type}/${cur.id}`} style={{ textDecoration: 'none', width: '60%', color: 'black' }}>
                                                <p className="turn_red" style={{ marginBottom: '0' }}>{trimString(cur.title, 11)}</p>
                                            </Link>
                                        </div>
                                    )
                                } else { return '' }
                            })}
                            <Link to={`/${path}/${match.params.id}/playlists`} style={{ textDecoration: 'none', width: '100%' }}>
                                <div className="discography_see_more_tracks">See more playlists</div>
                            </Link>
                        </div>
                    </div> : ''}
                </div>
            </div>
        )
    }
}

export default Discography