import React, { Component } from 'react';
import axios from 'axios'

import config from '../config/config'
import playButton from '../assets/images/playbutton.png'
import play from '../assets/images/play.png'
import star from '../assets/images/star.png'
import cd from '../assets/images/cd.png'


import '../App.css';

class Welcome extends Component {
    state = {
        charts: null
    }

    getCharts = () => {
        axios.get(`${config.url}/explore`, config.headers)
            .then(res => {
                this.setState({
                    charts: res.data
                })
            })
    }

    componentDidMount() {
        this.getCharts()
    }

    render() {
        const { charts } = this.state

        return (
            <div className="welcome_container">

                <div id="a">
                    <div className="welcome_page_buttons">
                        <p className="login_button">Login</p>
                        <button className="signup_button">Sign up</button>
                    </div>
                    <div className="welcome_page_details">
                        <h3 className="welcome_page_text">A New Way To Enjoy Music</h3>
                        <buttton className="checkout_button">Check out store <span style={{ paddingLeft: 10 }}><img src={playButton} alt="play button" /></span></buttton>
                    </div>
                </div>
                <div className="charts">
                    <div className="charts_songs_container">
                        <div className="charts_songs_title">
                            <p className="charts_songs_title_p">Top Songs</p>
                            <div className="chart_songs_head">
                                <p className="more_width">#</p>
                                <p className="more_width">Track/Artist</p>
                                <p>Album</p>
                                <p>Time</p>
                                <p>Add</p>
                                <p>Like</p>
                            </div>
                            {charts && charts.tracks.map((track, index) => {
                                if (index < 4) {
                                    return <div className="charts_songs">
                                        <div className="charts_songs_images">
                                            <p className="chart_song_number">{track.position}</p>
                                            <img src={track.album.cover} className="chart_song_cover" alt="track-cover" />
                                            <img src={play} className="chart_song_play_image" alt="play" />
                                        </div>
                                        <div className="charts_songs_track">
                                            <p className="song">{track.title}</p>
                                            <p className="artist">{track.artist.name}</p>
                                        </div>
                                        <p>Album</p>
                                        <p>Time</p>
                                        <p>Add</p>
                                        <img src={star} className="charts_like" />
                                    </div>
                                }
                            })}
                            <div id="charts_songs_button">
                                <button className="charts_songs_button">Show More</button>
                            </div>
                        </div>
                    </div>
                    <div className="charts_albums_container">
                        <div className="chart_albums_title">
                            <p className="charts_songs_title_p">Top Albums</p>
                        </div>
                        <div className="charts_albums_albums">
                            {charts && charts.chartAlbums.map((album, index) => {
                                if (index < 4) {
                                    return <div className="charts_albums">
                                        <img src={album.cover_big} className="chart_albums_image" alt="image-cover" />
                                        <p className="chart_album_title">{album.title}</p>
                                        <p className="chart_album_artist_name">{album.artist.name}</p>
                                    </div>
                                }
                            })}
                        </div>
                    </div>
                </div>
                <div className="advert_container">
                    <img src={cd} className="cd_image"/>
                    <div className="advert_content">
                        <p className="advert_content_head">50 million songs on all your devices</p>
                        <p className="advert_content_text">Expand your music experience with music store. Access it on your desktop, or on your mobile browser</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Welcome;