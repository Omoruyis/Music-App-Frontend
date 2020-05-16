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
        try {
            this.changeLogout()
            await axios.get(`${config().url}/logout`, config().headers)
            this.props.dispatch(changeSong('', ''))
            this.props.dispatch(logout())
            this.changeLogout()
            this.props.history.push('/')
            localStorage.removeItem('token')
            localStorage.removeItem('name')
            localStorage.removeItem('account')
        } catch (e) {
            console.log(e)
        }
    }

    toggle = (e) => {
        document.querySelector('.sidebar_container').classList.toggle('active')
    }


    render() {
        const { name, logout, isPopoverOpen } = this.state
        const { type, id, loggedIn } = this.props
        return (
            <div className="explorenav_container">
                {loggedIn ? 
                    <div className='toggle-btn' onClick={this.toggle} id="show_hamburger">
                        <span className='line-1 rot'></span>
                        <span className='line-2 rot'></span>
                        <span className='line-3 '></span>
                    </div> : 
                    ''
                }
                <div className="explorenav_search">
                    <input type="search" placeholder="Search for tracks, albums, artists" className="explorenav_search_input" ref={el => this.search = el} onKeyPress={this.checkInput} />
                </div>

                {loggedIn ?
                    <div className="explorenav_buttons" id="reduce_width">
                        <p className="display_name hide_display_name">{name}</p>
                        <Popover
                            isOpen={isPopoverOpen}
                            position={['bottom']}
                            onClickOutside={() => this.setState({ isPopoverOpen: false })}
                            content={(
                                <div
                                    style={{ backgroundColor: 'white', position: 'fixed', top: '70px', right: '20px', boxShadow: '0 0 6px rgba(25, 25, 34, .16)', padding: '10px 0', minWidth: '120px'}}
                                >
                                    <p className="show_display_name">Signed in as <span>{name}</span></p>
                                    {localStorage.account === 'local' ? <Link to={`/changepassword?redirect_link=${type}${id ? `/${id}` : ''}`} style={{ textDecoration: 'none', color: 'black' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0px' }}  className="logout_holder">
                                    <p style={{ marginBottom: '0' }} className="logout_text">Change Password</p>
                                    </div></Link> : ''}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0px' }}  className="logout_holder" onClick={this.logout}>
                                        <p className="logout_text">{logout ? "Signing Out" : "Sign Out"}</p>
                                    </div>
                                </div>
                            )}
                        >
                            <div onClick={() => this.setState({ isPopoverOpen: !isPopoverOpen })} className="popup_drop">
                                <IoMdArrowDropdown className="pop_drop_icon" />
                            </div>
                        </Popover>
                    </div> :
                    <div style={{ width: '40%'}} className="remove_popup_icon">
                        <div className="explorenav_buttons" id="hide_sign">
                            <Link to={`/login?redirect_link=${type}${id ? `/${id}` : ''}`} style={{ textDecoration: 'none' }} >
                                <button className="explorenav_login">Sign In</button>
                            </Link>
                            <Link to={`/signup?redirect_link=${type}${id ? `/${id}` : ''}`} style={{ textDecoration: 'none' }}>
                                <button className="explorenav_signup">Sign Up</button>
                            </Link>
                        </div>

                        <Popover
                            isOpen={isPopoverOpen}
                            position={['bottom']}
                            onClickOutside={() => this.setState({ isPopoverOpen: false })}
                            content={(
                                <div
                                    style={{ backgroundColor: 'white', position: 'fixed', top: '70px', right: '20px', boxShadow: '0 0 6px rgba(25, 25, 34, .16)', padding: '10px 0' }}
                                >
                                    <Link to={`/login?redirect_link=${type}${id ? `/${id}` : ''}`} style={{ textDecoration: 'none', color: 'black' }} >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0px' }}  className="logout_holder"><p style={{ marginBottom: '0' }} className="logout_text">Sign In</p></div>
                                    </Link>
                                    <Link to={`/signup?redirect_link=${type}${id ? `/${id}` : ''}`} style={{ textDecoration: 'none', color: 'black', marginTop: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0px' }}  className="logout_holder"><p style={{ marginBottom: '0' }} className="logout_text">Sign Up</p></div>
                                    </Link>
                                </div>
                            )}
                        >
                            <div onClick={() => this.setState({ isPopoverOpen: !isPopoverOpen })} className="popup_drop">
                                <IoMdArrowDropdown className="pop_drop_icon" id="hide_dropdown"/>
                            </div>
                        </Popover>
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

