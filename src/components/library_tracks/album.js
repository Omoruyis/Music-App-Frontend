import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import axios from 'axios'
import Modal from 'react-modal';
import { CircularProgress } from '@material-ui/core';
import { MdPlayArrow } from "react-icons/md";
import { MdExplicit } from "react-icons/md";
import { MdQueueMusic } from "react-icons/md";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { IoIosHeartDislike } from "react-icons/io";
import { IoMdRemove } from "react-icons/io";
import { IoIosMore } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";


import { deleteLike, addLike, deleteTrackFromAlbum, getAllLikes, getAllAlbums, getAllPlaylists, deletePlaylist, deleteEmptyAlbum, changeSong, changeSource, changeNumber } from '../../actions'
import Sidebar from '../partials/sidebar'
import config from '../../config/config'
import LibraryNav from '../partials/librarynav'
import { trimString, trackTime, time } from '../../helper/helper'

import 'react-notifications/lib/notifications.css';
import '../../App.css';

const customStyles = {
    overlay: {
        backgroundColor: 'none',
        zIndex: 200
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '250px',
        height: '450px',
        padding: '10px 10px',
        border: 'none',
        boxShadow: '0 0 6px rgba(25, 25, 34, .16)'
    }
};

const customStyles2 = {
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

class AlbumTracks extends Component {
    state = {
        name: localStorage.name,
        inputValue: '',
        mounted: false,
        searchValue: '',
        addedTrack: '',
        sort: 'Title',
        type: null,
        id: 0,
        album: '',
        modalIsOpen: false,
        modalIsOpen2: false,
        creating: false, 
        // index: ''
    }

    componentDidMount() {
        this.setState({ mounted: true })
        this.props.getAlbums()
        this.props.getPlaylists()
        this.props.getLikes()
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.albums && !this.state.album) {
            // nextProps.albums.forEach((album, index) => { 
            //     if (album._id === this.props.match.params.id) {
            //         this.setState({ index})
            //     }
            // })
            const filtered = nextProps.albums.filter(album => album._id === this.props.match.params.id)
            if (filtered.length) {
                this.setState({ album: filtered[0] })
            } else {
                this.setState({ album: 'bad request'})
            }
        }
        return true
    }

    openModal = (number) => {
        if (number) {
            this.setState({ modalIsOpen2: true })
        } else {
            this.setState({ modalIsOpen: true })
        }
    }

    closeModal = (number) => {
        if (number) {
            this.setState({ modalIsOpen2: false })
        } else {
            this.setState({ modalIsOpen: false })
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
            this.props.deleteLike('trackLikes', { information: obj, albumId: this.state.album.information.id, albumTitle: this.state.album.information.title, cover: this.state.album.information.cover_small })
        } else {
            s.style.display = 'block'
            s.style.color = 'red'
            u.style.display = 'none'
            currentClass.className = "track_like_holder is_liked"
            this.props.addLike('trackLikes', { information: obj, albumId: this.state.album.information.id, albumTitle: this.state.album.information.title, cover: this.state.album.information.cover_small })
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

    removeAlbPl = (trackId) => {
        // if (this.props.albums[this.state.index].information.tracks.data.length === 1) {
        if (this.getValue().information.tracks.data.length === 1) {
            this.props.changeNumber(this.props.albums.length)
            this.props.deletePlaylist(this.state.album.information.id, 'albums')
            const mySource = this.props.albumSource
            
            this.props.history.push(mySource === 'artist' ? '/my_artists' : '/my_albums')
        } else {
            this.props.deleteTrackFromAlbum(this.state.album.information.id, trackId)
        }
        
    }

    liked = () => {
        if (!this.state.album) {
            return
        }
        let answer
        for (let i = 0; i < this.props.albumLikes.length; i++) {
            if (this.props.albumLikes[i].information.id === this.state.album.information.id) {
                answer = true
                break
            } else {
                answer = false
            }
        }
        return answer
    }

    showPlayButton = async (number, button, plIcon, pl) => {
        number.style.display = 'none'
        button.style.backgroundColor = 'black'
        button.style.display = 'flex'
        button.style.alignItems = 'center'
        button.style.justifyContent = 'center'
        plIcon.style.display = 'block';
        plIcon.style.position = 'relative'
        pl.classList.add('show_playlist_icon')
        
    }

    hidePlayButton = (number, button, plIcon, pl) => {
        number.style.display = 'block'
        button.style.backgroundColor = 'white'
        number.style.display = 'flex'
        number.style.justifyContent = 'center'
        number.style.width = '30px';
        plIcon.style.display = 'none'
        // pl.style.display = 'none'
        pl.classList.remove('show_playlist_icon')
    }

    addAlbumToLikes = (obj, clas) => {
        if (clas === 'like') {
            this.props.addLike('albumLikes', obj)
        } else {
            this.props.deleteLike('albumLikes', obj)
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
        this.props.changeNumber(this.props.albums.length)
        this.props.deletePlaylist(id, 'albums')
        const mySource = this.props.albumSource
        this.props.history.push(mySource === 'artist' ? '/my_artists' : '/my_albums')
    }

    addToPlaylist = track => {
        this.setState({ addedTrack: track, modalIsOpen: true })
    }

    createNotification = (type, message) => {
        switch (type) {
            case 'success':
                NotificationManager.success(message, '', 2000);
                break;
            case 'error':
                NotificationManager.error(message, '', 2000);
                break;
            default:
                return ''
        }
    }

    addTrackToPlaylist = async (title) => {
        try {
            const result = await axios.patch(`${config().url}/addtoplaylist`, { title, data: { ...this.state.addedTrack, album: { id: this.state.album.information.id, title: this.state.album.information.title, picture: this.state.album.information.cover_small, type: 'album' } } }, config().headers)
        if (result.data === 'This song is already in this playlist') {
            this.createNotification('error', result.data)
            return
        }
        this.closeModal()
        this.createNotification('success', 'Successfully added track to playlist')
        } catch (e) {
            console.log(e)
        }
    }

    changeInput = () => {
        this.setState({ searchValue: this.modalSearch.value })
    }

    filterPlaylists = () => {
        let display = this.props.playlists ? this.props.playlists.filter(playlist => playlist.personal === true) : ''
        if (this.modalSearch && !this.modalSearch.value) {
            return display
        }
        if (this.modalSearch && this.modalSearch.value) {
            display = display.filter(cur => {
                const lower = cur.information.title.toLowerCase()
                const filterLower = this.modalSearch.value.toLowerCase()
                return lower.includes(filterLower)
            })
        }
        return display
    }

    changeCreate = () => {
        this.setState({
            creating: !this.state.creating
        })
    }

    createNewPlaylist = async () => {
        try {
            let answer
        if (!this.playlistTitle.value) {
            return this.createNotification('error', 'Please input a title')
        }
        for (let i = 0; i < this.props.playlists.length; i++) {
            if (this.props.playlists[i].information.title === this.playlistTitle.value) {
                answer = true
                break
            } else {
                answer = false
            }
        }
        if (answer) {
            return this.createNotification('error', 'This playlist already exists')
        }
        this.changeCreate()
        await axios.post(`${config().url}/createplaylist`, { title: this.playlistTitle.value, description: this.playlistDescription.value }, config().headers)

        const res = await axios.patch(`${config().url}/addtoplaylist`, { title: this.playlistTitle.value, data: { ...this.state.addedTrack, album: { id: this.state.album.information.id, title: this.state.album.information.title, picture: this.state.album.information.cover_small, type: 'album' } } }, config().headers)
        this.props.changeSource('track')
        this.changeCreate()
        this.props.history.push(`/myplaylists/${res.data._id}`)
        this.createNotification('success', 'Successfully created playlist')
        this.setState({ modalIsOpen2: false })
        } catch (e) {
            console.log(e)
        }
    }

    getValue = () => {
        let display = this.props.albums.filter(album => album._id === this.props.match.params.id)[0]
        return display
    }

    getTime = () => {
        let display = this.getValue().information.tracks.data.reduce((total, track) => {
            total = total + track.duration
            return total
        }, 0)
        return display
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
        const { mounted, album, modalIsOpen, modalIsOpen2, creating } = this.state
        const { trackLikes, history, location } = this.props
        this.trackLike = []
        this.trackNumber = []
        this.playSong = []
        this.addIcon = []
        this.addIconPl = []
        this.addPl = []

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
                                <LibraryNav history={history} location={location}/>
                            </div>
                            {album && trackLikes && mounted ? <div>
                                {album === 'bad request' ? 
                                <div className="no_playlist no_result">
                                    <p className="discography_header_text">404, page not found</p>
                                </div> : 
                                <div>
                                    <NotificationContainer />
                                    <div className="top_search_result search_tracks remove_search_border my_tracks">
                                        <div className="playlist_header" style={{ marginBottom: '30px' }} id="playlist_header">
                                            <img src={album.information.cover_medium} alt="playlist-cover" className="playlist_image" />
                                            <div className="playlist_details_holder">
                                                <p className="playlist_title">{trimString(this.getValue().information.title, 17)}</p>
                                                <Link to={`/${album.information.artist.type}/${album.information.artist.id}`} style={{ color: 'black', textDecoration: 'none' }}>
                                                    <p className="explore_artists_name turn_red">{trimString(album.information.artist.name, 20)}</p>
                                                </Link>
                                                <div className="playlist_duration">
                                                    <p className="dura">{this.getValue().information.tracks.data.length} {this.getValue().information.nb_tracks !== 1 ? 'tracks' : 'track'}</p>
                                                    <p className="playlist_time">{time(this.getTime())}</p>
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
                                                    <button className="playlist_button" onClick={() => this.addAlbumToLikes(album, 'like')}>
                                                        <IoMdHeartEmpty className="playlist_button_icon" />
                                                    Like
                                                </button> :
                                                    <button className="playlist_button" id="unlike_button" onClick={() => this.addAlbumToLikes(album, 'unlike')}>
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
                                                return (
                                                    <div className="tracks_header tracks_header_background remove_search_border_top" key={index} onMouseOver={() => this.showPlayButton(this.trackNumber[index], this.playSong[index], this.addIconPl[index], this.addPl[index], index)} onMouseOut={() => this.hidePlayButton(this.trackNumber[index], this.playSong[index], this.addIconPl[index], this.addPl[index])}>
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
                                                                <div ref={el => this.addIconPl[index] = el} className="add_library_icon" onClick={() => { this.removeAlbPl(track.id) }}>
                                                                    <IoIosRemoveCircleOutline className="add_icons_play" />
                                                                    <span className="tooltiptext">Remove from library</span>
                                                                </div>
                                                                <div className='add_library_icon' style={{ marginLeft: '10px' }} ref={el => this.addPl[index] = el} onClick={() => this.addToPlaylist(track)}>
                                                                    <IoIosMore />
                                                                    <span className="tooltiptext">Add to Playlist</span>
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
                                            {album.information.tracks.data.length !== album.information.nb_tracks ? <Link to={`/${album.information.type}/${album.information.id}`} style={{ textDecoration: 'none', color: 'black' }}><p className="turn_red" style={{ marginTop: '30px' }}>See complete album</p></Link> : ''}
                                        </div>
                                    </div>
                                </div>}
                                
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
                    onRequestClose={() => this.closeModal()}
                    style={customStyles}
                >
                    <input placeholder="Search" className="add_playlist_search" ref={el => this.modalSearch = el} onInput={this.changeInput} />
                    <div className="search_text_holder">
                        <p className="modal_add_playlist_text">Select</p>
                    </div>
                    <div className="search_text_holder" onClick={() => {
                        this.openModal(2)
                        this.closeModal()
                    }}>
                        <div className="search_momdal_add_icon_holder">
                            <IoMdAdd className="my_playlist_add_icon" />
                        </div>
                        <p className="modal_add_playlist_text modal_margin_left">New Playlist</p>
                    </div>
                    {this.filterPlaylists() ? this.filterPlaylists().map((playlist, index) => {
                        return (
                            <div key={index} className="search_text_holder" onClick={() => this.addTrackToPlaylist(playlist.information.title)}>
                                <MdQueueMusic style={{ fontSize: '25px' }} />
                                <p className="modal_add_playlist_text modal_margin_left">{playlist.information.title}</p>
                            </div>
                        )
                    }) : ''}
                </Modal>


                <Modal
                    isOpen={modalIsOpen2}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={() => this.closeModal(2)}
                    style={customStyles2}
                >
                    <p className="modal_create_playlist">Create a playlist</p>
                    <div className="modal_playlist_title">
                        <p>What should we call your playlist?</p>
                        <input type="text" placeholder="Playlist name" ref={el => this.playlistTitle = el} />
                    </div>
                    <div className="modal_playlist_title">
                        <p>Give some information about your playlist</p>
                        <input type="text" placeholder="Enter a description for playlist (optional)" ref={el => this.playlistDescription = el} />
                    </div>
                    <div className="modal_buttons">
                        <button onClick={() => this.closeModal(2)} className="modal_cancel_button">Cancel</button>
                        <button className="modal_save_button" id={creating ? 'dim_create' : ''} disabled={creating} onClick={this.createNewPlaylist}>{creating ? "Creating" : "Create"}</button>
                    </div>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state) {
    if (state.albums && state.likes && state.playlists) {
        return {
            albums: state.albums,
            playlists: state.playlists,
            trackLikes: state.likes.trackLikes,
            albumLikes: state.likes.albumLikes,
            albumSource: state.albumSource
        }
    } else {
        return {
            albums: '',
            playlists: '',
            trackLikes: '',
            albumLikes: '',
            albumSource: state.albumSource
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteLike: (category, data) => dispatch(deleteLike(category, data)),
        addLike: (category, data) => dispatch(addLike(category, data)),
        deleteTrackFromAlbum: (albumId, trackId) => dispatch(deleteTrackFromAlbum(albumId, trackId)),
        deleteEmptyAlbum: (albumId) => dispatch(deleteEmptyAlbum(albumId)),
        deletePlaylist: (id, category) => dispatch(deletePlaylist(id, category)),
        getAlbums: () => dispatch(getAllAlbums()),
        getLikes: () => dispatch(getAllLikes()),
        getPlaylists: () => dispatch(getAllPlaylists()),
        changeSong: (id, type) => dispatch(changeSong(id, type)),
        changeSource: (source) => dispatch(changeSource(source)),
        changeNumber: (number) => dispatch(changeNumber(number)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumTracks)