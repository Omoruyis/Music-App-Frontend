import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { CircularProgress } from '@material-ui/core';

import { getAllRecent, getAllLikes, getAllAlbums, getAllPlaylists, getAllTracks, getAllArtists } from '../../actions'
import Sidebar from '../partials/sidebar'
import LibraryNav from '../partials/librarynav'

import '../../App.css';


class MyArtists extends Component {
    state = {
        name: localStorage.name,
        inputValue: '',
        mounted: false,
        artists: ''
    }

    componentDidMount() {
        this.setState({ mounted: true })
        if (this.props.albums) {
            this.getArtistsF()
        } else {
            this.props.getAlbums()
        }
        // this.props.getArtists()
    }

    // shouldComponentUpdate(nextProps) {
    //     if (this.props.albums !== nextProps.albums && !this.state.artists) {
    //         let artists = nextProps.albums.map(album => album.information.artist)
    //         this.setState({artists})
    //     }
    //     return true 
    // }

    getArtistsF() {
        let artists = this.props.albums.map(album => `${album.information.artist.id}*****${album.information.artist.name}*****${album.information.artist.picture_medium}`)
        console.log(artists)
        const newArtists = new Set(artists)
        console.log(newArtists)
        this.setState({artists})
    }

    componentWillUnmount() {
        this.props.getAlbums()
        this.props.getTracks()
        this.props.getPlaylists()
        this.props.getLikes()
        this.props.getAllRecent()
        this.props.getArtists()
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
        let display = this.state.artists
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
        const { mounted, artists } = this.state
        const { history, location } = this.props
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
                            <LibraryNav history={history} location={location}/>
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
                                                    <Link to={`/myartists/${artist.id}`}>
                                                        <img src={artist.picture_medium} ref={el => this.playlistImage[index] = el} alt="album cover" className="explore_artists_images" />
                                                    </Link>
                                                </div>
                                                <Link to={`/myartists/${artist.id}`} style={{ color: 'black', textDecoration: 'none' }}>
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
    if (state.albums) {
        return {
            // artists: state.artists,
            albums: state.albums 
        }
    } else {
        return {
            albums: '',
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