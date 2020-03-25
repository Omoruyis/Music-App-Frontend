import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";

class SimilarArtist extends Component {
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

    addToLikes = (type, obj, clas, classs) => {
        this.props.addToLikes2(type, obj, clas, classs)
    }

    newLikes = (value, type) => {
        return this.props.newLikes(value, type)
    }

    refresh = (type, id) => {
        this.props.refresh(type, id)
    }

    render () {
        const { related, loggedIn } = this.props
        this.artistLike = []
        this.artistImage = []

        return (
            <div className="explore_artists flex">
            <p className="discography_header_text">Related Artists</p>
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {related.map((cur, index) => {
                    return (
                        <div className="explore_artist" id="discography_playlist_mapped" key={index}>
                            <div className="explore_artists_images_holder" onMouseOver={() => this.showIcon(this.artistLike[index], this.artistImage[index])} onMouseOut={() => this.hideIcon(this.artistLike[index], this.artistImage[index])}>
                                {/* <Link to={`/${cur.type}/${cur.id}`}> */}
                                    <img src={cur.picture_medium} alt="artist cover" ref={el => this.artistImage[index] = el} className="explore_artists_images hover_similar" onClick={() => this.refresh(cur.type, cur.id)}/>
                                {/* </Link> */}
                                <div
                                    className={!loggedIn ? 'favourite_holder white_favourite' : (this.newLikes(cur, 'artistLikes') ? 'favourite_holder red_favourite' : 'favourite_holder white_favourite')}
                                    ref={el => this.artistLike[index] = el}
                                    onMouseOver={() => this.expandLike(this.artistLike[index])} onMouseOut={() => this.shrinkLike(this.artistLike[index])}
                                    onClick={() => loggedIn ? this.addToLikes(cur.type, cur, this.artistLike[index], "favourite_holder") : this.login()}
                                >
                                    <FaRegHeart />
                                </div>
                            </div>
                            {/* <Link to={`/${cur.type}/${cur.id}`}> */}
                                <p className="explore_artists_name" style={{cursor: 'pointer'}} onClick={() => this.refresh(cur.type, cur.id)}>{cur.name}</p>
                            {/* </Link> */}
                        </div>
                    )
                })}
                </div>
            </div>
        )
    }
}

export default SimilarArtist