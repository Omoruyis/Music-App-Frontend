import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'

import config from '../../config/config'
import { logout, changeSong } from '../../actions'

import '../../App.css';

class LibraryNav extends Component {
    state = {
        name: localStorage.name, 
        logout: false
    }

    changeLogout = () => {
        this.setState({
            logout: !this.state.logout
        })
    }

    logout = async () => {
        this.changeLogout()
        await axios.get(`${config().url}/logout`, config().headers)
        this.props.dispatch(changeSong('', ''))
        this.props.dispatch(logout())
        this.changeLogout()
        this.props.history.push('/')
        localStorage.removeItem('token')
        localStorage.removeItem('name')
    }


    render() {
        const { name, logout } = this.state
        return (
            <div className="explorenav_buttons">
                <p className="display_name">{name}</p>
                <button className="logout_button" id={logout ? 'logout_button' : ''} disabled={logout} onClick={this.logout}>{logout ? "Signing Out" : "Sign Out"}</button>
            </div>
        )
    }
}

export default connect()(LibraryNav)

