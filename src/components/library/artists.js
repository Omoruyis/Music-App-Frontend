import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { CircularProgress } from '@material-ui/core';

import { getAllRecent, getAllLikes, getAllAlbums, getAllPlaylists, getAllTracks, getAllArtists } from '../../actions'
import Sidebar from '../partials/sidebar'

import '../../App.css';


class MyArtists extends Component {
    state = {
        name: localStorage.name,
        inputValue: '',
        mounted: false,
    }

    componentDidMount() {
        this.setState({ mounted: true })
        this.props.getArtists()
    }

    componentWillUnmount() {
        this.props.getAlbums()
        this.props.getTracks()
        this.props.getPlaylists()
        this.props.getLikes()
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
        let display = this.props.artists
        if (!this.searchTrack.value) {
            return display
        }
        if (this.searchTrack.value) {
            display = display.filter(cur => {
                const lower = cur.name.toLowerCase()
                const filterLower = this.searchTrack.value.toLowerCase()
                return lower.includes(filterLower)
            })
        }
        return display
    }

    render() {
        const { name, mounted } = this.state
        const { artists } = this.props
        this.playlistImage = []

        return (
            <div className="main_container">
                <div className="general_container">
                    <Sidebar current="artists" />
                    <div className="nav_child_container nav_child_container_margin">
                        <div className="explorenav_container">
                            <div className="explorenav_search">
                                <input type="search" placeholder="Search Recent" className="explorenav_search_input" onInput={() => { this.changeValue() }} ref={el => this.searchTrack = el} />
                            </div>
                            <div className="explorenav_buttons">
                                <p className="display_name">{name}</p>
                            </div>
                        </div>
                        {artists && mounted ? (!artists.length ?
                            <div className="no_playlist">
                                <p className="discography_header_text">You don't currently have any artist in your library</p>
                            </div> : <div className="top_search_result search_tracks remove_search_border my_tracks">
                                <div className="my_playlists_holder">
                                    {this.filterPlaylists().map((artist, index) => {
                                        return (
                                            <div className="explore_artist" id="discography_playlist_mapped" key={index}>
                                                <div className="explore_artists_images_holder" onMouseOver={() => this.showIcon(this.playlistImage[index])} onMouseOut={() => this.hideIcon(this.playlistImage[index])}>
                                                    <Link to={`/myalbums/${artist.id}`}>
                                                        <img src={artist.picture} ref={el => this.playlistImage[index] = el} alt="album cover" className="explore_artists_images" />
                                                    </Link>
                                                </div>
                                                <Link to={`/myalbums/${artist._id}`} style={{ color: 'black', textDecoration: 'none' }}>
                                                    <p className="explore_artists_name turn_red">{artist.name}</p>
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
    if (state.artists) {
        return {
            artists: state.artists,
        }
    } else {
        return {
            artists: '',
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllRecent: () => dispatch(getAllRecent()),
        getAlbums: () => dispatch(getAllAlbums()),
        getLikes: () => dispatch(getAllLikes()),
        getPlaylists: () => dispatch(getAllPlaylists()),
        getArtists: () => dispatch(getAllArtists()),
        getTracks: () => dispatch(getAllTracks())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyArtists)