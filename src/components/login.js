import React, { Component } from 'react';
import config from '../config/config'
import axios from 'axios'

import '../App.css';

class Login extends Component {

    validEmail = (email) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true
        } else {
            return false
        }
    }

    login = (e) => {
        e.preventDefault()
        if (!this.validEmail(this.email.value) ) {
            return alert('wrong email address')
        }

        const request = {
            email: this.email.value,
            password: this.password.value
        }

        axios.post(`${config.url}/login`, request, config.headers)
            .then(user => {
                console.log(user)
            })
            .catch(e => console.log('this is the error', e))   
    }

    update = (e) => {
        e.preventDefault()
        const request = {
            email: this.newemail.value,
            password: this.newpassword.value,
            newpassword: this.updatedpassword.value
        }

        axios.post(`${config.url}/reset`, request, config.headers)
            .then(response => {
                console.log(response.data)
            })
            .catch(e => console.log('this is the error', e))
    }


    render() {
        return (
            <div>
                <form onSubmit={this.login}>
                    <input type="email" placeholder="email" ref={el => this.email = el}/>
                    <input type="password" placeholder="password" ref={el => this.password = el}/>
                    <button type="submit">Submit</button>
                </form>
                <form onSubmit={this.update}>
                    <input type="email" placeholder="email" ref={el => this.newemail = el} />
                    <input type="password" placeholder="password" ref={el => this.newpassword = el} />
                    <input type="password" placeholder="new password" ref={el => this.updatedpassword = el} />
                    <button type="submit">Change Password</button>
                </form>
            </div>
        );
    }  
}

export default Login;