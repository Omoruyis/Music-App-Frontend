import React, { Component } from 'react';
import config from '../config/config'
import axios from 'axios'
import { GoogleLogin } from 'react-google-login'

import password from '../assets/images/password.png'

import '../App.css';

class Login extends Component {

    validEmail = (email) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true
        } else {
            return false
        }
    }

    responseGoogle = (res) => {
        axios.post(`${config().url}/googleLogin`, { id: res.googleId, email: res.profileObj.email, displayName: res.profileObj.name }, config().headers)
            .then(result => {
                console.log(result)
                localStorage.setItem("token", result.data.token);
                localStorage.setItem("name", result.data.google.displayName);
                if (window.redirect) {
                    this.props.history.push(window.redirect)
                } else {
                    this.props.history.push('/explore')
                }
            })
            .catch(e => console.log('this is the error', e))
    }
      
    login = (e) => {
        e.preventDefault()
        if (!this.validEmail(this.email.value)) {
            return alert('wrong email address')
        }
        const request = {
            email: this.email.value,
            password: this.password.value
        }

        axios.post(`${config().url}/login`, request, config().headers)
            .then(res => {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("name", res.data.local.userName);
                if (window.redirect) {
                    this.props.history.push(window.redirect)
                } else {
                    this.props.history.push('/explore')
                }
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

        axios.post(`${config().url}/reset`, request, config().headers)
            .then(response => {
                console.log(response.data)
            })
            .catch(e => console.log('this is the error', e))
    }

    show = () => {
        this.password.type = this.password.type === 'password' ? 'text' : 'password'
    }


    render() {
        return (
            <div className="login_container">
                <div className="login_section">
                    <p className="login">LOGIN</p>
                    <form onSubmit={this.login} style={{width: '100%'}}>
                        <input type="email" placeholder="Email Address" className="login_details" ref={el => this.email = el} required />
                        <div className="login_password">
                            <input type="password" placeholder="Password" minLength="6" className="login_details_password" ref={el => this.password = el} required />
                            <img src={password} alt="show password" className="password_image" onClick={this.show} />
                        </div>
                    </form>
                    <button className="login_button" onClick={this.login}>LOGIN</button>
                    <div className="login_or">
                        <div className="login_underline"></div><p className="login_text">Or</p><div className="login_underline"></div>
                    </div>
                    <GoogleLogin 
                        clientId= "271277109562-8tt8jqb5m0cg2b5pgph5ig419irp4ir2.apps.googleusercontent.com"
                        buttonText= "LOGIN WITH GOOGLE"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy={'single_host_origin'}
                        className="login_google"
                    />
                    <div className="login_create_account">
                        <p className="login_text">Don't have an account?</p>
                        <button className="login_button">SIGN UP</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;