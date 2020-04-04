import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { CircularProgress } from '@material-ui/core';
import { MdPlayArrow } from "react-icons/md";
import { MdPlayCircleOutline } from "react-icons/md";
import { IoIosMusicalNotes } from "react-icons/io";
import { MdExplicit } from "react-icons/md";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { IoIosHeartDislike } from "react-icons/io";
import { IoMdRemove } from "react-icons/io";

import { deleteLike, addLike, deleteTrack, getAllLikes, getAllAlbums, deletePlaylist } from '../../actions'
import Sidebar from '../partials/sidebar'
import { trimString, trackTime, time } from '../../helper/helper'

import '../../App.css';

class AlbumTracks extends Component {
    state = {
        name: localStorage.name,
        inputValue: '',
        mounted: false,
        sort: 'Title',
        type: null,
        id: 0,
        album: '',
    }

    componentDidMount() {
        this.setState({ mounted: true })
        this.props.getAlbums()
        this.props.getLikes()
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.albums !== nextProps.albums) {
            this.setState({ album: nextProps.albums.filter(album => album._id === this.props.match.params.id)[0] })
        }
        return true
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
            this.props.addLike('trackLikes', { information: obj, albumId: obj.album.id, albumTitle: obj.album.title, cover: obj.album.picture })
        }
    }

    newLikes = (value) => {
        let answer
        for (let i = 0; i < this.props.trackLikes.length; i++) {
            if (this.props.trackLikes[i].information.id === value) {
                answer = true
                break
            } else {
                answer = false
            }
        }
        return answer
    }

    removeAlbPl = (albumId, trackId) => {
        this.props.deleteTrack(albumId, trackId)
    }

    liked = () => {
        if (!this.state.playlist) {
            return
        }
        let answer
        for (let i = 0; i < this.props.playlistLikes.length; i++) {
            if (this.props.playlistLikes[i].information.id === this.state.playlist.information.id) {
                answer = true
                break
            } else {
                answer = false
            }
        }
        return answer
    }

    showPlayButton = async (number, button, icon, plIcon, id) => {
        number.style.display = 'none'
        button.style.backgroundColor = 'black'
        button.style.display = 'flex'
        button.style.alignItems = 'center'
        button.style.justifyContent = 'center'
        if (icon !== undefined) {
            if (!this.checkAvailable(id)) {
                icon.style.display = 'block';
                icon.style.position = 'relative'
                plIcon.style.display = 'none';
            } else {
                icon.style.display = 'none';
                plIcon.style.display = 'block';
                plIcon.style.position = 'relative'
            }
        } else {
            plIcon.style.display = 'block';
            plIcon.style.position = 'relative';
        }
    }

    hidePlayButton = (number, button, icon, plIcon) => {
        number.style.display = 'block'
        button.style.backgroundColor = 'white'
        number.style.display = 'flex'
        number.style.justifyContent = 'center'
        number.style.width = '30px';
        if (icon !== undefined) {
            icon.style.display = 'none';
            plIcon.style.display = 'none'
        } else {
            plIcon.style.display = 'none'
        }
    }

    calculateTime = (playlist) => {
        if (!playlist.information.tracks.data.length) {
            return 0
        }
        const time = playlist.information.tracks.data.reduce((total, cur) => {
            return total + cur.duration
        }, 0)
        return time
    }

    deletePlaylist = (id) => {
        this.props.deletePlaylist(id, 'albums')
        this.props.history.push('/my_albums')
    }

    changeValue = () => {
        this.setState({ inputValue: this.searchTrack.value })
    }

    filterTracks = () => {
        let display = this.props.albums.filter(album => album._id === this.props.match.params.id)[0].information.tracks.data.sort((a, b) => a.number - b.number)
        if (!this.searchTrack.value) {
            return display
        }
        if (this.searchTrack.value) {
            display = display.filter(cur => {
                const lower = cur.title.toLowerCase()
                const filterLower = this.searchTrack.value.toLowerCase()
                return lower.includes(filterLower)
            })
        }
        return display
    }

    render() {
        const { type, id, name, mounted, album } = this.state
        const { trackLikes, deleteTrack, albums } = this.props
        this.trackLike = []
        this.trackNumber = []
        this.playSong = []
        this.addIcon = []
        this.addIconPl = []

        return (
            <div>
                <div className="main_container">
                    <div className="general_container">
                        <Sidebar current="albums" />
                        <div className="nav_child_container nav_child_container_margin">
                            <div className="explorenav_container">
                                <div className="explorenav_search">
                                    <input type="search" placeholder="Search Playlist" className="explorenav_search_input" onInput={() => { this.changeValue() }} ref={el => this.searchTrack = el} />
                                </div>
                                <div className="explorenav_buttons">
                                    <p className="display_name">{name}</p>
                                </div>
                            </div>
                            {album && trackLikes && mounted ? <div>
                                <div className="top_search_result search_tracks remove_search_border my_tracks">
                                    <div className="playlist_header" style={{ marginBottom: '30px' }} id="playlist_header">
                                        <img src={album.information.cover_medium} alt="playlist-cover" className="playlist_image" />
                                        <div className="playlist_details_holder">
                                            <p className="playlist_title">{album.information.title}</p>
                                            <Link to={`/${album.information.artist.type}/${album.information.artist.id}`} style={{ color: 'black', textDecoration: 'none' }}>
                                                <p className="explore_artists_name turn_red">{album.information.artist.name}</p>
                                            </Link>
                                            <div className="playlist_duration">
                                                <p className="dura">{album.information.tracks.data.length} {album.information.nb_tracks !== 1 ? 'tracks' : 'track'}</p>
                                                <p className="playlist_time">{time(album.information.duration)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="playlist_actions_holder">
                                        <div className="playlist_button_holder">
                                            <button className="playlist_button" onClick={() => this.deletePlaylist(album.information.id)}>
                                                <IoMdRemove className="playlist_button_icon" />
                                                Remove
                                            </button>
                                            {!this.liked() ?
                                                <button className="playlist_button" >
                                                    <IoMdHeartEmpty className="playlist_button_icon" />
                                                Like
                                            </button> :
                                                <button className="playlist_button" id="unlike_button" >
                                                    <IoIosHeartDislike className="playlist_button_icon" />
                                                Unlike
                                            </button>}
                                        </div>
                                    </div>
                                    <div className="select_holder">
                                        <p className="discography_header_text">{`${this.filterTracks().length} ${this.filterTracks().length !== 1 ? 'Songs' : 'Song'}`}</p>
                                    </div>
                                    <div>
                                    <div className="tracks_header">
                                        <div className="playlist_tracks_header" id="track_album_number"><p className="u">#</p></div>
                                        <p className="playlist_tracks_header" id="track_album_title" >TRACK</p>
                                        <p className="playlist_tracks_header" id="track_album_duration">DURATION</p>
                                    </div>
                                        {this.filterTracks().map((track, index) => {
                                            if (track) {
                                                return (
                                                    <div className="tracks_header tracks_header_background remove_search_border_top" key={index} onMouseOver={() => this.showPlayButton(this.trackNumber[index], this.playSong[index], this.addIcon[index], this.addIconPl[index], track.id)} onMouseOut={() => this.hidePlayButton(this.trackNumber[index], this.playSong[index], this.addIcon[index], this.addIconPl[index])}>
                                                        <div className="track_number">
                                                            <div className="u" ref={el => this.trackNumber[index] = el}>
                                                                {track.number}
                                                            </div>
                                                            <div className="play_track_button" ref={el => this.playSong[index] = el} onClick={() => { this.play('tracks', track.id) }}>
                                                                <MdPlayArrow style={{ fontSize: '25px', color: 'white' }} />
                                                            </div>
                                                            <div onClick={() => { this.addToLikes(track, this.trackLike[index]) }} ref={el => this.trackLike[index] = el} className={`track_like_holder ${this.newLikes(track.id) ? 'is_liked' : 'is_unliked'}`}>

                                                                <IoIosHeart className={this.newLikes(track.id) ? 'track_liked' : 'hide'} id="liked_track" />
                                                                <IoMdHeartEmpty className={this.newLikes(track.id) ? 'hide' : 'track_not_liked'} id="unliked_track" />
                                                            </div>
                                                        </div>
                                                        <div className="track_album_title">
                                                            <p style={{ width: '70%' }}>{trimString(track.title, 27)}</p>
                                                            <div className="add_icon_holder">
                                                                <div ref={el => this.addIconPl[index] = el} className="add_library_icon" onClick={() => { this.removeAlbPl(track.album.id, track.id) }}>
                                                                    <IoIosRemoveCircleOutline className="add_icons_play" />
                                                                    <span className="tooltiptext">Remove from library</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ width: '10%' }}>
                                                                {track.explicit_lyrics ? <MdExplicit /> : ''}
                                                            </div>
                                                        </div>
                                                        <p className="track_duration">{trackTime(track.duration)}</p>
                                                    </div>
                                                )
                                            } else {
                                                return <div>
                                                    <p>You don't have any track in this playlist</p>
                                                </div>
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>
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
            </div>
        )
    }
}

function mapStateToProps(state) {
    if (state.albums && state.likes) {
        return {
            albums: state.albums,
            trackLikes: state.likes.trackLikes,
            albumLikes: state.likes.albumLikes
        }
    } else {
        return {
            albums: '',
            trackLikes: '',
            albumLikes: ''
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteLike: (category, data) => dispatch(deleteLike(category, data)),
        addLike: (category, data) => dispatch(addLike(category, data)),
        deleteTrack: (albumId, trackId) => dispatch(deleteTrack(albumId, trackId)),
        deletePlaylist: (id, category) => dispatch(deletePlaylist(id, category)),
        getAlbums: () => dispatch(getAllAlbums()),
        getLikes: () => dispatch(getAllLikes()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumTracks)