import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import { FaRegHeart } from "react-icons/fa";
import { MdPlayArrow } from "react-icons/md";
import { Link } from 'react-router-dom'

import { changeArtist, changeAlbum, changePlaylist, changeTrack } from '../actions'
import ExploreNav from './explorenav'
import config from '../config/config'
import signup from '../assets/images/signup.png'


import '../App.css';

class Explore extends Component {
    state = {
        charts: null,
        likes: null,
        type: null,
        id: 0,
    }

    componentDidMount() {
        this.getCharts()
        this.getLikes()
    }

    getCharts = async () => {
        const result = await axios.get(`${config.url}/explore`, config.headers)
        this.setState({
            charts: result.data
        })
    }
    getLikes = async () => {
        const result = await axios.get(`${config.url}/getlikes`, config.headers)
        this.setState({
            likes: result.data
        })
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
        // Array.from(document.querySelectorAll(clas))[index].style['z-index'] = 1
        // Array.from(document.querySelectorAll(clas))[index].style.opacity = 1
        // Array.from(document.querySelectorAll(secClas))[index].style.opacity = 0.8
    }
    hideIcon = (clas, secClas) => {
        clas.style.zIndex = -1
        clas.style.opacity = 0
        secClas.style.opacity = 1
        // Array.from(document.querySelectorAll(clas))[index].style.zIndex = -1
        // Array.from(document.querySelectorAll(clas))[index].style.opacity = 0
        // Array.from(document.querySelectorAll(secClas))[index].style.opacity = 1
    }
    expandPlay = (clas) => {
        clas.style.width = '35px'
        clas.style.height = '35px'
        // document.querySelector(clas).style.fontSize = '40px'
    }
    shrinkPlay = (clas) => {
        clas.style.width = '30px'
        clas.style.height = '30px'
        // document.querySelector(clas).style.fontSize = '35px'
    }
    expandLike = (clas) => {
        clas.style.width = '35px'
        clas.style.height = '35px'
        // Array.from(document.querySelectorAll(clas))[index].style.width = '35px'
        // Array.from(document.querySelectorAll(clas))[index].style.height = '35px'
    }
    shrinkLike = (clas) => {
        clas.style.width = '30px'
        clas.style.height = '30px'
        // Array.from(document.querySelectorAll(clas))[index].style.width = '30px'
        // Array.from(document.querySelectorAll(clas))[index].style.height = '30px'
    }
    addToLikes = (type, obj, clas, classs) => {
        const currentClass = clas
        const secondClass = currentClass.className.split(' ')
        if (secondClass[1] === 'white_favourite') {
            currentClass.className = `${classs} red_favourite`
            axios.post(`${config.url}/likeUndownload`, { type, data: obj }, config.headers)
        } else {
            currentClass.className = `${classs} white_favourite`
            axios.post(`${config.url}/unlikeUndownload`, { type, data: obj }, config.headers)
        }
    }
    newLikes = (value, type) => {
        let answer
        for (let i = 0; i < this.state.likes[type].length; i++) {
            if (this.state.likes[type][i].information.id === value.id && this.state.likes[type][i].information.type === value.type) {
                answer = true
                break
            } else {
                answer = false
            }
        }
        return answer
    }

    render() {
        const { charts, type, id } = this.state
        const { artistChange, albumChange, playlistChange } = this.props
        this.artistLike = []
        this.artistImage = []
        this.albumLike = []
        this.albumImage = []
        this.playAlbum = []

        return (
            <div>
                <ExploreNav />
                <div className="explore_container">
                    <p className="explore_charts">Charts</p>
                    <div className="explore_today">
                        <p className="explore_top">Today's top tracks</p>
                        <p className="explore_updated">Updated every day</p>
                        <div className="explore_tracks">
                            <Link >
                                <img src={signup} alt="top tracks" className="explore_tracks_image" onClick={() => playlistChange({ id: 3155776842 })} />
                            </Link>
                            <div className="explore_tracks_text">
                                <p className="explore_tracks_text_top">Top WorldWide</p>
                                <p className="explore_tracks_text_sub">100 tracks</p>
                            </div>
                            <div className="play_holder" ref={el => this.playTop = el} onClick={() => { this.play('charts', 0) }} onMouseOver={() => this.expandPlay(this.playTop)} onMouseOut={() => this.shrinkPlay(this.playTop)}>
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
                                                <Link to='/'>
                                                    <img src={cur.picture_medium} alt="artist cover" ref={el => this.artistImage[index] = el} className="explore_artists_images" />
                                                </Link>
                                                <div
                                                    className={this.newLikes(cur, 'artistLikes') ? 'favourite_holder red_favourite' : 'favourite_holder white_favourite'}
                                                    ref={el => this.artistLike[index] = el}
                                                    onMouseOver={() => this.expandLike(this.artistLike[index])} onMouseOut={() => this.shrinkLike(this.artistLike[index])} onClick={() => this.addToLikes(cur.type, cur, this.artistLike[index], "favourite_holder")}>
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
                                            <Link to='/'>
                                                <div className="explore_albums_images_holder" onMouseOver={() => this.showIcon(this.albumLike[index], this.albumImage[index])} onMouseOut={() => this.hideIcon(this.albumLike[index], this.albumImage[index])}>
                                                    <img src={cur.cover_medium} ref={el => this.albumImage[index] = el} alt="album cover" className="explore_albums_images" />
                                                    <div className="play_holder" ref={el => this.playAlbum[index] = el} onClick={() => { this.play('album', cur.id) }} onMouseOver={() => this.expandPlay(this.playAlbum[index])} onMouseOut={() => this.shrinkPlay(this.playAlbum[index])}>
                                                        <MdPlayArrow style={{ fontSize: '25px' }} />
                                                    </div>
                                                    <div
                                                        className={this.newLikes(cur, 'albumLikes') ? 'favourite_album_holder red_favourite' : 'favourite_album_holder white_favourite'}
                                                        ref={el => this.albumLike[index] = el}
                                                        onMouseOver={() => this.expandLike(this.albumLike[index])} onMouseOut={() => this.shrinkLike(this.albumLike[index])} onClick={() => this.addToLikes(cur.type, cur, this.albumLike[index], "favourite_album_holder")}>
                                                        <FaRegHeart />
                                                    </div>
                                                </div>
                                            </Link>
                                            <p className="explore_artists_name">{cur.artist.name}</p>
                                        </div>
                                    )
                                } else { return '' }
                            })}
                        </div>
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
    return null
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

