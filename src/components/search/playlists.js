import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { MdPlayArrow } from "react-icons/md";

import { trimString } from '../../helper/helper'

class Playlists extends Component {
    showIcon = (clas, secClas) => {
        this.props.showIcon(clas, secClas)
    }

    hideIcon = (clas, secClas) => {
        this.props.hideIcon(clas, secClas)
    }

    expandPlay = (clas) => {
        this.props.expandPlay(clas)
    }

    shrinkPlay = (clas) => {
        this.props.shrinkPlay(clas)
    }

    expandLike = (clas) => {
        this.props.expandLike(clas)
    }

    shrinkLike = (clas) => {
        this.props.shrinkLike(clas)
    }

    addToLikes2 = (type, obj, clas, classs) => {
        this.props.addToLikes2(type, obj, clas, classs)
    }

    newLikes = (value, type) => {
        return this.props.newLikes(value, type)
    }

    play = (type, id) => {
        this.props.play(type, id)
    }

    login = () => {
        this.props.history.push(`/login?redirect_link=${this.props.path}/${this.props.match.params.query}/playlists`)
    }

    render () {
        const { loggedIn } = this.props
        const { playlists } = this.props.searchResult
        this.playlistLike = []
        this.playlistImage = []
        this.playPlaylist = []

        return (
            <div className="top_search_result search_tracks remove_search_border">
                    <p className="discography_header_text">{`${playlists.length} ${playlists.length > 1 ? 'playlists' : 'playlist'}`}</p>
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        {playlists.map((cur, index) => {
                                return (
                                    <div className="explore_artist" id="discography_playlist_mapped" key={index}>
                                        <div className="explore_albums_images_holder" onMouseOver={() => this.showIcon(this.playlistLike[index], this.playlistImage[index])} onMouseOut={() => this.hideIcon(this.playlistLike[index], this.playlistImage[index])}>
                                            <Link to={`/${cur.type}/${cur.id}`}>
                                                <img src={cur.picture_medium} ref={el => this.playlistImage[index] = el} alt="playlist cover" className="explore_albums_images" />
                                            </Link>
                                            <div className="play_holder" ref={el => this.playPlaylist[index] = el} onClick={() => { loggedIn ? this.play('playlist', cur.id) : this.login() }} onMouseOver={() => this.expandPlay(this.playPlaylist[index])} onMouseOut={() => this.shrinkPlay(this.playPlaylist[index])}>
                                                <MdPlayArrow style={{ fontSize: '25px' }} />
                                            </div>
                                            <div
                                                className={!loggedIn ? 'favourite_album_holder white_favourite' : (this.newLikes(cur, 'playlistLikes') ? 'favourite_album_holder red_favourite' : 'favourite_album_holder white_favourite')}
                                                ref={el => this.playlistLike[index] = el}
                                                onMouseOver={() => this.expandLike(this.playlistLike[index])} onMouseOut={() => this.shrinkLike(this.playlistLike[index])}
                                                onClick={() => loggedIn ? this.addToLikes2(cur.type, cur, this.playlistLike[index], "favourite_album_holder") : this.login()}
                                            >
                                                <FaRegHeart />
                                            </div>
                                        </div>
                                        <Link to={`/${cur.type}/${cur.id}`} style={{ textDecoration: 'none' }}>
                                            <p className="explore_artists_name turn_red">{trimString(cur.title, 17)}</p>
                                        </Link>
                                    </div>
                                )
                        })}
                    </div>
                </div>
        )
    }
}

export default Playlists