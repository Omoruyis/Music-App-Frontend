import React, { Component } from 'react';
import { Link } from 'react-router-dom'

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
                    </div> :
                    <div className="explorenav_buttons">
                        <Link to={`/login?redirect_link=${type}/${id}`} style={{textDecoration: 'none' }} >
                        <button className="explorenav_login">Login</button>
                        </Link>
                        <Link to={`/signup?redirect_link=${type}/${id}`} style={{textDecoration: 'none' }}>
                        <button className="explorenav_signup">Sign up</button>
                        </Link>
                    </div>
                }

            </div>
        )
    }
}

export default Nav

