import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { MdPlayArrow } from "react-icons/md";
import { MdExplicit } from "react-icons/md";
import { IoIosHeart } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";

import { trimString, trackTime } from '../../helper/helper'

class Tracks extends Component {
    state = {
        sort: 'Title'
    }

    componentDidMount() {
        this.props.clearValue()
    }

    checkAvailable = (value) => { 
        let answer
        for (let i = 0; i < this.props.tracks.length; i++) {
            if (this.props.tracks[i].information.id === value) {
                answer = true
                break
            } else {
                answer = false
            }
        }
        return answer
    }

    showPlayButton = (number, button, icon, plIcon, id) => {
        number.style.display = 'none'
        button.style.backgroundColor = 'black'
        button.style.display = 'flex'
        button.style.alignItems = 'center'
        button.style.justifyContent = 'center'
        if (!this.checkAvailable(id)) {
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

    addAlbPl = (data) => {
        this.props.addTrack(data)
    }

    removeAlbPl = (albumId, trackId) => {
        this.props.deleteTrack(albumId, trackId)
    }

    sortTracks = (e) => {
        this.setState({ sort: e.target.value })
    }

    filterTracks = () => {
        let display = this.props.trackLikes
        if (this.state.sort === 'Artist') {
            display = display.sort((a, b) => a.information.artist.name < b.information.artist.name ? -1 : a.information.artist.name > b.information.artist.name ? 1 : 0)
        } else if (this.state.sort === 'Title') {
            display = display.sort((a, b) => a.information.title < b.information.title ? -1 : a.information.title > b.information.title ? 1 : 0)
        } else {
            display = display.sort((a, b) => b.createdAt - a.createdAt)
        }
        if (!this.props.inputValue) {
            return display
        }
        if (this.props.inputValue) {
            display = display.filter(cur => {
                const lower = cur.information.title.toLowerCase()
                const filterLower = this.props.inputValue.toLowerCase()
                return lower.includes(filterLower)
            })
        }
        return display
    }

    render() {
        const { trackLikes, deleteLike } = this.props
        this.trackNumber = []
        this.playSong = []
        this.addIcon = []
        this.addIconPl = []

        return (
            <div>
                {!trackLikes.length ? <div className="no_favourites">
                        <p className="discography_header_text">You don't currently have any favourite tracks added</p>
                    </div> :
                    <div className="top_search_result search_tracks remove_search_border my_tracks">
                        <div className="select_options_holder">
                            <select defaultValue="Sort Tracks" onChange={(e) => this.sortTracks(e)} className="select_options">
                                <option disabled>Sort Tracks</option>
                                <option>Title</option>
                                <option>Artist</option>
                                <option>Recently Liked</option>
                            </select>
                        </div>
                        <div className="tracks_mobile_display">
                            <div className="tracks_header remove_header_border">
                                <div className="playlist_tracks_header" id="track_number"><p className="u"></p></div>
                                <p className="playlist_tracks_header" id="track_title" >TRACK</p>
                                <p className="playlist_tracks_header track_artist">ARTIST</p>
                                <p className="playlist_tracks_header track_artist">ALBUM</p>
                                <p className="playlist_tracks_header" id="track_duration">DURATION</p>
                            </div>
                            {this.filterTracks().map((track, index) => {
                                return (
                                    <div className="tracks_header tracks_header_background" key={index} onMouseOver={() => this.showPlayButton(this.trackNumber[index], this.playSong[index], this.addIcon[index], this.addIconPl[index], track.information.id)} onMouseOut={() => this.hidePlayButton(this.trackNumber[index], this.playSong[index], this.addIcon[index], this.addIconPl[index])}>
                                        <div className="track_number">
                                            <div className="u" ref={el => this.trackNumber[index] = el}>
                                                {/* <p style={{ marginBottom: '0' }}>{index + 1}</p> */}
                                                <img src={track.information.album.picture} alt="small album cover" style={{ width: '30px', height: '30px', borderRadius: '5px' }} />
                                            </div>
                                            <div className="play_track_button" ref={el => this.playSong[index] = el} onClick={() => this.play('tracks', track.information.id)}>
                                                <MdPlayArrow style={{ fontSize: '25px', color: 'white' }} />
                                            </div>
                                            <div className='track_like_holder is_liked' onClick={() => deleteLike('trackLikes', track)}>
                                                <IoIosHeart className='track_liked' id="liked_track" />
                                            </div>
                                        </div>
                                        <div className="track_title">
                                            <p style={{ width: '70%' }}>{trimString(track.information.title, 27)}</p>
                                            <div className="add_icon_holder">
                                                <div ref={el => this.addIcon[index] = el} className="add_library_icon" onClick={() => {this.addAlbPl(track)}}>
                                                    <IoIosAddCircleOutline className="add_icons_play" />
                                                    <span className="tooltiptext">Add to library</span>
                                                </div>
                                                <div ref={el => this.addIconPl[index] = el} className="add_library_icon" onClick={() => { this.removeAlbPl(track.information.album.id, track.information.id) }}>
                                                    <IoIosRemoveCircleOutline className="add_icons_play" />
                                                    <span className="tooltiptext">Remove from library</span>
                                                </div>
                                            </div>
                                            <div style={{ width: '10%' }}>
                                                {track.explicit_lyrics ? <MdExplicit /> : ''}
                                            </div>
                                        </div>
                                        <Link to={`/${track.information.artist.type}/${track.information.artist.id}`} className="track_artist" style={{ textDecoration: 'none', color: 'black' }}><p className="turn_red">{trimString(track.information.artist.name, 17)}</p></Link>
                                        <Link to={`/${track.information.album.type}/${track.information.album.id}`} className="track_album" style={{ textDecoration: 'none', color: 'black' }}><p className="turn_red">{trimString(track.information.album.title, 17)}</p></Link>
                                        <p className="track_duration">{trackTime(track.information.duration)}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>}
            </div>
        )
    }
}

export default Tracks