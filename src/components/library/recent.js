import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { CircularProgress } from '@material-ui/core';

import { getAllRecent, getAllLikes, getAllAlbums, getAllPlaylists, getAllTracks } from '../../actions'
import Sidebar from '../partials/sidebar'
import LibraryNav from '../partials/librarynav'
import LibraryToggle from '../partials/librarytoggle'

import '../../App.css';


class Recent extends Component {
    state = {
        name: localStorage.name,
        inputValue: '',
        mounted: false,
    }

    componentDidMount() {
        this.setState({ mounted: true })
        this.props.getAllRecent()
    }

    componentWillUnmount() {
        this.props.getAlbums()
        this.props.getTracks()
        this.props.getPlaylists()
        this.props.getLikes()
        this.props.getAllRecent()
    }

    showIcon = (secClas) => {
        secClas.style.opacity = 0.8
    }
    hideIcon = (secClas) => {
        secClas.style.opacity = 1
    }

    changeValue = () => {
        this.setState({ inputValue: this.searchTrack.value })
    }

    filterPlaylists = () => {
        let display = this.props.recent
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
        const { mounted } = this.state
        const { recent, history, location } = this.props
        this.playlistImage = []

        return (
            <div className="main_container">
                <div className="general_container">
                    <Sidebar current="recent" />
                    <div className="nav_child_container nav_child_container_margin">
                        <div className="explorenav_container">
                            <LibraryToggle />
                            <div className="explorenav_search">
                                <input type="search" placeholder="Search Recent" className="explorenav_search_input" onInput={() => { this.changeValue() }} ref={el => this.searchTrack = el} />
                            </div>
                            <LibraryNav history={history} location={location}/>
                        </div>
                        {recent && mounted ? (!recent.length ?
                            <div className="no_playlist">
                                <p className="discography_header_text">You don't currently have anything added</p>
                            </div> : <div className="top_search_result search_tracks remove_search_border my_tracks">
                                <div className="my_playlists_holder">
                                    {this.filterPlaylists().map((playlist, index) => {
                                        return (
                                            <div className="explore_artist" id="discography_playlist_mapped" key={index}>
                                                <div className="explore_albums_images_holder" onMouseOver={() => this.showIcon(this.playlistImage[index])} onMouseOut={() => this.hideIcon(this.playlistImage[index])}>
                                                    <Link to={playlist.information.type === 'album' ? `/myalbums/${playlist._id}` : `/myplaylists/${playlist._id}`}>
                                                        <img src={playlist.information.type === 'album' ? playlist.information.cover_medium : playlist.information.picture_medium} ref={el => this.playlistImage[index] = el} alt="album cover" className="explore_albums_images" />
                                                    </Link>
                                                </div>
                                                <Link to={playlist.information.type === 'album' ? `/myalbums/${playlist._id}` : `/myplaylists/${playlist._id}`} style={{ color: 'black', textDecoration: 'none' }}>
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
            </div>
        )
    }
}

function mapStateToProps(state) {
    if (state.recent) {
        return {
            recent: state.recent,
        }
    } else {
        return {
            recent: '',
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllRecent: () => dispatch(getAllRecent()),
        getAlbums: () => dispatch(getAllAlbums()),
        getLikes: () => dispatch(getAllLikes()),
        getPlaylists: () => dispatch(getAllPlaylists()),
        getTracks: () => dispatch(getAllTracks()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Recent)