import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import playButton from '../../assets/images/playbutton.png'
import cd from '../../assets/images/cd.jpg'

import '../../App.css';

class Welcome extends Component {
    state = {
        type: null,
        id: 0,
        loggedIn: false
    }

    componentDidMount() {
        if (this.props.loggedIn) {
            this.props.history.push('/explore')
        }
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
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)

