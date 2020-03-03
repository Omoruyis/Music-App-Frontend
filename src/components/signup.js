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
            <div>
                <form onSubmit={this.fetch}>
                    <input type="email" placeholder="email" ref={el => this.email = el} />
                    <input type="password" placeholder="password" ref={el => this.password = el} />
                    <input type="text" placeholder="fistName" ref={el => this.firstname = el} />
                    <input type="text" placeholder="lastName" ref={el => this.lastname = el} />
                    <input type="number" placeholder="phone number" ref={el => this.number = el} />
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

export default Signup;