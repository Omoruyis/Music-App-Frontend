import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'

import config from '../../config/config'
import { logout } from '../../actions'

import '../../App.css';

class Nav extends Component {
    state = {
        inputValue: false,
        name: localStorage.name
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

    logout = async () => {
        await axios.get(`${config().url}/logout`, config().headers) 
        this.props.dispatch(logout())
        this.props.history.push('/')
        localStorage.removeItem('token')
        localStorage.removeItem('name')
    }


    render() {
        const { name } = this.state
        const { type, id } = this.props
        return (
            <div className="explorenav_container">
                <div className="explorenav_search">
                    <input type="search" placeholder="Search" className="explorenav_search_input" ref={el => this.search = el} onKeyPress={this.checkInput} />
                </div>

                {name ?
                    <div className="explorenav_buttons">
                        <p className="display_name">{name}</p>
                        <button className="logout_button" onClick={this.logout}>Log out</button>
                    </div> :
                    <div className="explorenav_buttons">
                        <Link to={`/login?redirect_link=${type}${id ? `/${id}` : ''}`} style={{textDecoration: 'none' }} >
                        <button className="explorenav_login">Login</button>
                        </Link>
                        <Link to={`/signup?redirect_link=${type}${id ? `/${id}` : ''}`} style={{textDecoration: 'none' }}>
                        <button className="explorenav_signup">Sign up</button>
                        </Link>
                    </div>
                }

            </div>
        )
    }
}

export default connect()(Nav)

