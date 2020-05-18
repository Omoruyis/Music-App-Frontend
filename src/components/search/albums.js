import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { MdPlayArrow } from "react-icons/md";

import { trimString } from '../../helper/helper'

class Albums extends Component {
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
        this.props.history.push(`/login?redirect_link=${this.props.path}/${this.props.match.params.query}/albums`)
    }

    render () {
        const { loggedIn } = this.props
        const { albums } = this.props.searchResult
        this.albumLike = []
        this.albumImage = []
        this.playAlbum = []

        return (
            <div className="top_search_result search_tracks remove_search_border">
                <p className="discography_header_text">{`${albums.length}  ${albums.length > 1 ? 'albums' : 'album'}`}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap' }} className="mobile_albart_display">
                {albums.map((cur, index) => {
                    return (
                        <div className="explore_artist mobile_artist_album_image" id="discography_playlist_mapped" key={index}>
                            <div className="explore_albums_images_holder mobile_artist_album_image" onMouseOver={() => this.showIcon(this.albumLike[index], this.albumImage[index])} onMouseOut={() => this.hideIcon(this.albumLike[index], this.albumImage[index])}>
                                <Link to={`/${cur.type}/${cur.id}`}>
                                    <img src={cur.cover_medium} ref={el => this.albumImage[index] = el} alt="album cover" className="explore_albums_images mobile_artist_album_image" />
                                </Link>
                                <div className="play_holder" ref={el => this.playAlbum[index] = el} onClick={() => { loggedIn ? this.play('album', cur.id) : this.login() }} onMouseOver={() => this.expandPlay(this.playAlbum[index])} onMouseOut={() => this.shrinkPlay(this.playAlbum[index])}>
                                    <MdPlayArrow style={{ fontSize: '25px' }} />
                                </div>
                                <div
                                    className={!loggedIn ? 'favourite_album_holder white_favourite' : (this.newLikes(cur, 'albumLikes') ? 'favourite_album_holder red_favourite' : 'favourite_album_holder white_favourite')}
                                    ref={el => this.albumLike[index] = el}
                                    onMouseOver={() => this.expandLike(this.albumLike[index])} onMouseOut={() => this.shrinkLike(this.albumLike[index])}
                                    onClick={() => loggedIn ? this.addToLikes2(cur.type, cur, this.albumLike[index], "favourite_album_holder") : this.login()}
                                >
                                    <FaRegHeart />
                                </div>
                            </div>
                            <Link to={`/${cur.type}/${cur.id}`} style={{ textDecoration: 'none' }}>
                                <p className="explore_artists_name turn_red" style={{textAlign: 'center'}}>{trimString(cur.title, 17)}</p>
                            </Link>
                        </div>
                    
                    )
                })}
                </div>
            </div>
        )
    }
}

export default Albums