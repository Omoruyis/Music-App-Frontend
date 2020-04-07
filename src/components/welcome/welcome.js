import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

import playButton from '../../assets/images/playbutton.png'
import cd from '../../assets/images/cd.png'
import config from '../../config/config'

import '../../App.css';

class Welcome extends Component {
    state = {
        charts: null,
        type: null,
        id: 0,
        loggedIn: false
    }

    componentDidMount() {
        this.getCharts()
        if (this.props.loggedIn) {
            this.props.history.push('/explore')
        }
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

    render() {

        return (
            <div className="welcome_container">

                <div id="a">
                    <div className="welcome_page_buttons">
                        <Link to='/login' style={{ textDecoration: 'none' }}>
                            <button className="home_login_button">Sign In</button>
                        </Link>
                        <Link to='/signup' style={{ textDecoration: 'none' }}>
                            <button className="home_signup_button">Sign Up</button>
                        </Link>
                    </div>
                    <div className="welcome_page_details">
                        <h3 className="welcome_page_text">A New Way To Enjoy Music</h3>
                        <Link to='/explore' style={{ textDecoration: 'none' }}>
                            <button className="checkout_button">Explore<span style={{ paddingLeft: 10 }}><img src={playButton} alt="play button" /></span></button>
                        </Link>
                    </div>
                </div>
                <div className="advert_container">
                    <img src={cd} alt="cd" className="cd_image" />
                    <div className="advert_content">
                        <p className="advert_content_head">50 million songs on all your devices</p>
                        <p className="advert_content_text">Expand your music experience with music store. Access it on your desktop, or on your mobile browser</p>
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps({ loggedIn }) {
    return {
        loggedIn
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // getAlbums: () => dispatch(getAllAlbums()),
        // getTracks: () => dispatch(getAllTracks()),
        // getPlaylists: () => dispatch(getAllPlaylists()),
        // getLikes: () => dispatch(getAllLikes()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)

