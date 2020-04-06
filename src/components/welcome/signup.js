import React, { Component } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { IoIosEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import queryString from 'query-string'

import config from '../../config/config'

import '../../App.css'

class Signup extends Component {
    state = {
        song: null,
        show: false,
    }

    validEmail = (email) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true
        } else {
            return false
        }
    }

    createNotification = (type, message) => {
        switch (type) {
          case 'success':
            NotificationManager.success(message, '', 5000);
            break;
          case 'error':
            NotificationManager.error(message, '', 2000);
            break;
        }
    }

    submitForm = (e) => {
        e.preventDefault()
        if (this.name.value.length < 1 ) {
            return this.createNotification('error', 'Please input a username')
        }
        if (!this.validEmail(this.email.value)) {
            return this.createNotification('error', 'Wrong email address')
        }
        if (this.password.value.length < 6) {
            return this.createNotification('error', 'Please put a password with more than 6 characters')
        }
        const request = {
            userName: this.name.value,
            email: this.email.value,
            password: this.password.value,
        }

        axios.post(`${config().url}/signup`, request, config().headers)
            .then(response => {
                if (response.data === 'User already exists') {
                    this.name.value = ''
                    this.email.value = ''
                    this.password.value = ''
                    return this.createNotification('error', 'This user already exists')
                }
                // localStorage.setItem("token", response.data.token);
                return this.createNotification('success', `You've successfully signed up. Please proceed to login`)
                // this.props.history.push(`/${this.state.redirect ?  `?redirect_link=${this.state.redirect}` : ''}`)
            })
            .catch(e => console.log('this is the error', e))
    }

    show = () => {
        this.password.type = this.password.type === 'password' ? 'text' : 'password'
        this.setState({
            show: !this.state.show
        })
    }

    render() {
        const redirect = queryString.parse(this.props.location.search).redirect_link
        const { show } = this.state

        return (
            <div className="signup_image_container">
                <NotificationContainer />
                <div className="signup_container">
                    <div className="signup_community_image">
                        <p>Join The Largest Music Community In The World</p>
                    </div>
                    <div className="signup">
                        <p className="signup_community">Join our community</p>
                        <p className="signup_existing">Existing User? <Link to={`/login${redirect ? `?redirect_link=${redirect}` : ''}`} style={{ textDecoration: 'none' }}>Login</Link></p>
                        <form className="signup_form" onSubmit={this.submitForm}>
                            <label className="signup_label">Display Name</label>
                            <input type="text" placeholder="User One" className="signup_text" ref={el => this.name = el} required={true} />
                            <label className="signup_label">E-mail Address</label>
                            <input type="email" placeholder="johndoe@example.com" className="signup_text" ref={el => this.email = el} required={true} />
                            <div className="signup_password_container">
                                <input type="password" placeholder="Password" minLength={6} className="signup_text_password" ref={el => this.password = el} required={true} />
                                {show ? <IoMdEyeOff className="password_second_image" onClick={this.show}/> : <IoIosEye className="password_second_image" onClick={this.show}/>}
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <button type="submit" className="login_button" onClick={this.submitForm} style={{width: '70%'}}>SIGN UP</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;