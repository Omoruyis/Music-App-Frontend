import React, { Component } from 'react';
import axios from 'axios'
import { IconContext } from "react-icons";
import { MdPlayCircleFilled } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { Route, Link } from 'react-router-dom'

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

    showIcon = (index, clas, secClas) => {
        Array.from(document.querySelectorAll(clas))[index].style['z-index'] = 1
        Array.from(document.querySelectorAll(secClas))[index].style.opacity = 0.8
    }
    hideIcon = (index, clas, secClas) => {
        Array.from(document.querySelectorAll(clas))[index].style.zIndex = -1
        Array.from(document.querySelectorAll(secClas))[index].style.opacity = 1
    }
    expandPlay = (clas) => {
        document.querySelector(clas).style.fontSize = '40px'
    }
    shrinkPlay = (clas) => {
        document.querySelector(clas).style.fontSize = '35px'
    }
    expandLike = (index, clas) => {
        Array.from(document.querySelectorAll(clas))[index].style.width = '35px'
        Array.from(document.querySelectorAll(clas))[index].style.height = '35px'
    }
    shrinkLike = (index, clas) => {
        Array.from(document.querySelectorAll(clas))[index].style.width = '30px'
        Array.from(document.querySelectorAll(clas))[index].style.height = '30px'
    }
    addToLikes = (type, obj, index, clas) => {
        const currentClass = Array.from(document.querySelectorAll(clas))[index]
        const secondClass = currentClass.className.split(' ')
        if (secondClass[1] === 'white_favourite') {
            currentClass.className = "favourite_holder red_favourite"
            axios.post(`${config.url}/likeUndownload`, { type, data: obj }, config.headers)
        } else {
            currentClass.className = "favourite_holder white_favourite"
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
        const { charts, likes, type, id } = this.state

        return (
            <div>
                <ExploreNav />
                <div className="explore_container">
                    <p className="explore_charts">Charts</p>
                    <div className="explore_today">
                        <p className="explore_top">Today's top tracks</p>
                        <p className="explore_updated">Updated every day</p>
                        <Link to='/'>
                            <div className="explore_tracks">
                                <img src={signup} className="explore_tracks_image" />
                                <div className="explore_tracks_text">
                                    <p className="explore_tracks_text_top">Top WorldWide</p>
                                    <p className="explore_tracks_text_sub">100 tracks</p>
                                </div>
                                <MdPlayCircleFilled className="explore_tracks_play_button" onClick={() => { this.play('charts', 0) }} onMouseOver={() => this.expandPlay('.explore_tracks_play_button')} onMouseOut={() => this.shrinkPlay('.explore_tracks_play_button')}
                                />
                            </div>
                        </Link>
                    </div>
                    <div>
                        <p>Most Streamed Artists</p>
                    </div>
                    <div className="explore_artists_container">
                        <p className="explore_top">Most streamed artists</p>
                        <div className="explore_artists">
                            {charts && charts.chartAlbums.map((cur, index) => {
                                if (index < 4) {
                                    return (
                                        <div className="explore_artist" key={index}>
                                            <Link to='/'>
                                                <div className="explore_artists_images_holder" onMouseOver={() => this.showIcon(index, '.favourite_holder', '.explore_artists_images')} onMouseOut={() => this.hideIcon(index, '.favourite_holder', '.explore_artists_images')}>
                                                    <img src={cur.artist.picture_medium} className="explore_artists_images" />
                                                    <div
                                                        className={this.newLikes(cur.artist, 'artistLikes') ? 'favourite_holder red_favourite' : 'favourite_holder white_favourite'}
                                                        onMouseOver={() => this.expandLike(index, '.favourite_holder')} onMouseOut={() => this.shrinkLike(index, '.favourite_holder')} onClick={() => this.addToLikes(cur.artist.type, cur.artist, index, '.favourite_holder')}>
                                                        <FaRegHeart />
                                                    </div>
                                                </div>
                                            </Link>
                                            <p className="explore_artists_name">{cur.artist.name}</p>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                        <div className="explore_artists_container">
                            <p className="explore_top">Most streamed albums</p>
                            <div className="explore_artists">
                                {charts && charts.chartAlbums.map((cur, index) => {
                                    if (index < 4) {
                                        return (
                                            <div className="explore_artist" key={index}>
                                                <Link to='/'>
                                                    <div className="explore_albums_images_holder" onMouseOver={() => this.showIcon(index, '.favourite_album_holder', '.explore_albums_images')} onMouseOut={() => this.hideIcon(index, '.favourite_album_holder', '.explore_albums_images')}>
                                                        <img src={cur.cover_medium} className="explore_albums_images" />
                                                        <MdPlayCircleFilled className="explore_album_play_button" onClick={() => { this.play('album', cur.id) }} onMouseOver={() => this.expandPlay('.explore_album_play_button')} onMouseOut={() => this.shrinkPlay('.explore_album_play_button')}
                                                        />
                                                        <div
                                                            className={this.newLikes(cur, 'albumLikes') ? 'favourite_album_holder red_favourite' : 'favourite_album_holder white_favourite'}
                                                            onMouseOver={() => this.expandLike(index, '.favourite_album_holder')} onMouseOut={() => this.shrinkLike(index, '.favourite_album_holder')} onClick={() => this.addToLikes(cur.type, cur, index, '.favourite_album_holder')}>
                                                            <FaRegHeart />
                                                        </div>
                                                    </div>
                                                </Link>
                                                <p className="explore_artists_name">{cur.artist.name}</p>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </div>




                {type ? <div className="iframe_container">
                    <iframe scrolling="no" frameborder="0" allowTransparency="true" src={`https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=false&width=700&height=350&color=ff0000&layout=dark&size=medium&type=${type}&id=${id}&app_id=1`} width="100%" height="100%"></iframe>
                </div> : ''}
            </div>
        )
    }
}

export default Explore

