import React, { Component } from 'react';
import axios from 'axios'
import Carousel from 'react-bootstrap/Carousel'
import playButton from '../assets/images/playbutton.png'


import '../App.css';

function Welcome(props) {
    return (
        <div className="welcome-container">

            <div id="a">
                <div className="welcome-page-buttons">
                    <p className="login-button">Login</p>
                    <button className="signup-button">Sign up</button>
                </div>
                <div className="welcome-page-details">
                    <h3 className="welcome-page-text">A New Way To Enjoy Music</h3>
                    <buttton className="checkout-button">Check out store <span style={{paddingLeft: 10}}><img src={playButton}/></span></buttton>
                </div>
            </div>


            {/* <Carousel
                interval={10000}
            >
                <Carousel.Item>
                    <div id="a">
                        <img
                            className="d-block w-100"
                            src={carousel1}
                            alt="Second slide"
                        />
                    </div>
                    <p className="login-button">Login</p>
                    <button className="signup-button">Sign up</button>
                    <Carousel.Caption>
                        <h3 id="carousel-caption">A New Way To Enjoy Music</h3>
                        <buttton className="checkout-button">Check out store</buttton>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                        <div id="a">
                            <img
                                className="d-block w-100"
                                src={carousel1}
                                alt="Second slide"
                            />
                        </div>

                        <Carousel.Caption>
                            <h3>Second slide label</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div id="a">
                            <img
                                className="d-block w-100"
                                src={carousel1}
                                alt="Second slide"
                            />
                        </div>

                        <Carousel.Caption>
                            <h3>Third slide label</h3>
                            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
            </Carousel> */}
        </div>
    );
}

export default Welcome;