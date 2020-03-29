import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { MdPlayArrow } from "react-icons/md";

import { trimString } from '../../helper/helper'

class Playlists extends Component {
    state = {
        sort: 'Title'
    }

    componentDidMount() {
        this.props.clearValue()
    }

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

    deleteLike = (type, data) => {
        this.props.deleteLike(type, data)
    }

    play = (type, id) => {
        this.props.play(type, id)
    }

    sortTracks = (e) => {
        this.setState({ sort: e.target.value })
    }

    filterPlaylists = () => {
        let display = this.props.playlistLikes
        if (this.state.sort === 'Title') {
            display = display.sort((a, b) => a.information.title < b.information.title ? -1 : a.information.title > b.information.title ? 1 : 0)
        } else {
            display = display.sort((a, b) => b.createdAt - a.createdAt)
        }
        if (!this.props.inputValue) {
            return display
        }
        if (this.props.inputValue) {
            display = display.filter(cur => {
                const lower = cur.information.title.toLowerCase()
                const filterLower = this.props.inputValue.toLowerCase()
                return lower.includes(filterLower)
            })
        }
        return display
    }

    render() {
        const { playlistLikes } = this.props
        this.artistLike = []
        this.artistImage = []
        this.playAlbum = []

        return (
            <div className="top_search_result search_tracks remove_search_border">
                {!playlistLikes.length ? <div className="no_favourites">
                    <p className="discography_header_text">You don't currently have any favourite playlists added</p>
                </div> :
                    <div style={{ marginTop: '10px' }} className="top_search_result search_tracks remove_search_border my_tracks">
                        <div className="select_options_holder">
                            <select defaultValue="Sort Tracks" onChange={(e) => this.sortTracks(e)} className="select_options">
                                <option disabled>Sort Albums</option>
                                <option>Title</option>
                                <option>Recently Liked</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '50px' }}>
                            {this.filterPlaylists().map((cur, index) => {
                                return (
                                    <div className="explore_artist" id="discography_playlist_mapped" key={index}>
                                        <div className="explore_albums_images_holder" onMouseOver={() => this.showIcon(this.artistLike[index], this.artistImage[index])} onMouseOut={() => this.hideIcon(this.artistLike[index], this.artistImage[index])}>
                                            <Link to={`/${cur.type}/${cur.information.id}`}>
                                                <img src={cur.information.picture} alt="artist cover" ref={el => this.artistImage[index] = el} className="explore_albums_images" />
                                            </Link>
                                            <div className="play_holder" ref={el => this.playAlbum[index] = el} onClick={() => this.play('album', cur.information.id)} onMouseOver={() => this.expandPlay(this.playAlbum[index])} onMouseOut={() => this.shrinkPlay(this.playAlbum[index])}>
                                                <MdPlayArrow style={{ fontSize: '25px' }} />
                                            </div>
                                            <div
                                                className='favourite_album_holder red_favourite'
                                                ref={el => this.artistLike[index] = el}
                                                onMouseOver={() => this.expandLike(this.artistLike[index])} onMouseOut={() => this.shrinkLike(this.artistLike[index])}
                                                onClick={() => this.deleteLike('playlistLikes', { information: { type: cur.type, id: cur.information.id } })}
                                            >
                                                <FaRegHeart />
                                            </div>
                                        </div>
                                        <Link to={`/${cur.type}/${cur.information.id}`} style={{ textDecoration: 'none' }}>
                                            <p className="explore_artists_name turn_red" style={{ cursor: 'pointer', textAlign: 'center' }}>{trimString(cur.information.title, 17)}</p>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>}
            </div>
        )
    }
}

export default Playlists