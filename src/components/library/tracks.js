import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import { CircularProgress } from '@material-ui/core';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Modal from 'react-modal';
import { MdPlayArrow } from "react-icons/md";
import { MdExplicit } from "react-icons/md";
import { MdQueueMusic } from "react-icons/md";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { IoIosMore } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";

import { createPlaylist, deleteLike, addLike, deleteTrack, getAllLikes, getAllAlbums, getAllTracks, getAllPlaylists, getAllRecent, changeSong, changeSource } from '../../actions'
import Sidebar from '../partials/sidebar'
import config from '../../config/config'
import LibraryNav from '../partials/librarynav'
import LibraryToggle from '../partials/librarytoggle'
import { trimString, trackTime } from '../../helper/helper'

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

class MyTracks extends Component {
    state = {
        name: localStorage.name,
        inputValue: '',
        searchValue: '',
        mounted: false,
        sort: 'Title',
        type: null,
        id: 0,
        addedTrack: '',
        modalIsOpen: false,
        modalIsOpen2: false,
        creating: false
    }

    componentDidMount() {
        this.setState({ mounted: true })
        this.props.getTracks()
        this.props.getLikes()
        this.props.getPlaylists()
    }

    componentWillUnmount() {
        this.props.getAlbums()
        this.props.getTracks()
        this.props.getPlaylists()
        this.props.getLikes()
        this.props.getAllRecent()
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

    addToPlaylist = track => {
        this.setState({ addedTrack: track, modalIsOpen: true })
    }

    addTrackToPlaylist = async (title) => {
        try {
            this.closeModal()
            const result = await axios.patch(`${config().url}/addtoplaylist`, { title, data: { ...this.state.addedTrack.information, album: { id: this.state.addedTrack.albumId, title: this.state.addedTrack.albumTitle, picture: this.state.addedTrack.cover, type: 'album' } } }, config().headers)
            if (result.data === 'This song is already in this playlist') {
                this.createNotification('error', 'This track already exists in this playlist')
                return
            }
            this.createNotification('success', 'Successfully added track to playlist')
        } catch (e) {
            console.log(e)
        }
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

            const res = await axios.patch(`${config().url}/addtoplaylist`, { title: this.playlistTitle.value, data: { ...this.state.addedTrack.information, album: { id: this.state.addedTrack.albumId, title: this.state.addedTrack.albumTitle, picture: this.state.addedTrack.cover, type: 'album' } } }, config().headers)
            this.props.changeSource('track')
            this.changeCreate()
            this.props.history.push(`/myplaylists/${res.data._id}`)
            this.createNotification('success', 'Successfully created playlist')
            this.setState({ modalIsOpen2: false })
        } catch (e) {
            console.log(e)
        }
    }

    sortTracks = (e) => {
        this.setState({ sort: e.target.value })
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

    changeValue = () => {
        this.setState({ inputValue: this.searchTrack.value })
    }

    filterTracks = () => {
        let display = this.props.tracks
        if (this.state.sort === 'Artist') {
            display = display.sort((a, b) => a.information.artist.name.toLowerCase() < b.information.artist.name.toLowerCase() ? -1 : a.information.artist.name.toLowerCase() > b.information.artist.name.toLowerCase() ? 1 : 0)
        } else if (this.state.sort === 'Title') {
            display = display.sort((a, b) => a.information.title.toLowerCase() < b.information.title.toLowerCase() ? -1 : a.information.title.toLowerCase() > b.information.title.toLowerCase() ? 1 : 0)
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
        const { mounted, modalIsOpen, modalIsOpen2, creating } = this.state
        const { tracks, trackLikes, deleteTrack, history, location } = this.props
        this.trackLike = []
        this.trackNumber = []
        this.playSong = []
        this.addIconPl = []
        this.addPl = []

        return (
            <div className="main_container">
                <div className="general_container">
                    <Sidebar current="songs" />
                    <div className="nav_child_container nav_child_container_margin">
                        <div className="explorenav_container">
                            <LibraryToggle />
                            <div className="explorenav_search">
                                <input type="search" placeholder="Search Songs" className="explorenav_search_input" onInput={() => { this.changeValue() }} ref={el => this.searchTrack = el} />
                            </div>
                            <LibraryNav history={history} location={location} />
                        </div>
                        {tracks && trackLikes && mounted ? (!tracks.length ?
                            <div className="no_track">
                                <p className="discography_header_text">You don't currently have any tracks added</p>
                            </div> : <div className="top_search_result search_tracks remove_search_border my_tracks mobile_padding ">
                                <NotificationContainer />
                                <div className="select_holder">
                                    <p className="discography_header_text">{`${this.filterTracks().length} ${this.filterTracks().length > 1 ? 'Songs' : 'Song'}`}</p>
                                    <select defaultValue="Sort Songs" onChange={(e) => this.sortTracks(e)} className="select_options">
                                        <option disabled>Sort Songs</option>
                                        <option>Title</option>
                                        <option>Artist</option>
                                        <option>Recently Added</option>
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
                                            <div className="tracks_header tracks_header_background remove_search_border_top" key={index} onMouseOver={() => this.showPlayButton(this.trackNumber[index], this.playSong[index], this.addIconPl[index], this.addPl[index], index)} onMouseOut={() => this.hidePlayButton(this.trackNumber[index], this.playSong[index], this.addIconPl[index], this.addPl[index])}>
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
                                                    <p style={{ width: '60%' }}>{trimString(track.information.title, 27)}</p>
                                                    <div className="add_icon_holder" id="add_icon_holder">
                                                        <div ref={el => this.addIconPl[index] = el} className="add_library_icon" onClick={() => { deleteTrack(track.albumId, track.information.id) }}>
                                                            <IoIosRemoveCircleOutline className="add_icons_play" />
                                                            <span className="tooltiptext">Remove from library</span>
                                                        </div>
                                                        <div className='add_library_icon' style={{ marginLeft: '10px' }} ref={el => this.addPl[index] = el} onClick={() => this.addToPlaylist(track)}>
                                                            <IoIosMore />
                                                            <span className="tooltiptext">Add to Playlist</span>
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
    if (state.tracks && state.likes && state.playlists) {
        return {
            playlists: state.playlists,
            tracks: state.tracks,
            trackLikes: state.likes.trackLikes
        }
    } else {
        return {
            playlists: '',
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
        getPlaylists: () => dispatch(getAllPlaylists()),
        getAlbums: () => dispatch(getAllAlbums()),
        getAllRecent: () => dispatch(getAllRecent()),
        createPlaylist: (title, description) => dispatch(createPlaylist(title, description)),
        changeSong: (id, type) => dispatch(changeSong(id, type)),
        changeSource: (source) => dispatch(changeSource(source))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTracks)