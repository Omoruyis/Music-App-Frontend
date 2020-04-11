import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import Discography from '../artist_discography/discography'
import TopTracks from '../artist_discography/top_tracks'
import ArtistPlaylists from '../artist_discography/playlist'
import ArtistAlbums from '../artist_discography/album'
import SimilarArtist from '../artist_discography/similar_artist'
import { CircularProgress } from '@material-ui/core';
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosHeartDislike } from "react-icons/io";

import { getAllAlbums, getAllPlaylists, getAllLikes, getAllTracks, getAllRecent, changeSong } from '../../actions'
import Nav from '../partials/nav'
import Sidebar from '../partials/sidebar'
import config from '../../config/config'

import '../../App.css';

class Artist extends Component {
    state = {
        path: null,
        playlist: null,
        liked: false,
        type: null,
        id: 0,
        likes: null,
        availableTracks: [],
        url: this.props.match.params.id
    }

    componentDidMount() {
        this.getPathName()
        this.checkLogin()
        this.getPlaylist(this.props.match.params.id)
    }

    componentWillUnmount() {
        if (!this.props.loggedIn) {
            return
        }
        this.props.getAlbums()
        this.props.getTracks()
        this.props.getPlaylists()
        this.props.getLikes()
        this.props.getAllRecent()
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.url !== nextProps.match.params.id) {
            this.setState({ playlist: null })
            this.checkLogin()
            this.getPlaylist(nextProps.match.params.id)
            this.setState({ url: nextProps.match.params.id })
        }
        return true
    }

    getPathName = () => {
        const path = this.props.location.pathname.split('/')[1]
        this.setState({
            path
        })
    }

    checkLogin = async () => {
        if (!this.props.loggedIn) {
            return
        }
        this.getLikes()
        this.checkLike(parseInt(this.props.match.params.id), 'artist')
    }

    getPlaylist = async (value) => {
        try {
            const result = await axios.post(`${config().url}/search/artist`, { id: parseInt(value) }, config().headers)
            if (this.props.loggedIn) {
                console.log(result.data)
                let availableTracks = []
                if (!result.data.tracklist || !result.data.tracklist.length) {
                    this.setState({
                        playlist: result.data,
                    })
                } else {
                    result.data.tracklist.forEach(async (cur, index) => {
                        const res = await axios.post(`${config().url}/checkTrackInAlbum`, { id: cur.album.id, trackId: cur.id }, config().headers)
                        availableTracks[index] = res.data
                        if (index === (result.data.tracklist.length - 1)) {
                            this.setState({
                                playlist: result.data,
                            })
                        }
                    })
                    this.setState({
                        availableTracks
                    })
                }
            } else {
                this.setState({
                    playlist: result.data,
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    getLikes = async () => {
        try {
            if (!this.props.loggedIn) {
                return
            }
            const result = await axios.get(`${config().url}/getlikes`, config().headers)
            this.setState({
                likes: result.data
            })
        } catch (e) {
            console.log(e)
        }
    }

    checkLike = async (id, type) => {
        try {
            const result = await axios.post(`${config().url}/checklike`, { id, type }, config().headers)
            this.setState({
                liked: result.data
            })
        } catch (e) {
            console.log(e)
        }
    }

    addAlbPl = (type, id, trackId, index) => {
        axios.post(`${config().url}/addAlbPlayTrack`, { type, id, trackId }, config().headers)
        let newState = this.state.availableTracks
        newState[index] = true
        this.setState({
            availableTracks: newState
        })
    }

    removeAlbPl = (id, trackId, index) => {
        axios.post(`${config().url}/removeAlbPlayTrack`, { id, trackId }, config().headers)
        let newState = this.state.availableTracks
        newState[index] = false
        this.setState({
            availableTracks: newState
        })
    }

    addToLikes = (type, obj, clas) => {
        const currentClass = clas
        const secondClass = currentClass.className.split(' ')
        const s = clas.querySelector('#liked_track')
        const u = clas.querySelector('#unliked_track')
        if (secondClass[1] === 'is_liked') {
            s.style.display = 'none'
            u.style.display = 'block'
            u.style.color = 'black'
            currentClass.className = "track_like_holder is_unliked"
            axios.post(`${config().url}/unlikeUndownload`, { type, data: { id: obj.id } }, config().headers)
        } else {
            s.style.display = 'block'
            s.style.color = 'red'
            u.style.display = 'none'
            currentClass.className = "track_like_holder is_liked"
            axios.post(`${config().url}/likeUndownload`, { type, data: { ...obj, album: { id: obj.album.id, title: obj.album.title, picture: obj.album.cover_medium, type: obj.album.type } } }, config().headers)
        }
        this.getLikes()
    }

    addToLikes2 = (type, obj, clas, classs) => {
        const currentClass = clas
        const secondClass = currentClass.className.split(' ')
        if (secondClass[1] === 'white_favourite') {
            currentClass.className = `${classs} red_favourite`
            axios.post(`${config().url}/likeUndownload`, { type, data: obj }, config().headers)
        } else {
            currentClass.className = `${classs} white_favourite`
            axios.post(`${config().url}/unlikeUndownload`, { type, data: obj }, config().headers)
        }
        this.getLikes()
    }

    newLikes = (value, type) => {
        let answer
        for (let i = 0; i < this.state.likes[type].length; i++) {
            if (this.state.likes[type][i].information.id === value.id && this.state.likes[type][i].type === value.type) {
                answer = true
                break
            } else {
                answer = false
            }
        }
        return answer
    }

    likeUndownloadAction = (type, obj, action) => {
        if (action === 'like') {
            this.setState({ liked: true })
            axios.post(`${config().url}/likeUndownload`, { type, data: obj }, config().headers)
        } else {
            this.setState({ liked: false })
            axios.post(`${config().url}/unlikeUndownload`, { type, data: { id: obj.id } }, config().headers)
        }
    }

    showIcon = (clas, secClas) => {
        clas.style.zIndex = 1
        clas.style.opacity = 1
        secClas.style.opacity = 0.8
    }
    hideIcon = (clas, secClas) => {
        clas.style.zIndex = -1
        clas.style.opacity = 0
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

    play = (type, id) => {
        this.props.changeSong(id, type)
    }

    login = () => {
        this.props.history.push(`/login?redirect_link=${this.state.path}/${this.props.match.params.id}`)
    }
    render() {
        const { playlist, path, likes, liked, availableTracks } = this.state
        const { match, history, loggedIn } = this.props
        const reroute = this.props.location.pathname.split('/')

        return (
            <div className="main_container">
                <div className="general_container">
                    {loggedIn ? <Sidebar current="explore" /> : ''}
                    <div className={`nav_child_container ${loggedIn ? 'nav_child_container_margin' : ''}`}>
                        <Nav type={path} id={`${reroute[2]}${reroute[3] ? `/${reroute[3]}` : ''}`} history={history} />
                        {playlist && (loggedIn ? likes : true) ?
                            <div className="playlist_container">
                                {playlist.typeDetails.error ? <div className="no_playlist no_result">
                                    <p className="discography_header_text">Sorry, this artist doesn't exist</p>
                                </div> : 
                                <div>
                                    <div className="artist_details">
                                        <img src={playlist.typeDetails.picture_medium} alt="artist_picture" />
                                        <div className="artist_details_like">
                                            <p className="playlist_title">{playlist.typeDetails.name}</p>
                                            {!liked ?
                                                <button className="playlist_button" onClick={() => { !loggedIn ? this.login() : this.likeUndownloadAction(path, playlist.typeDetails, 'like') }}>
                                                    <IoMdHeartEmpty className="playlist_button_icon" />
                                                Like
                                                </button> :
                                                <button className="playlist_button" id="unlike_button" onClick={() => { !loggedIn ? this.login() : this.likeUndownloadAction(path, playlist.typeDetails, 'unlike') }}>
                                                    <IoIosHeartDislike className="playlist_button_icon" />
                                                Unlike
                                                </button>
                                            }
                                        </div>
                                    </div>
                                    <div className="artist_discography">
                                        <Link to={`/${path}/${match.params.id}`} style={{ textDecoration: 'none' }}><p className="artist_discography_text" id={this.props.location.pathname === `/${path}/${match.params.id}` ? 'artist_border' : ''}>Discography</p></Link>

                                        {playlist.tracklist && playlist.tracklist.length ? <Link to={`/${path}/${match.params.id}/top_tracks`} style={{ textDecoration: 'none' }}><p className="artist_discography_text" id={this.props.location.pathname === `/${path}/${match.params.id}/top_tracks` ? 'artist_border' : ''}>Top Tracks</p></Link> : ''}

                                        {playlist.albums && playlist.albums.length ? <Link to={`/${path}/${match.params.id}/albums`} style={{ textDecoration: 'none' }}><p className="artist_discography_text" id={this.props.location.pathname === `/${path}/${match.params.id}/albums` ? 'artist_border' : ''}>Albums</p></Link> : ''}

                                        {playlist.relatedArtists && playlist.relatedArtists.length ? <Link to={`/${path}/${match.params.id}/similar_artists`} style={{ textDecoration: 'none' }}><p className="artist_discography_text" id={this.props.location.pathname === `/${path}/${match.params.id}/similar_artists` ? 'artist_border' : ''}>Similar Artists</p></Link> : ''}

                                        {playlist.playlists && playlist.playlists.length ? <Link to={`/${path}/${match.params.id}/playlists`} style={{ textDecoration: 'none' }}><p className="artist_discography_text" id={this.props.location.pathname === `/${path}/${match.params.id}/playlists` ? 'artist_border' : ''}>Playlists</p></Link> : ''}
                                    </div>
                                    <div>
                                        <Route exact path='/artist/:id' render={(props) => <Discography {...props} topTracks={playlist} play={this.play} path={path} addToLikes={this.addToLikes} newLikes={this.newLikes} loggedIn={loggedIn} />} likeUndownloadAction={this.likeUndownloadAction}></Route>

                                        <Route path='/artist/:id/top_tracks' render={(props) => <TopTracks {...props} topTracks={playlist.tracklist} play={this.play} addToLikes={this.addToLikes} newLikes={this.newLikes} loggedIn={loggedIn} availableTracks={availableTracks} path={path} addAlbPl={this.addAlbPl} removeAlbPl={this.removeAlbPl} />}></Route>

                                        <Route path='/artist/:id/playlists' render={(props) => <ArtistPlaylists {...props} playlists={playlist.playlists} showIcon={this.showIcon} hideIcon={this.hideIcon} expandPlay={this.expandPlay} shrinkPlay={this.shrinkPlay} expandLike={this.expandLike} shrinkLike={this.shrinkLike} play={this.play} loggedIn={loggedIn} addToLikes2={this.addToLikes2} path={path} newLikes={this.newLikes} />}></Route>

                                        <Route path='/artist/:id/albums' render={(props) => <ArtistAlbums {...props} albums={playlist.albums} showIcon={this.showIcon} hideIcon={this.hideIcon} expandPlay={this.expandPlay} shrinkPlay={this.shrinkPlay} expandLike={this.expandLike} shrinkLike={this.shrinkLike} play={this.play} path={path} loggedIn={loggedIn} addToLikes2={this.addToLikes2} newLikes={this.newLikes} />}></Route>

                                        <Route path='/artist/:id/similar_artists' render={(props) => <SimilarArtist {...props} related={playlist.relatedArtists} showIcon={this.showIcon} hideIcon={this.hideIcon} expandLike={this.expandLike} shrinkLike={this.shrinkLike} loggedIn={loggedIn} addToLikes2={this.addToLikes2} newLikes={this.newLikes} path={path} />}></Route>
                                    </div>
                                </div>}
                            </div> :
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

function mapStateToProps({ loggedIn }) {
    return {
        loggedIn
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAlbums: () => dispatch(getAllAlbums()),
        getTracks: () => dispatch(getAllTracks()),
        getPlaylists: () => dispatch(getAllPlaylists()),
        getLikes: () => dispatch(getAllLikes()),
        getAllRecent: () => dispatch(getAllRecent()),
        changeSong: (id, type) => dispatch(changeSong(id, type))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Artist)