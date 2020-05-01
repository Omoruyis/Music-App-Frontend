import React, { Component } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { IoIosEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import queryString from 'query-string'
import Modal from 'react-modal';

import config from '../../config/config'
import successful from '../../assets/images/successful.jpg'


import '../../App.css'

const customStyles = {
    overlay: {
        backgroundColor: 'none',
        zIndex: 200
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '650px',
        height: '350px',
        padding: '10px 10px',
        border: 'none',
        boxShadow: '0 0 6px rgba(25, 25, 34, .16)'
    }
};

class Signup extends Component {
    state = {
        song: null,
        show: false,
        login: false,
        modalIsOpen: false
    }

    openModal = () => {
        this.setState({ modalIsOpen: true })
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false })
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
            default:
                return ''
        }
    }

    changeLogin = () => {
        this.setState({
            login: !this.state.login
        })
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
            return this.createNotification('error', 'Please put a password with 6 or more characters')
        }
        this.changeLogin()
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
                    this.changeLogin()
                    return this.createNotification('error', 'This account already exists')
                }
                this.changeLogin()
                // return this.createNotification('success', `You've successfully signed up. Please proceed to login`)
                this.openModal()
            })
            .catch(e => console.log(e))
    }

    show = () => {
        this.password.type = this.password.type === 'password' ? 'text' : 'password'
        this.setState({
            show: !this.state.show
        })
    }

    render() {
        const redirect = queryString.parse(this.props.location.search).redirect_link
        const { show, login, modalIsOpen } = this.state

        return (
            <div className="signup_image_container">
                <NotificationContainer />
                <div className="signup_container">
                    <div className="signup_community_image">
                        <p>Join The Largest Music Community In The World</p>
                    </div>
                    <div className="signup">
                        <p className="signup_community">Join our community</p>
                        <p className="signup_existing">Existing User? <Link to={`/login${redirect ? `?redirect_link=${redirect}` : ''}`} style={{ textDecoration: 'none' }}>Sign In</Link></p>
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
                                <button type="submit" className="login_button" id={login ? 'disable_button' : ''} disabled={login} onClick={this.submitForm} style={{width: '70%'}}>{login ? "Signing Up" : "Sign Up"}</button>
                            </div>
                        </form>
                    </div>
                </div>

                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={() => this.closeModal()}
                    style={customStyles}
                >
                    <div className="signup_modal">
                        <img src={successful} alt="successful signup cover" className="" />
                        <p className="signup_successful_text">You have successfully signed up</p>
                    </div>
                    <div className="signup_modal_signin">
                        <Link to={`/login${redirect ? `?redirect_link=${redirect}` : ''}`} style={{ textDecoration: 'none', fontSize: '25px' }}>Sign In</Link>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Signup;