import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import { CircularProgress } from '@material-ui/core';
import { FaRegHeart } from "react-icons/fa";
import { MdPlayArrow } from "react-icons/md";
import { Link } from 'react-router-dom'

import { getAllAlbums, getAllPlaylists, getAllLikes, getAllTracks, getAllRecent, changeSong } from '../../actions'
import Nav from '../partials/nav'
import Sidebar from '../partials/sidebar'
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
        if (this.props.loggedIn) {
            this.props.getAlbums()
            this.props.getTracks()
            this.props.getPlaylists()
            this.props.getLikes()
            this.props.getAllRecent()
        }
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

    getCharts = async () => {
        try {
            const result = await axios.get(`${config().url}/explore`, config().headers)
            this.setState({
                charts: result.data
            })
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

    checkLogin = async () => {
        if (!this.props.loggedIn) {
            return
        }
        this.getLikes()
    }


    play = (type, id) => {
        this.props.changeSong(id, type)
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
        const { charts, likes } = this.state
        const { history, loggedIn } = this.props
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
                        {charts && (loggedIn ? likes : true) ?
                            <div className={loggedIn ? 'explore_container_logged_in' : 'explore_container'}>
                                <p className="explore_charts">Charts</p>
                                <div className="explore_today">
                                    <p className="explore_top">Today's top tracks</p>
                                    <p className="explore_updated">Updated every day</p>
                                    <div className="explore_tracks">
                                        <Link to={`/playlist/${3155776842}`} className="explore_tracks" style={{ textDecoration: 'none' }}>
                                            <img src={"https://cdns-images.dzcdn.net/images/playlist/f1ac18441ab1dabc94282e4d1d5f4955/250x250-000000-80-0-0.jpg"} alt="top tracks" className="explore_tracks_image" />
                                            {/* <div className="explore_tracks_text">
                                                <p className="explore_tracks_text_top">Top WorldWide</p>
                                                <p className="explore_tracks_text_sub">100 tracks</p>
                                            </div> */}
                                        </Link>
                                        <div className="play_holder" ref={el => this.playTop = el} onClick={() => {
                                            loggedIn ? this.play('playlist', 3155776842) : this.login()
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
                                                        <Link to={`/${cur.type}/${cur.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                                            <p className="explore_artists_name turn_red">{cur.name}</p>
                                                        </Link>
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
                                                    <div className="explore_artist mobile_explore" key={index}>
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
                                                        <Link to={`/${cur.type}/${cur.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                                            <p className="explore_artists_name turn_red">{cur.title}</p>
                                                        </Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Explore)

