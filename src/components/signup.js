import React, { Component } from 'react';
import config from '../config/config'
import axios from 'axios'

import '../App.css';

class Signup extends Component {

    validEmail = (email) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true
        } else {
            return false
        }
    }

    fetch = (e) => {
        e.preventDefault()
        if (!this.validEmail(this.email.value)) {
            return alert('wrong email address')
        }
        const request = {
            email: this.email.value,
            password: this.password.value,
            firstName: this.firstname.value,
            lastName: this.lastname.value,
            phoneNumber: this.number.value,
        }

        axios.post(`${config.url}/signup`, request, config.headers)
            .then(response => {
                console.log(config.headers)
                if (response.data === 'User already exists') {
                    return alert('User already exists man')
                }
                console.log(response.data)
            })
            .catch(e => console.log('this is the error', e))
    }

    render() {
        return (
            <div className="signup_image_container">
                <div className="signup_container">
                    <div className="signup_text">
                        <p>Join The Largest Music Community In The World</p>
                    </div>
                    <div className="signup">
                        <p className="signup_community">Join our community</p>
                        <p className="signup_existing">Existing User? <a>Sign in</a></p>
                        <form>
                            <label>Display Name</label>
                            <input type="text" placeholder="John Doe" className="underline"/>
                            <label>E-mail Address</label>
                            <input type="email" placeholder="johndoe@example.com"/>
                            <label>Password</label>
                            <input type="password"/>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;