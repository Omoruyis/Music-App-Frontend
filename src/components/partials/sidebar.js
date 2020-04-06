import React, { Component } from 'react';
import { IoIosMusicalNotes } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { Link } from 'react-router-dom'
import { IoMdHeartEmpty } from "react-icons/io";

import '../../App.css';


class Sidebar extends Component {

    render() {
        const { current } = this.props
        return (
            <div className="sidebar_container">
                <Link to="/explore" style={{textDecoration: 'none' }}>
                    <div className="sidebar_content_div" id={current === 'explore' ? 'current' : ''}>
                        <IoIosMusicalNotes className="sidebar_content_icon"/>
                        <p>Explore</p>
                    </div>
                </Link>
                <Link to='/favourites' style={{textDecoration: 'none' }}>
                    <div className="sidebar_content_div" id={current === 'favourites' ? 'current' : ''}>
                        {current === 'favourites' ? 
                            <IoIosHeart className="sidebar_content_icon"/> :
                            <IoMdHeartEmpty className="sidebar_content_icon"/>
                        }
                        <p>Favourites</p>
                    </div>
                </Link>
                <Link to='/recentlyAdded' style={{textDecoration: 'none' }}>
                    <div className="sidebar_content_div" id={current === 'recent' ? 'current' : ''}>
                        <IoIosMusicalNotes className="sidebar_content_icon"/> 
                        <p>Recently Added</p>
                    </div>
                </Link>
                <Link to='/my_tracks' style={{textDecoration: 'none' }}>
                        <p className="sidebar_content" id={current === 'songs' ? 'current' : ''}>Songs</p>
                </Link>
                <Link to='/my_playlists' style={{textDecoration: 'none' }}>
                        <p className="sidebar_content" id={current === 'playlists' ? 'current' : ''}>Playlists</p>
                </Link>
                <Link to='/my_albums' style={{textDecoration: 'none' }}>
                        <p className="sidebar_content" id={current === 'albums' ? 'current' : ''}>Albums</p>
                </Link>
                <Link to='/my_artists' style={{textDecoration: 'none' }}>
                        <p className="sidebar_content" id={current === 'artists' ? 'current' : ''}>Artists</p>
                </Link>
            </div>
        )
    }
}

export default Sidebar