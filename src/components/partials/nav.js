import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Popover from 'react-tiny-popover'
import { IoMdArrowDropdown } from "react-icons/io";
import { IoIosArrowRoundForward } from "react-icons/io";
import axios from 'axios'

import config from '../../config/config'
import { logout, changeSong } from '../../actions'

import '../../App.css';

class Nav extends Component {
    state = {
        inputValue: false,
        name: localStorage.name,
        logout: false,
        isPopoverOpen: false
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
        localStorage.removeItem('account')
    }


    render() {
        const { name, logout, isPopoverOpen } = this.state
        const { type, id, loggedIn } = this.props
        return (
            <div className="explorenav_container">
                <div className="explorenav_search">
                    <input type="search" placeholder="Search for tracks, albums, artists" className="explorenav_search_input" ref={el => this.search = el} onKeyPress={this.checkInput} />
                </div>

                {loggedIn ?
                    <div className="explorenav_buttons">
                        <p className="display_name">{name}</p>
                        <Popover
                            isOpen={isPopoverOpen}
                            position={['bottom']}
                            onClickOutside={() => this.setState({ isPopoverOpen: false })}
                            content={(
                                <div
                                    style={{ backgroundColor: 'white', position: 'fixed', top: '70px', right: '20px', boxShadow: '0 0 6px rgba(25, 25, 34, .16)', padding: '10px 20px' }}
                                >
                                    {localStorage.account === 'local' ? <Link to={`/changepassword?redirect_link=${type}${id ? `/${id}` : ''}`} style={{ textDecoration: 'none', color: 'black' }}><p className="turn_red">Change Password</p></Link> : ''}
                                    <div style={{display: 'flex',  justifyContent: 'space-between', alignItems: 'center', marginTop: '10px'}}>
                                        <IoIosArrowRoundForward className="back_arrow"/>
                                        <button className="logout_button" id={logout ? 'logout_button' : ''} disabled={logout} onClick={this.logout}>{logout ? "Signing Out" : "Sign Out"}</button>
                                    </div>
                                </div>
                            )}
                        >
                            <div onClick={() => this.setState({ isPopoverOpen: !isPopoverOpen })} className="popup_drop">
                                <IoMdArrowDropdown className="pop_drop_icon" />
                            </div>
                        </Popover>
                    </div> :
                    <div className="explorenav_buttons">
                        <Link to={`/login?redirect_link=${type}${id ? `/${id}` : ''}`} style={{ textDecoration: 'none' }} >
                            <button className="explorenav_login">Sign In</button>
                        </Link>
                        <Link to={`/signup?redirect_link=${type}${id ? `/${id}` : ''}`} style={{ textDecoration: 'none' }}>
                            <button className="explorenav_signup">Sign Up</button>
                        </Link>
                    </div>
                }

            </div>
        )
    }
}


function mapStateToProps({ loggedIn }) {
    return {
        loggedIn,
    }
}


export default connect(mapStateToProps)(Nav)

