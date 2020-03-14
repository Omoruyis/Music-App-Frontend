import React, { Component } from 'react';
import { IconContext } from "react-icons";
import { MdCancel } from "react-icons/md";

import '../App.css';

class ExploreNav extends Component {
    state = {
        inputValue: false
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
        const { inputValue } = this.state
        return (
            <div className="explorenav_container">
                <div className="explorenav_search">
                    <input placeholder="search" className="explorenav_search_input" ref={el => this.search = el} onChange={this.checkInput} />
                    {inputValue ? 
                        <IconContext.Provider value={{ size: '2em', className: "explorenav_cancel_search" }}>
                            <MdCancel onClick={this.clearSearch}/>
                        </IconContext.Provider> : ''}
                </div>
                <div className="explorenav_buttons">
                    <button className="explorenav_login">Login</button>
                    <button className="explorenav_signup">Sign up</button>
                </div>
            </div>
        )
    }
}

export default ExploreNav

