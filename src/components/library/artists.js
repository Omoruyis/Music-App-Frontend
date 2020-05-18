import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { CircularProgress } from '@material-ui/core';

import { getAllRecent, getAllLikes, getAllAlbums, getAllPlaylists, getAllTracks, changeNumber } from '../../actions'
import Sidebar from '../partials/sidebar'
import LibraryNav from '../partials/librarynav'
import LibraryToggle from '../partials/librarytoggle'

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
        if (this.props.albums && this.props.albums.length) {
            this.getArtistsF(this.props.albums)
        } else if (this.props.albumNumber === 1) {
            this.getArtistsF(this.props.albums)
            this.props.changeNumber('')
        } else {
            this.props.getAlbums()
        }
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.albums !== nextProps.albums && !this.state.artists) {
            this.getArtistsF(nextProps.albums)
        }
        return true 
    }

    getArtistsF(arr) {
        let artists = arr.reduce((obj, album) => {
            const id = album.information.artist.id
            if (!obj[`${id}`]) {
                obj[`${id}`] = {id: album.information.artist.id, name: album.information.artist.name, picture: album.information.artist.picture_medium}
            }
            return obj
        }, {})
        const newArtists = Object.keys(artists).map(cur => artists[cur]).sort((a, b) => a.name > b.name ? 1 : -1)
        this.setState({artists: newArtists})
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
                            <LibraryToggle />
                            <div className="explorenav_search">
                                <input type="search" placeholder="Search Recent" className="explorenav_search_input" onInput={() => { this.changeValue() }} ref={el => this.searchTrack = el} />
                            </div>
                            <LibraryNav history={history} location={location}/>
                        </div>
                        {artists && mounted ? (!artists.length ?
                            <div className="no_playlist">
                                <p className="discography_header_text mobile_empty_playlist">You don't currently have any artist in your library</p>
                            </div> : <div className="top_search_result search_tracks remove_search_border my_tracks mobile_padding">
                                <div className="my_playlists_holder mobile_albart_display">
                                    {this.filterPlaylists().map((artist, index) => {
                                        return (
                                            <div className="explore_artist mobile_artist_album_image" id="discography_playlist_mapped" key={index}>
                                                <div className="explore_artists_images_holder mobile_artist_album_image" onMouseOver={() => this.showIcon(this.playlistImage[index])} onMouseOut={() => this.hideIcon(this.playlistImage[index])}>
                                                    <Link to={`/myartists/${artist.id}`}>
                                                        <img src={artist.picture} ref={el => this.playlistImage[index] = el} alt="album cover" className="explore_artists_images mobile_artist_album_image" />
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
            albums: state.albums,
            albumNumber: state.albumNumber
        }
    } else {
        return {
            albums: '',
            albumNumber: state.albumNumber
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
        changeNumber: (number) => dispatch(changeNumber(number))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyArtists)