import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import Modal from 'react-modal';
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

import { deleteLike, addLike, deleteTrack, getAllLikes, getAllTracks, getAllPlaylists, addTrack, deleteFromPlaylist, deletePlaylist, deletePersonalPlaylist, editPlaylist, changeSong } from '../../actions'
import Sidebar from '../partials/sidebar'
import LibraryNav from '../partials/librarynav'
import { trimString, trackTime, time } from '../../helper/helper'

import '../../App.css';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 200
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '575px',
        height: '360px',
        padding: '30px 50px'
    }
};

Modal.setAppElement('#root');

class PlaylistTracks extends Component {
    state = {
        name: localStorage.name,
        inputValue: '',
        mounted: false,
        sort: 'Title',
        type: null,
        id: 0,
        playlist: '',
        modalIsOpen: false, 
        index: ''
    }

    componentDidMount() {
        this.setState({ mounted: true })
        this.props.getTracks()
        this.props.getPlaylists()
        this.props.getLikes()
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.source === 'playlist' && this.props.playlists.length && nextProps.playlists.length && this.props.playlists.length === nextProps.playlists.length && !this.state.playlist) {
            this.setState({ playlist: this.props.playlists.filter(playlist => playlist._id === this.props.match.params.id)[0] })
            this.props.playlists.forEach((cur, index) => {
                if (cur._id === this.props.match.params.id) {
                    this.setState({index})
                }
            })
        }
        if (this.props.source === 'track' && nextProps.playlists.length && this.props.playlists.length !== nextProps.playlists.length && !this.state.playlist) {
            this.setState({ playlist: nextProps.playlists.filter(playlist => playlist._id === this.props.match.params.id)[0] })
            nextProps.playlists.forEach((cur, index) => {
                if (cur._id === this.props.match.params.id) {
                    this.setState({index})
                }
            })
        }
        return true
    }

    openModal = () => {
        this.setState({ modalIsOpen: true })
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false })
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

    addToLikes = (obj, clas, personal) => {
        const currentClass = clas
        const secondClass = currentClass.className.split(' ')
        const s = clas.querySelector('#liked_track')
        const u = clas.querySelector('#unliked_track')
        if (secondClass[1] === 'is_liked') {
            s.style.display = 'none'
            u.style.display = 'block'
            u.style.color = 'black'
            currentClass.className = "track_like_holder is_unliked"
            this.props.deleteLike('trackLikes',  { information: obj, albumId: obj.album.id, albumTitle: obj.album.title, cover: !personal ? obj.album.cover : obj.album.picture })
        } else {
            s.style.display = 'block'
            s.style.color = 'red'
            u.style.display = 'none'
            currentClass.className = "track_like_holder is_liked"
            this.props.addLike('trackLikes', { information: obj, albumId: obj.album.id, albumTitle: obj.album.title, cover: !personal ? obj.album.cover : obj.album.picture })
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

    addAlbPl = (data) => {
        this.props.addTrack({ information: data })
    }

    removeAlbPl = (albumId, trackId) => {
        this.props.deleteTrack(albumId, trackId)
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

    addPlaylistToLikes = (obj, clas) => {
        if (clas === 'like') {
            this.props.addLike('playlistLikes', obj)
        } else {
            this.props.deleteLike('playlistLikes', obj)
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
        this.props.deletePlaylist(id, 'playlists')
        this.props.history.push('/my_playlists')
    }

    deleteFromPlaylist = (id, title) => {
        this.props.deleteFromPlaylist(id, title)
    }

    deletePersonalPlaylist = (_id) => {
        this.props.deletePersonalPlaylist(_id)
        this.props.history.push('/my_playlists')
    }

    editPlaylist = (_id, title, description) => {
        this.props.editPlaylist(_id, title, description)
        this.closeModal()
    }

    getValue = () => {
        let display = this.props.playlists.filter(playlist => playlist._id === this.props.match.params.id)[0]
        return display
    }

    changeValue = () => {
        this.setState({ inputValue: this.searchTrack.value })
    }

    filterTracks = () => {
        let display = this.props.playlists.filter(playlist => playlist._id === this.props.match.params.id)[0].information.tracks.data
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
        const { mounted, playlist, modalIsOpen } = this.state
        const { trackLikes, history, location } = this.props
        this.trackLike = []
        this.trackNumber = []
        this.playSong = []
        this.addIcon = []
        this.addIconPl = []

        return (
            <div>
                <div className="main_container">
                    <div className="general_container">
                        <Sidebar current="playlists" />
                        <div className="nav_child_container nav_child_container_margin">
                            <div className="explorenav_container">
                                <div className="explorenav_search">
                                    <input type="search" placeholder="Search Playlist" className="explorenav_search_input" onInput={() => { this.changeValue() }} ref={el => this.searchTrack = el} />
                                </div>
                                <LibraryNav history={history} location={location}/>
                            </div>
                            {playlist && trackLikes && mounted ? <div>
                                <div className="top_search_result search_tracks remove_search_border my_tracks">
                                    <div className="playlist_header" style={{ marginBottom: '30px' }} id="playlist_header">
                                        {!playlist.personal ? <img src={playlist.information.picture_medium} alt="playlist-cover" className="playlist_image" /> : (this.filterTracks().length ? (playlist.information.tracks.data.length < 4 ? <img src={playlist.information.tracks.data[0].album.picture} alt="playlist cover" className="playlist_image" /> : <div className="four_pictures_second">
                                        <img src={playlist.information.tracks.data[0].album.picture} alt="playlist cover" style={{borderTopLeftRadius: '5px'}}/>
                                        <img src={playlist.information.tracks.data[1].album.picture} alt="playlist cover" style={{borderTopRightRadius: '5px'}}/>
                                        <img src={playlist.information.tracks.data[2].album.picture} alt="playlist cover" style={{borderBottomLeftRadius: '5px'}}/>
                                        <img src={playlist.information.tracks.data[3].album.picture} alt="playlist cover" style={{borderBottomRightRadius: '5px'}}/>
                                        </div>) : <div className="empty_playlist_image">
                                            <IoIosMusicalNotes className="empty_playlist_music_icon" />
                                        </div>)}
                                        <div className="playlist_details_holder">
                                            <p className="playlist_title">{trimString(this.getValue().information.title, 17)}</p>
                                            {playlist.personal ?
                                                <p>{trimString(this.getValue().information.description, 30)}</p> : ''}
                                            <div className="playlist_duration">
                                                {!playlist.personal ?
                                                    <p className="dura">{playlist.nb_tracks} {playlist.information.nb_tracks !== 1 ? 'tracks' : 'track'}</p> :
                                                    <p className="dura">{this.getValue().information.tracks.data.length} {playlist.information.tracks.data.length !== 1 ? 'tracks' : 'track'}</p>}
                                                {!playlist.personal ?
                                                    <p className="playlist_time">{time(playlist.information.duration)}</p> :
                                                    <p className="playlist_time">{time(this.calculateTime(this.getValue()))}</p>}
                                            </div>
                                        </div>
                                        {!playlist.personal ? <div className="play_holder" ref={el => this.playTop = el} onClick={() => this.play('playlist', playlist.information.id)} onMouseOver={() => this.expandPlay(this.playTop)} onMouseOut={() => this.shrinkPlay(this.playTop)}>
                                            <MdPlayArrow style={{ fontSize: '25px' }} />
                                        </div> : ''}
                                    </div>
                                    <div className="playlist_actions_holder">
                                        {!playlist.personal ? <div className="playlist_button_holder">
                                            <button className="playlist_button" id="playlist_listen" onClick={() => this.play('playlist', playlist.information.id)}>
                                                <MdPlayCircleOutline className="playlist_button_icon" />
                                                Listen
                                            </button>
                                            <button className="playlist_button" onClick={() => this.deletePlaylist(playlist.information.id)}>
                                                <IoMdRemove className="playlist_button_icon" />
                                                Remove
                                            </button>
                                                {!this.liked() ?
                                                    <button className="playlist_button" onClick={() => this.addPlaylistToLikes(playlist, 'like')}>
                                                        <IoMdHeartEmpty className="playlist_button_icon" />
                                                Like
                                            </button> :
                                                    <button className="playlist_button" id="unlike_button" onClick={() => this.addPlaylistToLikes(playlist, 'unlike')}>
                                                        <IoIosHeartDislike className="playlist_button_icon" />
                                                Unlike
                                            </button>}
                                        </div> : 
                                        <div className="playlist_button_holder">
                                            <button className="playlist_button" onClick={() => this.openModal()}>
                                                <IoMdRemove className="playlist_button_icon" />
                                                Edit
                                            </button>
                                        </div>}
                                    </div>
                                    <div className="select_holder">
                                        <p className="discography_header_text">{`${this.filterTracks().length} ${this.filterTracks().length !== 1 ? 'Songs' : 'Song'}`}</p>
                                    </div>
                                    <div>
                                        <div className="tracks_header remove_header_border">
                                            <div className="playlist_tracks_header" id="track_number"><p className="u"></p></div>
                                            <p className="playlist_tracks_header" id="track_title" >TRACK</p>
                                            <p className="playlist_tracks_header track_artist">ARTIST</p>
                                            <p className="playlist_tracks_header track_artist">ALBUM</p>
                                            <p className="playlist_tracks_header" id="track_duration">DURATION</p>
                                        </div>
                                        {this.filterTracks().map((track, index) => {
                                            if (track) {
                                                return (
                                                    <div className="tracks_header tracks_header_background remove_search_border_top" key={index} onMouseOver={() => {
                                                        !playlist.personal ? this.showPlayButton(this.trackNumber[index], this.playSong[index], this.addIcon[index], this.addIconPl[index], track.id) : this.showPlayButton(this.trackNumber[index], this.playSong[index], undefined, this.addIconPl[index])
                                                    }} onMouseOut={() => {
                                                        !playlist.personal ? this.hidePlayButton(this.trackNumber[index], this.playSong[index], this.addIcon[index], this.addIconPl[index]) : this.hidePlayButton(this.trackNumber[index], this.playSong[index], undefined, this.addIconPl[index])
                                                    }}>
                                                        <div className="track_number">
                                                            <div className="u" ref={el => this.trackNumber[index] = el}>
                                                                <img src={!playlist.personal ? track.album.cover : track.album.picture} alt="small album cover" style={{ width: '30px', height: '30px', borderRadius: '5px' }} />
                                                            </div>
                                                            <div className="play_track_button" ref={el => this.playSong[index] = el} onClick={() => { this.play('tracks', track.id) }}>
                                                                <MdPlayArrow style={{ fontSize: '25px', color: 'white' }} />
                                                            </div>
                                                            <div onClick={() => { this.addToLikes(track, this.trackLike[index], playlist.personal) }} ref={el => this.trackLike[index] = el} className={`track_like_holder ${this.newLikes(track.id) ? 'is_liked' : 'is_unliked'}`}>

                                                                <IoIosHeart className={this.newLikes(track.id) ? 'track_liked' : 'hide'} id="liked_track" />
                                                                <IoMdHeartEmpty className={this.newLikes(track.id) ? 'hide' : 'track_not_liked'} id="unliked_track" />
                                                            </div>
                                                        </div>
                                                        <div className="track_title">
                                                            <p style={{ width: '70%' }}>{trimString(track.title, 27)}</p>
                                                            {!playlist.personal ?
                                                                <div className="add_icon_holder">
                                                                    <div ref={el => this.addIcon[index] = el} className="add_library_icon" onClick={() => { this.addAlbPl(track) }}>
                                                                        <IoIosAddCircleOutline className="add_icons_play" />
                                                                        <span className="tooltiptext">Add to library</span>
                                                                    </div>
                                                                    <div ref={el => this.addIconPl[index] = el} className="add_library_icon" onClick={() => { this.removeAlbPl(track.album.id, track.id) }}>
                                                                        <IoIosRemoveCircleOutline className="add_icons_play" />
                                                                        <span className="tooltiptext">Remove from library</span>
                                                                    </div>
                                                                </div> :
                                                                <div className="add_icon_holder">
                                                                    <div ref={el => this.addIconPl[index] = el} className="add_library_icon" onClick={() => { this.deleteFromPlaylist(track.id, playlist.information.title) }}>
                                                                        <IoIosRemoveCircleOutline className="add_icons_play" />
                                                                        <span className="tooltiptext">Remove from playlist</span>
                                                                    </div>
                                                                </div>}
                                                            <div style={{ width: '10%' }}>
                                                                {track.explicit_lyrics ? <MdExplicit /> : ''}
                                                            </div>
                                                        </div>
                                                        <Link to={`/${track.artist.type}/${track.artist.id}`} style={{ textDecoration: 'none', color: 'black' }} className="track_artist"><p className="turn_red">{trimString(track.artist.name, 17)}</p></Link>

                                                        <Link to={`/${track.album.type}/${track.album.id}`} style={{ textDecoration: 'none', color: 'black' }} className="track_album"><p className="turn_red">{trimString(track.album.title, 17)}</p></Link>
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
                </div>

                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                >
                    <p className="modal_create_playlist">Edit your playlist</p>
                    <div className="modal_playlist_title">
                        <p>What should we call your playlist?</p>
                        <input type="text" defaultValue={playlist ? this.getValue().information.title : ''} placeholder="Playlist name" ref={el => this.playlistTitle = el} />
                    </div>
                    <div className="modal_playlist_title">
                        <p>Give some information about your playlist</p>
                        <input type="text" defaultValue={playlist ? this.getValue().information.description : ''} placeholder="Enter a description for playlist (optional)" ref={el => this.playlistDescription = el} />
                    </div>
                    <div className="modal_buttons">
                        <button onClick={() => this.deletePersonalPlaylist(playlist._id)} className="modal_cancel_button">Delete Playlist</button>
                        <button className="modal_save_button" onClick={() => this.editPlaylist(playlist._id, this.playlistTitle.value, this.playlistDescription.value)}>Save</button>
                    </div>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state) {
    if (state.playlists && state.likes) {
        return {
            tracks: state.tracks,
            playlists: state.playlists,
            trackLikes: state.likes.trackLikes,
            playlistLikes: state.likes.playlistLikes,
            source: state.source
        }
    } else {
        return {
            tracks: '',
            playlists: '',
            trackLikes: '',
            playlistLikes: '',
            source: state.source
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteLike: (category, data) => dispatch(deleteLike(category, data)),
        addLike: (category, data) => dispatch(addLike(category, data)),
        addTrack: (data) => dispatch(addTrack(data)),
        deleteTrack: (albumId, trackId) => dispatch(deleteTrack(albumId, trackId)),
        deleteFromPlaylist: (id, title) => dispatch(deleteFromPlaylist(id, title)),
        deletePlaylist: (id, category) => dispatch(deletePlaylist(id, category)),
        getPlaylists: () => dispatch(getAllPlaylists()),
        deletePersonalPlaylist: (_id) => dispatch(deletePersonalPlaylist(_id)),
        editPlaylist: (_id, title, description) => dispatch(editPlaylist(_id, title, description)),
        getLikes: () => dispatch(getAllLikes()),
        getTracks: () => dispatch(getAllTracks()),
        changeSong: (id, type) => dispatch(changeSong(id, type))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistTracks)