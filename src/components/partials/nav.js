import React, { Component } from 'react';
import { IconContext } from "react-icons";
import { MdCancel } from "react-icons/md";

import '../../App.css';

class Nav extends Component {
    state = {
        inputValue: false,
        name: localStorage.name
    }

    checkInput = () => {
        if (this.search.value) {
            this.setState({
                inputValue: true
            })
        } else {
            this.setState({
                inputValue: false
            })
        }
    }

    clearSearch = () => {
        this.search.value = ''
        this.checkInput()
    }


    render() {
        const { inputValue, name } = this.state
        return (
            <div className="explorenav_container">
                <div className="explorenav_search">
                    <input type="search" placeholder="Search" className="explorenav_search_input" ref={el => this.search = el} onChange={this.checkInput} />
                    {inputValue ?
                        <IconContext.Provider value={{ size: '2em', className: "explorenav_cancel_search" }}>
                            <MdCancel onClick={this.clearSearch} />
                        </IconContext.Provider> : ''}
                </div>

                {name ?
                    <div className="explorenav_buttons">
                        <p className="display_name">{name}</p>
                    </div> :
                    <div className="explorenav_buttons">
                        <button className="explorenav_login">Login</button>
                        <button className="explorenav_signup">Sign up</button>
                    </div>
                }

            </div>
        )
    }
}

export default Nav

