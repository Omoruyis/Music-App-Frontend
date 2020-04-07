import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'

import config from '../../config/config'
import { logout, changeSong } from '../../actions'

import '../../App.css';

class Nav extends Component {
    state = {
        inputValue: false,
        name: localStorage.name,
        logout: false
    }

    checkInput = (e) => {
        if (e.key === 'Enter') {
            const value = this.search.value
            this.search.blur()
            this.search.value = ''
            this.props.history.push(`/search/${value}`)
        }
    }

    clearSearch = () => {
        this.search.value = ''
        this.checkInput()
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
        const { type, id } = this.props
        return (
            <div className="explorenav_container">
                <div className="explorenav_search">
                    <input type="search" placeholder="Search for tracks, albums, artists" className="explorenav_search_input" ref={el => this.search = el} onKeyPress={this.checkInput} />
                </div>

                {name ?
                    <div className="explorenav_buttons">
                        <p className="display_name">{name}</p>
                        <button className="logout_button" id={logout ? 'logout_button' : ''} disabled={logout} onClick={this.logout}>{logout ? "Signing Out" : "Sign Out"}</button>
                    </div> :
                    <div className="explorenav_buttons">
                        <Link to={`/login?redirect_link=${type}${id ? `/${id}` : ''}`} style={{textDecoration: 'none' }} >
                        <button className="explorenav_login">Sign In</button>
                        </Link>
                        <Link to={`/signup?redirect_link=${type}${id ? `/${id}` : ''}`} style={{textDecoration: 'none' }}>
                        <button className="explorenav_signup">Sign Up</button>
                        </Link>
                    </div>
                }

            </div>
        )
    }
}

export default connect()(Nav)

