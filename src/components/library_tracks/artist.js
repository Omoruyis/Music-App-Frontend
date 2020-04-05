import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { CircularProgress } from '@material-ui/core';
import { FaRegHeart } from "react-icons/fa";

import { deleteLike, addLike, getAllLikes, getAllAlbums, getAllPlaylists, getAllTracks } from '../../actions'
import Sidebar from '../partials/sidebar'
import LibraryNav from '../partials/librarynav'

import '../../App.css';


class ArtistAlbums extends Component {
    state = {
        name: localStorage.name,
        inputValue: '',
        mounted: false,
        sort: 'Title',
        type: null,
        id: 0,
        modalIsOpen: false
    }

    componentDidMount() {
        this.setState({ mounted: true })
        if (!this.props.albums) {
            this.props.getAlbums()
        }
        if (!this.props.likes) {
            this.props.getLikes()
        }
    }

    componentWillUnmount() {
        this.props.getAlbums()
        this.props.getTracks()
        this.props.getPlaylists()
        this.props.getLikes()
    }

    newLikes = (value) => {
        let answer
        for (let i = 0; i < this.props.albumLikes.length; i++) {
            if (this.props.albumLikes[i].information.id === value) {
                answer = true
                break
            } else {
                answer = false
            }
        }
        return answer
    }

    addToLikes = (obj, clas, classs) => {
        const currentClass = clas
        const secondClass = currentClass.className.split(' ')
        if (secondClass[1] === 'white_favourite') {
            currentClass.className = `${classs} red_favourite`
            this.props.addLike('albumLikes', obj)
        } else {
            currentClass.className = `${classs} white_favourite`
            this.props.deleteLike('albumLikes', obj)
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

    changeValue = () => {
        this.setState({ inputValue: this.searchTrack.value })
    }

    filterPlaylists = () => {
        let display = this.props.albums.filter(album => album.information.artist.id === parseFloat(this.props.match.params.id))
        if (this.state.sort === 'Title') {
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
        const { type, id, mounted } = this.state
        const { albumLikes, albums, history } = this.props
        this.playlistLike = []
        this.playlistNumber = []
        this.playlistImage = []
        this.playPlaylist = []

        return (
            <div className="main_container">
                <div className="general_container">
                    <Sidebar current="artists" />
                    <div className="nav_child_container nav_child_container_margin">
                        <div className="explorenav_container">
                            <div className="explorenav_search">
                                <input type="search" placeholder="Search Albums" className="explorenav_search_input" onInput={() => { this.changeValue() }} ref={el => this.searchTrack = el} />
                            </div>
                            <LibraryNav history={history}/>
                        </div>
                        {albums && albumLikes && mounted ? (!albums.length ?
                            <div className="no_playlist">
                                <p className="discography_header_text">You don't currently have any album added</p>
                            </div> : <div className="top_search_result search_tracks remove_search_border my_tracks">
                                <div className="select_holder">
                                    <p className="discography_header_text">{`${this.filterPlaylists().length} ${this.filterPlaylists().length !== 1 ? 'Albums' : 'Album'}`}</p>
                                    <div>
                                        <select defaultValue="Sort Tracks" onChange={(e) => this.sortPlaylists(e)} className="select_options">
                                            <option disabled>Sort Albums</option>
                                            <option>Title</option>
                                            <option>Recently Added</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="my_playlists_holder">
                                    {this.filterPlaylists().map((playlist, index) => {
                                        return (
                                            <div className="explore_artist" id="discography_playlist_mapped" key={index}>
                                                <div className="explore_albums_images_holder" onMouseOver={() => this.showIcon(this.playlistLike[index], this.playlistImage[index])} onMouseOut={() => this.hideIcon(this.playlistLike[index], this.playlistImage[index])}>
                                                    <Link to={`/myalbums/${playlist._id}`}>
                                                        <img src={playlist.information.cover_medium} ref={el => this.playlistImage[index] = el} alt="album cover" className="explore_albums_images" />
                                                    </Link>
                                                    <div
                                                        className={this.newLikes(playlist.information.id) ? 'favourite_album_holder red_favourite' : 'favourite_album_holder white_favourite'}
                                                        ref={el => this.playlistLike[index] = el}
                                                        onMouseOver={() => this.expandLike(this.playlistLike[index])} onMouseOut={() => this.shrinkLike(this.playlistLike[index])}
                                                        onClick={() => this.addToLikes(playlist, this.playlistLike[index], "favourite_album_holder")}
                                                    >
                                                        <FaRegHeart />
                                                    </div>
                                                </div>
                                                <Link to={`/myalbums/${playlist._id}`} style={{ color: 'black', textDecoration: 'none' }}>
                                                    <p className="explore_artists_name turn_red">{playlist.information.title}</p>
                                                </Link>
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
    if (state.albums && state.likes) {
        return {
            albums: state.albums,
            albumLikes: state.likes.albumLikes
        }
    } else {
        return {
            albums: '',
            albumLikes: ''
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteLike: (category, data) => dispatch(deleteLike(category, data)),
        addLike: (category, data) => dispatch(addLike(category, data)),
        getAlbums: () => dispatch(getAllAlbums()),
        getLikes: () => dispatch(getAllLikes()),
        getPlaylists: () => dispatch(getAllPlaylists()),
        getTracks: () => dispatch(getAllTracks()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistAlbums)