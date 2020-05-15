import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Popover from 'react-tiny-popover'
import { IoMdArrowDropdown } from "react-icons/io";
import { IoIosArrowRoundForward } from "react-icons/io";

import config from '../../config/config'
import { logout, changeSong } from '../../actions'

import '../../App.css';

class LibraryNav extends Component {
    state = {
        name: localStorage.name,
        logout: false,
        isPopoverOpen: false
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


    render() {
        const { name, logout, isPopoverOpen } = this.state
        const { location } = this.props
        return (
            <div className="explorenav_buttons">
                {/* <p className="display_name">{name}</p>
                <Popover
                    isOpen={isPopoverOpen}
                    position={['bottom']}
                    onClickOutside={() => this.setState({ isPopoverOpen: false })}
                    content={(
                        <div
                            style={{ backgroundColor: 'white', position: 'fixed', top: '70px', right: '20px', boxShadow: '0 0 6px rgba(25, 25, 34, .16)', padding: '10px 20px' }}
                        >
                            {localStorage.account === 'local' ? <Link to={`/changepassword?redirect_link=${location.pathname.slice(1)}`} style={{ textDecoration: 'none', color: 'black' }}><p className="turn_red">Change Password</p></Link> : ''}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                <IoIosArrowRoundForward className="back_arrow" />
                                <button className="logout_button" id={logout ? 'logout_button' : ''} disabled={logout} onClick={this.logout}>{logout ? "Signing Out" : "Sign Out"}</button>
                            </div>
                        </div>
                    )}
                >
                    <div onClick={() => this.setState({ isPopoverOpen: !isPopoverOpen })} className="popup_drop">
                        <IoMdArrowDropdown className="pop_drop_icon" />
                    </div>
                </Popover> */}

                <p className="display_name hide_display_name">{name}</p>
                <Popover
                    isOpen={isPopoverOpen}
                    position={['bottom']}
                    onClickOutside={() => this.setState({ isPopoverOpen: false })}
                    content={(
                        <div
                            style={{ backgroundColor: 'white', position: 'fixed', top: '70px', right: '20px', boxShadow: '0 0 6px rgba(25, 25, 34, .16)', padding: '10px 0', minWidth: '120px' }}
                        >
                            <p className="show_display_name">Signed in as <span>{name}</span></p>
                            {localStorage.account === 'local' ? <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }} className="logout_holder">
                                <Link to={`/changepassword?redirect_link=${location.pathname.slice(1)}`} style={{ textDecoration: 'none', color: 'black' }}><p className="turn_red">Change Password</p></Link>
                            </div> : ''}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }} className="logout_holder">
                                {/* <IoIosArrowRoundForward className="back_arrow" /> */}
                                {/* <button className="logout_button" id={logout ? 'logout_button' : ''} disabled={logout} onClick={this.logout}>{logout ? "Signing Out" : "Sign Out"}</button> */}
                                <p className="logout_text" onClick={this.logout}>{logout ? "Signing Out" : "Sign Out"}</p>
                            </div>
                        </div>
                    )}
                >
                    <div onClick={() => this.setState({ isPopoverOpen: !isPopoverOpen })} className="popup_drop">
                        <IoMdArrowDropdown className="pop_drop_icon" />
                    </div>
                </Popover>
            </div>
        )
    }
}

export default connect()(LibraryNav)

