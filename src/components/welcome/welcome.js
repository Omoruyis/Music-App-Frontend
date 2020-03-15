import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'

import playButton from '../../assets/images/playbutton.png'
import play from '../../assets/images/play.png'
import star from '../../assets/images/star.png'
import cd from '../../assets/images/cd.png'
import config from '../../config/config'

import '../../App.css';

class Welcome extends Component {
    state = {
        charts: null,
        type: null,
        id: 0,
    }

    getCharts = async () => {
        const result = await axios.get(`${config.url}/explore`, config.headers)
        this.setState({
            charts: result.data
        })
    }

    play = (id, type) => {
        this.setState({
            id,
            type
        })
    }

    appendIframe = (e) => {
        const parent = e.target.parentNode.parentNode
        const html = `<div class="iframe">
        <iframe scrolling="no" frameborder="0" allowTransparency="true" src="https://www.deezer.com/plugins/player?format=classic&autoplay=false&emptyPlayer=true&playlist=false&width=700&height=350&color=ff0000&layout=dark&size=medium&type=album&id=119606&app_id=1" width="700" height="90"></iframe>
        <button onClick="removeIframe
        ()">remove</button>
    </div>`
        parent.insertAdjacentHTML('beforeend', html)
    }

    componentDidMount() {
        this.getCharts()
    }

    render() {
        const { charts, id, type } = this.state

        return (
            <div className="welcome_container">

                <div id="a">
                    <div className="welcome_page_buttons">
                        <Link to='/login' style={{ textDecoration: 'none' }}>
                            <button className="home_login_button">Login</button>
                        </Link>
                        <Link to='/signup' style={{ textDecoration: 'none' }}>
                            <button className="home_signup_button">Sign up</button>
                        </Link>
                    </div>
                    <div className="welcome_page_details">
                        <h3 className="welcome_page_text">A New Way To Enjoy Music</h3>
                        <Link to='/explore' style={{ textDecoration: 'none' }}>
                            <buttton className="checkout_button">Explore<span style={{ paddingLeft: 10 }}><img src={playButton} alt="play button" /></span></buttton>
                        </Link>
                    </div>
                </div>
                {/* <div className="charts">
                    <div className="charts_songs_container">
                        <div className="charts_songs_title">
                            <p className="charts_songs_title_p">Top Songs</p>
                            <div className="iframe_container">
                                <div className="chart_songs_head">
                                    <p className="more_width">#</p>
                                    <p className="more_width">Track/Artist</p>
                                    <p>Album</p>
                                    <p>Time</p>
                                    <p>Add</p>
                                    <p onClick={this.appendIframe}>Like</p>
                                </div>

                            </div> */}
                {/* {charts && charts.tracks.map((track, index) => {
                                if (index < 4) {
                                    return <div className="charts_songs" key={index}>
                                        <div className="charts_songs_images">
                                            <p className="chart_song_number">{track.position}</p>
                                            <img src={track.album.cover} className="chart_song_cover" alt="track-cover" />
                                            <img src={play} className="chart_song_play_image" alt="play" onClick={() => {
                                                this.play(track.id, track.type)
                                            }} />
                                        </div>
                                        <div className="charts_songs_track">
                                            <p className="song">{track.title}</p>
                                            <p className="artist">{track.artist.name}</p>
                                        </div>
                                        <p>Album</p>
                                        <p>Time</p>
                                        <p>Add</p>
                                        <img src={star} alt="like" className="charts_like" />
                                    </div>
                                } else { return '' }
                            })}
                            <div id="charts_songs_button">
                                <button className="charts_songs_button">Show More</button>
                            </div> */}
                {/* </div>
                    </div>
                    <div className="charts_albums_container">
                        <div className="chart_albums_title">
                            <p className="charts_songs_title_p">Top Albums</p>
                        </div>
                        <div className="charts_albums_albums">
                            {charts && charts.chartAlbums.map((album, index) => {
                                if (index < 4) {
                                    return <div className="charts_albums" key={index}>
                                        <img src={album.cover_big} className="chart_albums_image" alt="album cover" />
                                        <p className="chart_album_title">{album.title}</p>
                                        <p className="chart_album_artist_name">{album.artist.name}</p>
                                    </div>
                                } else { return '' }
                            })}
                        </div>
                    </div>
                </div> */}
                <div className="advert_container">
                    <img src={cd} alt="cd" className="cd_image" />
                    <div className="advert_content">
                        <p className="advert_content_head">50 million songs on all your devices</p>
                        <p className="advert_content_text">Expand your music experience with music store. Access it on your desktop, or on your mobile browser</p>
                    </div>
                </div>
                {/* <div className="iframe_container">
                    <iframe title="music-player" scrolling="no" frameborder="0" allowTransparency="true" src={`https://www.deezer.com/plugins/player?format=classic&autoplay=false&emptyPlayer=true&playlist=false&width=100%&height=350&color=ff0000&layout=dark&size=medium&type=${type}s&id=${id}&app_id=1`} width="100%" height="90"></iframe>
                </div> */}
            </div>
        );
    }
}

export default Welcome;