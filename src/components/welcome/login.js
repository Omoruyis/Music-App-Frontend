import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { GoogleLogin } from 'react-google-login'
import { IoIosEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import queryString from 'query-string'

import { login } from '../../actions'
import config from '../../config/config'

import '../../App.css';

class Login extends Component {
    state={
        show: false
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
            NotificationManager.success('Successfully signed up', '', 3000);
            break;
          case 'error':
            NotificationManager.error(message, '', 2000);
            break;
        }
    }

    responseGoogle = (res) => {
        const redirect = queryString.parse(this.props.location.search).redirect_link
        axios.post(`${config().url}/googleLogin`, { id: res.googleId, email: res.profileObj.email, displayName: res.profileObj.name }, config().headers)
            .then(result => {
                localStorage.setItem("token", result.data.token);
                localStorage.setItem("name", result.data.google.displayName);
                this.props.login()
                if (redirect) {
                    this.props.history.push(`/${redirect}`)
                } else {
                    this.props.history.push('/explore')
                }
            })
            .catch(e => console.log('this is the error', e))
    }

    login = (e) => {
        e.preventDefault()
        if (!this.validEmail(this.email.value)) {
            this.createNotification('error', 'Invalid email address')
            return 
        }
        const request = {
            email: this.email.value,
            password: this.password.value
        }
        const redirect = queryString.parse(this.props.location.search).redirect_link

        axios.post(`${config().url}/login`, request, config().headers)
            .then(res => {
                if (res.data.token) {
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("name", res.data.local.userName);
                    this.props.login()
                    if (redirect) {
                        this.props.history.push(`/${redirect}`)
                    } else {
                        this.props.history.push('/explore')
                    }
                } else {
                    this.createNotification('error', res.data)
                }
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
            <div className="login_container">
                <NotificationContainer />
                <div className="login_section">
                    <p className="login">LOGIN</p>
                    <form onSubmit={this.login} style={{ width: '100%' }}>
                        <input type="email" placeholder="Email Address" className="login_details" ref={el => this.email = el} required={true} />
                        <div className="login_password">
                            <input type="password" placeholder="Password" minLength="6" className="login_details_password" ref={el => this.password = el} required={true} />
                            {show ? <IoMdEyeOff className="password_image" onClick={this.show}/> : <IoIosEye className="password_image" onClick={this.show}/>}
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <button type="submit" className="login_button" onClick={this.login}>LOGIN</button>
                        </div>
                    </form>
                    
                    <Link to={`/reset${redirect ? `?redirect_link=${redirect}` : ''}`} style={{ textDecoration: 'none', marginTop: '10px' }}>
                            Reset Password
                        </Link>
                    {/* <p>Change Password</p> */}
                    <div className="login_or">
                        <div className="login_underline"></div><p className="login_text">Or</p><div className="login_underline"></div>
                    </div>
                    <GoogleLogin
                        clientId="271277109562-8tt8jqb5m0cg2b5pgph5ig419irp4ir2.apps.googleusercontent.com"
                        buttonText="LOGIN WITH GOOGLE"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy={'single_host_origin'}
                        className="login_google"
                    />
                    <div className="login_create_account">
                        <p className="login_text" style={{marginBottom: '0'}}>Don't have an account?</p>
                        <Link to={`/signup${redirect ? `?redirect_link=${redirect}` : ''}`} style={{ textDecoration: 'none' }}>
                            <p className="move_sign_up">SIGN UP</p>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps() {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        login: () => dispatch(login())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)