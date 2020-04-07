import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'

import config from '../../config/config'
import { logout, changeSong } from '../../actions'

import '../../App.css';

class LibraryNav extends Component {
    state = {
        name: localStorage.name
    }

    logout = async () => {
        await axios.get(`${config().url}/logout`, config().headers)
        this.props.dispatch(changeSong('', ''))
        this.props.dispatch(logout())
        this.props.history.push('/')
        localStorage.removeItem('token')
        localStorage.removeItem('name')
    }


    render() {
        const { name } = this.state
        return (
            <div className="explorenav_buttons">
                <p className="display_name">{name}</p>
                <button className="logout_button" onClick={this.logout}>Log out</button>
            </div>
        )
    }
}

export default connect()(LibraryNav)

