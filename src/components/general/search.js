import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import All from '../search/all'
import Tracks from '../search/tracks'
import Playlists from '../search/playlists'
import Albums from '../search/albums'
import Artists from '../search/artists'
import { CircularProgress } from '@material-ui/core';

import { getAllAlbums, getAllPlaylists, getAllLikes, getAllTracks, getAllRecent, getAllArtists, changeSong } from '../../actions'
import Nav from '../partials/nav'
import Sidebar from '../partials/sidebar'
import config from '../../config/config'

import '../../App.css';

class Search extends Component {
    state = {
        path: null,
        searchResult: null,
        type: null,
        id: 0,
        likes: null,
        availableTracks: [],
        url: this.props.match.params.query
    }

    componentDidMount() {
        this.getPathName()
        this.checkLogin()
        this.getSearchResult(this.props.match.params.query)
    }

    componentWillUnmount() {
        if(!this.props.loggedIn) {
            return
        }
        this.props.getAlbums()
        this.props.getTracks()
        this.props.getPlaylists()
        this.props.getLikes()
        this.props.getAllRecent()
        this.props.getArtists()
    }

    shouldComponentUpdate(nextProps, nextState) {
        // if (this.props.loggedIn !== this.state.loggedIn) {
        // if (this.props.loggedIn !== nextProps.loggedIn) {
        //     console.log('v')
        //     this.checkLogin()
        //     this.setState({ loggedIn: true })
        // }
        if (nextState.url !== nextProps.match.params.query) {
            this.setState({ searchResult: null })
            this.checkLogin()
            this.getSearchResult(nextProps.match.params.query)
            this.setState({ url: nextProps.match.params.query })
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
    }

    getSearchResult = async (query) => {
        const result = await axios.post(`${config().url}/search`, { searchQuery: query }, config().headers)
        this.setState({
            searchResult: result.data,
        })
        if (this.props.loggedIn) {
            let availableTracks = []
            result.data.tracks.forEach(async (cur, index) => {
                const res = await axios.post(`${config().url}/checkTrackInAlbum`, { id: cur.album.id, trackId: cur.id }, config().headers)
                availableTracks[index] = res.data
            })
            this.setState({
                availableTracks
            })
        }
    }

    getLikes = async () => {
        if (!this.props.loggedIn) {
            return
        }
        const result = await axios.get(`${config().url}/getlikes`, config().headers)
        this.setState({
            likes: result.data
        })
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
            axios.post(`${config().url}/likeUndownload`, { type, data: {...obj, album: {id: obj.album.id, title: obj.album.title, picture: obj.album.cover_medium, type: obj.album.type}} }, config().headers)
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
            axios.post(`${config().url}/likeUndownload`, { type, data: { id: obj.id } }, config().headers)
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
        this.props.history.push(`/login?redirect_link=${this.state.path}/${this.props.match.params.query}`)
    }

    render() {
        const { searchResult, path, likes, availableTracks } = this.state
        const { match, history, loggedIn } = this.props
        const reroute = this.props.location.pathname.split('/')

        return (
            <div className="main_container">
                <div className="general_container">
                    {loggedIn ? <Sidebar current="explore" /> : ''}
                    <div className={`nav_child_container ${loggedIn ? 'nav_child_container_margin' : ''}`}>
                        <Nav type={path} id={`${reroute[2]}${reroute[3] ? `/${reroute[3]}` : ''}`} history={history} />
                        {searchResult && (loggedIn ? likes : true) ?
                            <div className="search_container">
                                {!searchResult.artists.length && !searchResult.albums.length && !searchResult.playlists.length && !searchResult.tracks.length && !searchResult.topResults.keys ? <div className="no_playlist no_result">
                                <p className="discography_header_text">Sorry, we couldn't find any result for {reroute[reroute.length - 1]}</p>
                                    </div> : <div className="artist_discography search_headers">
                                    <Link to={`/${path}/${match.params.query}`} style={{ textDecoration: 'none' }}><p className="artist_discography_text" id={this.props.location.pathname === `/${path}/${match.params.query}` ? 'artist_border' : ''}>All</p></Link>

                                    {searchResult.tracks.length ? <Link to={`/${path}/${match.params.query}/tracks`} style={{ textDecoration: 'none' }}><p className="artist_discography_text" id={this.props.location.pathname === `/${path}/${match.params.query}/tracks` ? 'artist_border' : ''}>Tracks</p></Link> : ''}

                                    {searchResult.albums.length ? <Link to={`/${path}/${match.params.query}/albums`} style={{ textDecoration: 'none' }}><p className="artist_discography_text" id={this.props.location.pathname === `/${path}/${match.params.query}/albums` ? 'artist_border' : ''}>Albums</p></Link> : ''}
                                    
                                    {searchResult.artists.length ? <Link to={`/${path}/${match.params.query}/artists`} style={{ textDecoration: 'none' }}><p className="artist_discography_text" id={this.props.location.pathname === `/${path}/${match.params.query}/artists` ? 'artist_border' : ''}>Artists</p></Link> : ''}

                                    {searchResult.playlists.length ? <Link to={`/${path}/${match.params.query}/playlists`} style={{ textDecoration: 'none' }}><p className="artist_discography_text" id={this.props.location.pathname === `/${path}/${match.params.query}/playlists` ? 'artist_border' : ''}>Playlists</p></Link> : ''}
                                </div>}
                                <div className="search_headers">
                                    <Route exact path='/search/:query' render={(props) => <All {...props} searchResult={searchResult} play={this.play} path={path} addToLikes={this.addToLikes} newLikes={this.newLikes} loggedIn={loggedIn} likeUndownloadAction={this.likeUndownloadAction} addAlbPl={this.addAlbPl} removeAlbPl={this.removeAlbPl} availableTracks={availableTracks} showIcon={this.showIcon} hideIcon={this.hideIcon} expandPlay={this.expandPlay} shrinkPlay={this.shrinkPlay} expandLike={this.expandLike} shrinkLike={this.shrinkLike} addToLikes2={this.addToLikes2} />}></Route>

                                    <Route path='/search/:query/tracks' render={(props) => <Tracks {...props} searchResult={searchResult} play={this.play} addToLikes={this.addToLikes} newLikes={this.newLikes} loggedIn={loggedIn} availableTracks={availableTracks} path={path} addAlbPl={this.addAlbPl} removeAlbPl={this.removeAlbPl}/>}></Route>

                                    <Route path='/search/:query/playlists' render={(props) => <Playlists {...props} searchResult={searchResult} showIcon={this.showIcon} hideIcon={this.hideIcon} expandPlay={this.expandPlay} shrinkPlay={this.shrinkPlay} expandLike={this.expandLike} shrinkLike={this.shrinkLike} play={this.play} loggedIn={loggedIn} addToLikes2={this.addToLikes2} newLikes={this.newLikes} path={path}/>}></Route>

                                    <Route path='/search/:query/albums' render={(props) => <Albums {...props} searchResult={searchResult} showIcon={this.showIcon} hideIcon={this.hideIcon} expandPlay={this.expandPlay} shrinkPlay={this.shrinkPlay} expandLike={this.expandLike} shrinkLike={this.shrinkLike} play={this.play} path={path} loggedIn={loggedIn} addToLikes2={this.addToLikes2} newLikes={this.newLikes}/>}></Route>

                                    <Route path='/search/:query/artists' render={(props) => <Artists {...props} searchResult={searchResult} showIcon={this.showIcon} hideIcon={this.hideIcon} expandLike={this.expandLike} shrinkLike={this.shrinkLike} path={path} loggedIn={loggedIn} addToLikes2={this.addToLikes2} newLikes={this.newLikes}/>}></Route>
                                </div>
                            </div> :
                            <div className="spinner">
                                <CircularProgress />
                            </div>}
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
        getArtists: () => dispatch(getAllArtists()),
        changeSong: (id, type) => dispatch(changeSong(id, type))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)