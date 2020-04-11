import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { IoIosEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import queryString from 'query-string'

import config from '../../config/config'

import '../../App.css';

class Reset extends Component {
    state={
        show: false,
        show2: false,
        reset: false
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
            NotificationManager.success(message, '', 3000);
            break;
          case 'error':
            NotificationManager.error(message, '', 2000);
            break;
        }
    }

    changeReset = () => {
        this.setState({
            reset: !this.state.reset
        })
    }

    update = (e) => {
        e.preventDefault()
        if (!this.validEmail(this.email.value)) {
            this.email.value = ''
            this.password.value = ''
            this.newPassword.value = ''
            return this.createNotification('error', 'Invalid email address')
        }
        if (this.password.value === this.newPassword.value) {
            return this.createNotification('error', 'Please put a new password different from the old one')
        }
        if (this.password.value.length < 6) {
            return this.createNotification('error', 'Please put a password with more than 6 characters')
        }
        if (this.newPassword.value.length < 6) {
            return this.createNotification('error', 'Please put a new password with more than 6 characters')
        }
        this.changeReset()
        const request = {
            email: this.email.value,
            password: this.password.value,
            newPassword: this.newPassword.value
        }

        axios.post(`${config().url}/reset`, request, config().headers)
            .then(response => {
                this.changeReset()
                if (response.data === 'Your password has been changed successfully') {
                    this.createNotification('success', response.data)
                    this.email.value = ''
                    this.password.value = ''
                    this.newPassword.value = ''
                    return
                }
                this.createNotification('error', response.data)
            })
            .catch(e => console.log(e))
    }

    show = (second) => {
        if (!second) {
            this.password.type = this.password.type === 'password' ? 'text' : 'password'
            this.setState({
                show: !this.state.show
            })
        } else {
            this.newPassword.type = this.newPassword.type === 'password' ? 'text' : 'password'
            this.setState({
                show2: !this.state.show2
            })
        }
    }


    render() {
        const redirect = queryString.parse(this.props.location.search).redirect_link
        const { show, show2, reset } = this.state

        return (
            <div className="login_container">
                <NotificationContainer />
                <div className="reset_section">
                    <form onSubmit={this.login} style={{ width: '100%' }}>
                        <input type="email" placeholder="Email Address" className="login_details" ref={el => this.email = el} required={true} />
                        <div className="login_password">
                            <input type="password" placeholder="Password" minLength="6" className="login_details_password" ref={el => this.password = el} required={true} />
                            {show ? <IoMdEyeOff className="password_image" onClick={() => this.show()}/> : <IoIosEye className="password_image" onClick={() => this.show()}/>}
                        </div>
                        <div className="login_password">
                            <input type="password" placeholder="New Password" minLength="6" className="login_details_password" ref={el => this.newPassword = el} required={true} />
                            {show2 ? <IoMdEyeOff className="password_image" onClick={() => this.show(2)}/> : <IoIosEye className="password_image" onClick={() => this.show(2)}/>}
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <button type="submit" className="login_button" id={reset ? 'disable_button' : ''} disabled={reset} onClick={this.update}>{reset ? "Updating" : "Update"}</button>
                        </div>
                    </form>
                    
                    <div className="login_create_account">
                        <Link to={`/${redirect}`} style={{ textDecoration: 'none' }}>
                            RETURN TO LIBRARY
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}


export default Reset