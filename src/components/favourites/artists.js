import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";

import { trimString } from '../../helper/helper'

class Artists extends Component {
    state= {
        sort: 'Name'
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

    expandLike = (clas) => {
        this.props.expandLike(clas)
    }

    shrinkLike = (clas) => {
        this.props.shrinkLike(clas)
    }

    deleteLike = (type, data) => {
        this.props.deleteLike(type, data)
    }

    sortTracks = (e) => {
        this.setState({ sort: e.target.value })
    }

    filterAlbums = () => {
        let display = this.props.artistLikes
        if (this.state.sort === 'Name') {
            display = display.sort((a, b) => a.information.name < b.information.name ? -1 : a.information.name > b.information.name ? 1 : 0)
        } else {
            display = display.sort((a, b) => b.createdAt - a.createdAt)
        }
        if (!this.props.inputValue) {
            return display
        }
        if (this.props.inputValue) {
            display = display.filter(cur => {
                const lower = cur.information.name.toLowerCase()
                const filterLower = this.props.inputValue.toLowerCase()
                return lower.includes(filterLower)
            })
        }
        return display
    }

    render() {
        const { artistLikes } = this.props
        this.artistLike = []
        this.artistImage = []

        return (
            <div className="top_search_result search_tracks remove_search_border">
                {!artistLikes.length ? <div className="no_favourites">
                    <p className="discography_header_text">You don't currently have any favourite artists added</p>
                </div> :
                    <div style={{ marginTop: '10px'}} className="top_search_result search_tracks remove_search_border my_tracks">
                        <div className="select_options_holder">
                            <select defaultValue="Sort Tracks" onChange={(e) => this.sortTracks(e)} className="select_options">
                                <option disabled>Sort Artists</option>
                                <option>Name</option>
                                <option>Recently Liked</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '50px'}}>
                        {this.filterAlbums().map((cur, index) => {
                            return (
                                <div className="explore_artist" id="discography_playlist_mapped" key={index}>
                                    <div className="explore_artists_images_holder" onMouseOver={() => this.showIcon(this.artistLike[index], this.artistImage[index])} onMouseOut={() => this.hideIcon(this.artistLike[index], this.artistImage[index])}>
                                        <Link to={`/${cur.type}/${cur.information.id}`}>
                                            <img src={cur.information.picture} alt="artist cover" ref={el => this.artistImage[index] = el} className="explore_artists_images" />
                                        </Link>
                                        <div
                                            className='favourite_holder red_favourite'
                                            ref={el => this.artistLike[index] = el}
                                            onMouseOver={() => this.expandLike(this.artistLike[index])} onMouseOut={() => this.shrinkLike(this.artistLike[index])}
                                            onClick={() => this.deleteLike('artistLikes', { information: { type: cur.type, id: cur.information.id } })}
                                        >
                                            <FaRegHeart />
                                        </div>
                                    </div>
                                    <Link to={`/${cur.type}/${cur.information.id}`} style={{ textDecoration: 'none' }}>
                                        <p className="explore_artists_name turn_red" style={{ cursor: 'pointer', textAlign: 'center' }}>{trimString(cur.information.name, 17)}</p>
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

export default Artists