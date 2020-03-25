import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import { CircularProgress } from '@material-ui/core';
import { FaRegHeart } from "react-icons/fa";
import { MdPlayArrow } from "react-icons/md";
import { Link } from 'react-router-dom'

import { changeArtist, changeAlbum, changePlaylist, changeTrack } from '../../actions'
import Nav from '../partials/nav'
import Sidebar from '../partials/sidebar'
import signup from '../../assets/images/signup.png'
import config from '../../config/config'

import '../../App.css';

class Explore extends Component {
    state = {
        charts: null,
        likes: null,
        type: null,
        id: 0,
        loggedIn: false
    }

    componentDidMount() {
        this.checkLogin()
        this.getCharts()
    }

    getCharts = async () => {
        const result = await axios.get(`${config().url}/explore`, config().headers)
        this.setState({
            charts: result.data
        })
    }
    getLikes = async () => {
        if (!this.state.loggedIn) {
            return
        }
        const result = await axios.get(`${config().url}/getlikes`, config().headers)
        this.setState({
            likes: result.data
        })
    }
    checkLogin = async () => {
        if (!localStorage.getItem('token')) {
            return
        }
        const result = await axios.get(`${config().url}/authenticate`, config().headers)
        if (result.status !== 200) {
            return
        }
        this.setState({
            loggedIn: true
        })
        this.getLikes()
    }


    play = (type, id) => {
        this.setState({
            type,
            id
        })
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
    addToLikes = (type, obj, clas, classs) => {
        const currentClass = clas
        const secondClass = currentClass.className.split(' ')
        if (secondClass[1] === 'white_favourite') {
            currentClass.className = `${classs} red_favourite`
            axios.post(`${config().url}/likeUndownload`, { type, data: obj }, config().headers)
        } else {
            currentClass.className = `${classs} white_favourite`
            axios.post(`${config().url}/unlikeUndownload`, { type, data: obj }, config().headers)
        }
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

    login = () => {
        this.props.history.push("/login?redirect_link=explore")
    }

    render() {
        const { charts, type, id, loggedIn } = this.state
        const { history } = this.props
        this.artistLike = []
        this.artistImage = []
        this.albumLike = []
        this.albumImage = []
        this.playAlbum = []

        return (
            <div className="main_container">
                <div className="general_container">
                    {loggedIn ? <Sidebar current="explore" /> : ''}
                    <div className={`nav_child_container ${loggedIn ? 'nav_child_container_margin' : ''}`}>
                        <Nav type="explore" id="" history={history} />
                        {charts ?
                            <div className="explore_container">
                                <p className="explore_charts">Charts</p>
                                <div className="explore_today">
                                    <p className="explore_top">Today's top tracks</p>
                                    <p className="explore_updated">Updated every day</p>
                                    <div className="explore_tracks">
                                        <Link to={`/playlist/${3155776842}`} className="explore_tracks" style={{ textDecoration: 'none' }}>
                                            <img src={signup} alt="top tracks" className="explore_tracks_image" />
                                            <div className="explore_tracks_text">
                                                <p className="explore_tracks_text_top">Top WorldWide</p>
                                                <p className="explore_tracks_text_sub">100 tracks</p>
                                            </div>
                                        </Link>
                                        <div className="play_holder" ref={el => this.playTop = el} onClick={() => {
                                            loggedIn ? this.play('charts', 0) : this.login()
                                        }} onMouseOver={() => this.expandPlay(this.playTop)} onMouseOut={() => this.shrinkPlay(this.playTop)}>
                                            <MdPlayArrow style={{ fontSize: '25px' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="explore_artists_container">
                                    <p className="explore_top">Most streamed artists</p>
                                    <div className="explore_artists">
                                        {charts && charts.chartArtists.map((cur, index) => {
                                            if (index < 4) {
                                                return (
                                                    <div className="explore_artist" key={index}>
                                                        <div className="explore_artists_images_holder" onMouseOver={() => this.showIcon(this.artistLike[index], this.artistImage[index])} onMouseOut={() => this.hideIcon(this.artistLike[index], this.artistImage[index])}>
                                                            <Link to={`/${cur.type}/${cur.id}`}>
                                                                <img src={cur.picture_medium} alt="artist cover" ref={el => this.artistImage[index] = el} className="explore_artists_images" />
                                                            </Link>
                                                            <div
                                                                className={!loggedIn ? 'favourite_holder white_favourite' : (this.newLikes(cur, 'artistLikes') ? 'favourite_holder red_favourite' : 'favourite_holder white_favourite')}
                                                                ref={el => this.artistLike[index] = el}
                                                                onMouseOver={() => this.expandLike(this.artistLike[index])} onMouseOut={() => this.shrinkLike(this.artistLike[index])}
                                                                onClick={() => loggedIn ? this.addToLikes(cur.type, cur, this.artistLike[index], "favourite_holder") : this.login()}
                                                            >
                                                                <FaRegHeart />
                                                            </div>
                                                        </div>
                                                        <p className="explore_artists_name">{cur.name}</p>
                                                    </div>
                                                )
                                            } else { return '' }
                                        })}
                                    </div>
                                </div>
                                <div className="explore_artists_container">
                                    <p className="explore_top">Most streamed albums</p>
                                    <div className="explore_artists">
                                        {charts && charts.chartAlbums.map((cur, index) => {
                                            if (index < 4) {
                                                return (
                                                    <div className="explore_artist" key={index}>
                                                        <div className="explore_albums_images_holder" onMouseOver={() => this.showIcon(this.albumLike[index], this.albumImage[index])} onMouseOut={() => this.hideIcon(this.albumLike[index], this.albumImage[index])}>
                                                            <Link to={`/${cur.type}/${cur.id}`}>
                                                                <img src={cur.cover_medium} ref={el => this.albumImage[index] = el} alt="album cover" className="explore_albums_images" />
                                                            </Link>
                                                            <div className="play_holder" ref={el => this.playAlbum[index] = el} onClick={() => { loggedIn ? this.play('album', cur.id) : this.login() }} onMouseOver={() => this.expandPlay(this.playAlbum[index])} onMouseOut={() => this.shrinkPlay(this.playAlbum[index])}>
                                                                <MdPlayArrow style={{ fontSize: '25px' }} />
                                                            </div>
                                                            <div
                                                                className={!loggedIn ? 'favourite_album_holder white_favourite' : (this.newLikes(cur, 'albumLikes') ? 'favourite_album_holder red_favourite' : 'favourite_album_holder white_favourite')}
                                                                ref={el => this.albumLike[index] = el}
                                                                onMouseOver={() => this.expandLike(this.albumLike[index])} onMouseOut={() => this.shrinkLike(this.albumLike[index])}
                                                                onClick={() => loggedIn ? this.addToLikes(cur.type, cur, this.albumLike[index], "favourite_album_holder") : this.login()}
                                                            >
                                                                <FaRegHeart />
                                                            </div>
                                                        </div>
                                                        <p className="explore_artists_name">{cur.title}</p>
                                                    </div>
                                                )
                                            } else { return '' }
                                        })}
                                    </div>
                                </div>

                            </div> :
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

function mapStateToProps() {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        artistChange: (data) => dispatch(changeArtist(data)),
        albumChange: (data) => dispatch(changeAlbum(data)),
        playlistChange: (data) => dispatch(changePlaylist(data)),
        trackChange: (data) => dispatch(changeTrack(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Explore)

