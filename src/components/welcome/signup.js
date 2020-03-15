import React, { Component } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import password from '../../assets/images/password.png'
import config from '../../config/config'

import '../../App.css'

class Signup extends Component {
    state = {
        song: null
    }

    validEmail = (email) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true
        } else {
            return false
        }
    }

    submitForm = (e) => {
        e.preventDefault()
        if (!this.validEmail(this.email.value)) {
            this.name.value = ''
            this.email.value = ''
            this.password.value = ''
            return alert('wrong email address')
        }
        const request = {
            userName: this.name.value,
            email: this.email.value,
            password: this.password.value,
        }

        axios.post(`${config.url}/signup`, request, config.headers)
            .then(response => {
                if (response.data === 'User already exists') {
                    this.name.value = ''
                    this.email.value = ''
                    this.password.value = ''
                    return alert('User already exists man')
                }
                localStorage.setItem("token", response.data.token);
            })
            .catch(e => console.log('this is the error', e))
    }

    show = () => {
        this.password.type = this.password.type === 'password' ? 'text' : 'password'
    }

    render() {
        const redirect = queryString.parse(this.props.location.search).redirect_link

        return (
            <div className="signup_image_container">
                <div className="signup_container">
                    <div className="signup_community_image">
                        <p>Join The Largest Music Community In The World</p>
                    </div>
                    <div className="signup">
                        <p className="signup_community">Join our community</p>
                        <p className="signup_existing">Existing User? <Link to={`/login?redirect_link=${redirect}`} style={{ textDecoration: 'none' }}>Login</Link></p>
                        <form className="signup_form" onSubmit={this.submitForm}>
                            <label className="signup_label">Display Name</label>
                            <input type="text" placeholder="John Doe" className="signup_text" ref={el => this.name = el} required={true} />
                            <label className="signup_label">E-mail Address</label>
                            <input type="email" placeholder="johndoe@example.com" className="signup_text" ref={el => this.email = el} required='true' />
                            <div className="signup_password_container">
                                <input type="password" placeholder="Password" minLength="6" className="signup_text_password" ref={el => this.password = el} required='true' />
                                <img src={password} alt="show password" className="signup_password_image" onClick={this.show} />
                            </div>
                        </form>
                        <Link to='/' style={{ textDecoration: 'none' }}>
                            <button className="signup_button" onClick={this.submitForm}>
                                SIGN UP
                        </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;