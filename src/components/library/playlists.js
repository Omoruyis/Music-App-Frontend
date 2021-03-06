import React, { Component } from 'react';
import Modal from 'react-modal';
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { CircularProgress } from '@material-ui/core';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { MdPlayArrow } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoIosMusicalNotes } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";

import { createPlaylist, deleteLike, addLike, getAllLikes, getAllPlaylists, getAllTracks, getAllAlbums, getAllRecent, changeSong, changeSource } from '../../actions'
import Sidebar from '../partials/sidebar'
import LibraryNav from '../partials/librarynav'
import LibraryToggle from '../partials/librarytoggle'
import config from '../../config/config'

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

class MyPlaylists extends Component {
    state = {
        name: localStorage.name,
        inputValue: '',
        mounted: false,
        sort: 'Title',
        sortDisplay: 'All',
        type: null,
        id: 0,
        modalIsOpen: false,
        creating: false
    }

    componentDidMount() {
        this.setState({ mounted: true })
        if (!this.props.playlists) {
            this.props.getPlaylists()
        }
        if (!this.props.likes) {
            this.props.getLikes()
        }
    }

    componentWillUnmount() {
        this.props.changeSource('playlist')
        this.props.getAlbums()
        this.props.getTracks()
        this.props.getPlaylists()
        this.props.getLikes()
        this.props.getAllRecent()
    }

    openModal = () => {
        this.setState({ modalIsOpen: true })
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false })
    }

    newLikes = (value) => {
        let answer
        for (let i = 0; i < this.props.playlistLikes.length; i++) {
            if (this.props.playlistLikes[i].information.id === value) {
                answer = true
                break
            } else {
                answer = false
            }
        }
        return answer
    }

    play = (type, id) => {
        this.props.changeSong(id, type)
    }

    addToLikes = (obj, clas, classs) => {
        const currentClass = clas
        const secondClass = currentClass.className.split(' ')
        if (secondClass[1] === 'white_favourite') {
            currentClass.className = `${classs} red_favourite`
            this.props.addLike('playlistLikes', obj)
        } else {
            currentClass.className = `${classs} white_favourite`
            this.props.deleteLike('playlistLikes', obj)
        }
    }

    showIcon = (clas, secClas) => {
        if (clas) {
            clas.style.zIndex = 1
            clas.style.opacity = 1
        }
        secClas.style.opacity = 0.8
    }
    hideIcon = (clas, secClas) => {
        if (clas) {
            clas.style.zIndex = -1
            clas.style.opacity = 0
        }
        secClas.style.opacity = 1
    }

    expandPlay = (clas) => {
        clas.style.width = '35px'
        clas.style.height = '35px'
    }
    shrinkPlay = (clas) => {
        clas.style.width = '30px'
        clas.style.height = '30px'
    }
    expandLike = (clas) => {
        clas.style.width = '35px'
        clas.style.height = '35px'
    }
    shrinkLike = (clas) => {
        clas.style.width = '30px'
        clas.style.height = '30px'
    }

    sortPlaylists = (e) => {
        this.setState({ sort: e.target.value })
    }

    sortDisplayPlaylists = (e) => {
        this.setState({ sortDisplay: e.target.value })
    }

    createNotification = (type, message) => {
        switch (type) {
            case 'success':
                NotificationManager.success('Successfully created playlist', '', 2000);
                break;
            case 'error':
                NotificationManager.error(message, '', 2000);
                break;
            default:
                return ''
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
            this.props.getPlaylists()
            this.props.createPlaylist(this.playlistTitle.value, this.playlistDescription.value)
            this.changeCreate()
            this.createNotification('success', 'Successfully created playlist')
            this.setState({ modalIsOpen: false })
        } catch (e) {
            console.log(e)
        }
    }

    changeValue = () => {
        this.setState({ inputValue: this.searchTrack.value })
    }

    filterPlaylists = () => {
        let display = this.props.playlists
        if (this.state.sort === 'Title') {
            display = display.sort((a, b) => a.information.title.toLowerCase() < b.information.title.toLowerCase() ? -1 : a.information.title.toLowerCase() > b.information.title.toLowerCase() ? 1 : 0)
        } else {
            display = display.sort((a, b) => (b.information.createdAt ? b.information.createdAt : b.createdAt) - (a.information.createdAt ? a.information.createdAt : a.createdAt))
        }
        if (this.state.sortDisplay === 'Own Playlists') {
            display = display.filter(playlist => playlist.personal === true)
        } else if (this.state.sortDisplay === 'Added Playlists') {
            display = display.filter(playlist => playlist.personal === false)
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
        const { mounted, modalIsOpen, creating } = this.state
        const { playlistLikes, playlists, history, location } = this.props
        this.playlistLike = []
        this.playlistNumber = []
        this.playlistImage = []
        this.playPlaylist = []

        return (
            <div className="main_container">
                <div className="general_container">
                    <Sidebar current="playlists" />
                    <div className="nav_child_container nav_child_container_margin">
                        <div className="explorenav_container">
                            <LibraryToggle />
                            <div className="explorenav_search">
                                <input type="search" placeholder="Search Playlists" className="explorenav_search_input" onInput={() => { this.changeValue() }} ref={el => this.searchTrack = el} />
                            </div>
                            <LibraryNav history={history} location={location} />
                        </div>
                        {playlists && playlistLikes && mounted ? (!playlists.length ?
                            <div className="no_playlist mobile_padding">
                                <p className="discography_header_text mobile_empty_playlist">You don't currently have any playlist added</p>
                                <div className="create_playlist make_column mobile_create_playlist" onClick={() => this.openModal()}>
                                    <div className="playlist_add_icon_holder">
                                        <IoMdAdd className="my_playlist_add_icon" />
                                    </div>
                                    <p style={{ marginTop: '30px' }}>Create a playlist</p>
                                </div>
                            </div> : <div className="top_search_result search_tracks remove_search_border my_tracks mobile_padding">
                                <NotificationContainer />
                                <div className="select_holder">
                                    <p className="discography_header_text">{`${this.filterPlaylists().length} ${this.filterPlaylists().length !== 1 ? 'Playlists' : 'Playlist'}`}</p>
                                    <div className="mobile_playlist_sorter">
                                        <select defaultValue="Sort Tracks" style={{ marginRight: '10px' }} onChange={(e) => this.sortDisplayPlaylists(e)} className="select_options">
                                            <option disabled>Display Playlists</option>
                                            <option>All</option>
                                            <option>Own Playlists</option>
                                            <option>Added Playlists</option>
                                        </select>
                                        <select defaultValue="Sort Tracks" onChange={(e) => this.sortPlaylists(e)} className="select_options">
                                            <option disabled>Sort Playlists</option>
                                            <option>Title</option>
                                            <option>Recently Added</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="my_playlists_holder mobile_albart_display">
                                    <div className="create_playlist make_column mobile_artist_album_image mobile_create_playlist mobile_playlist_height" onClick={() => this.openModal()}>
                                        <div className="playlist_add_icon_holder">
                                            <IoMdAdd className="my_playlist_add_icon" />
                                        </div>
                                        <p style={{ marginTop: '30px' }}>Create a playlist</p>
                                    </div>
                                    {this.filterPlaylists().map((playlist, index) => {
                                        if (!playlist.personal) {
                                            return (
                                                <div className="explore_artist mobile_artist_album_image" id="discography_playlist_mapped" key={index}>
                                                    <div className="explore_albums_images_holder mobile_artist_album_image" onMouseOver={() => this.showIcon(this.playlistLike[index], this.playlistImage[index])} onMouseOut={() => this.hideIcon(this.playlistLike[index], this.playlistImage[index])}>
                                                        <Link to={`/myplaylists/${playlist._id}`}>
                                                            <img src={playlist.information.picture_medium} ref={el => this.playlistImage[index] = el} alt="playlist cover" className="explore_albums_images mobile_artist_album_image" />
                                                        </Link>
                                                        <div className="play_holder" ref={el => this.playPlaylist[index] = el} onClick={() => this.play('playlist', playlist.information.id)} onMouseOver={() => this.expandPlay(this.playPlaylist[index])} onMouseOut={() => this.shrinkPlay(this.playPlaylist[index])}>
                                                            <MdPlayArrow style={{ fontSize: '25px' }} />
                                                        </div>
                                                        <div
                                                            className={this.newLikes(playlist.information.id) ? 'favourite_album_holder red_favourite' : 'favourite_album_holder white_favourite'}
                                                            ref={el => this.playlistLike[index] = el}
                                                            onMouseOver={() => this.expandLike(this.playlistLike[index])} onMouseOut={() => this.shrinkLike(this.playlistLike[index])}
                                                            onClick={() => this.addToLikes(playlist, this.playlistLike[index], "favourite_album_holder")}
                                                        >
                                                            <FaRegHeart />
                                                        </div>
                                                    </div>
                                                    <Link to={`/myplaylists/${playlist._id}`} style={{ color: 'black', textDecoration: 'none' }}>
                                                        <p className="explore_artists_name turn_red">{playlist.information.title}</p>
                                                    </Link>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div className="explore_artist mobile_artist_album_image" id="discography_playlist_mapped" key={index}>
                                                    <div className="explore_albums_images_holder mobile_artist_album_image" onMouseOver={() => this.showIcon(undefined, this.playlistImage[index])} onMouseOut={() => this.hideIcon(undefined, this.playlistImage[index])}>
                                                        <Link to={`/myplaylists/${playlist._id}`}>
                                                            {playlist.information.tracks.data.length ? (playlist.information.tracks.data.length < 4 ? <img src={playlist.information.tracks.data[0].album.picture} ref={el => this.playlistImage[index] = el} alt="playlist cover" className="explore_albums_images mobile_artist_album_image" /> : <div className="four_pictures" ref={el => this.playlistImage[index] = el}>
                                                                <img src={playlist.information.tracks.data[0].album.picture} alt="playlist cover" style={{ borderTopLeftRadius: '5px' }} />
                                                                <img src={playlist.information.tracks.data[1].album.picture} alt="playlist cover" style={{ borderTopRightRadius: '5px' }} />
                                                                <img src={playlist.information.tracks.data[2].album.picture} alt="playlist cover" style={{ borderBottomLeftRadius: '5px' }} />
                                                                <img src={playlist.information.tracks.data[3].album.picture} alt="playlist cover" style={{ borderBottomRightRadius: '5px' }} />
                                                            </div>) :
                                                                <div className="empty_playlist_image mobile_artist_album_image" ref={el => this.playlistImage[index] = el}>
                                                                    <IoIosMusicalNotes className="empty_playlist_music_icon" />
                                                                </div>}
                                                        </Link>
                                                    </div>
                                                    <Link to={`/myplaylists/${playlist._id}`} style={{ color: 'black', textDecoration: 'none' }}>
                                                        <p className="explore_artists_name turn_red">{playlist.information.title}</p>
                                                    </Link>
                                                </div>
                                            )
                                        }
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
                    onRequestClose={this.closeModal}
                    style={customStyles}
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
                        <button onClick={this.closeModal} className="modal_cancel_button">Cancel</button>
                        <button className="modal_save_button" id={creating ? 'dim_create' : ''} disabled={creating} onClick={() => this.createNewPlaylist()}>{creating ? "Creating" : "Create"}</button>
                    </div>
                </Modal>


            </div>
        )
    }
}

function mapStateToProps(state) {
    if (state.playlists && state.likes) {
        return {
            playlists: state.playlists,
            playlistLikes: state.likes.playlistLikes
        }
    } else {
        return {
            playlists: '',
            playlistLikes: ''
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteLike: (category, data) => dispatch(deleteLike(category, data)),
        addLike: (category, data) => dispatch(addLike(category, data)),
        getPlaylists: () => dispatch(getAllPlaylists()),
        getLikes: () => dispatch(getAllLikes()),
        getAlbums: () => dispatch(getAllAlbums()),
        getTracks: () => dispatch(getAllTracks()),
        getAllRecent: () => dispatch(getAllRecent()),
        createPlaylist: (title, description) => dispatch(createPlaylist(title, description)),
        changeSong: (id, type) => dispatch(changeSong(id, type)),
        changeSource: (playlist) => dispatch(changeSource(playlist)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPlaylists)