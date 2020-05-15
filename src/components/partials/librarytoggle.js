import React, { Component } from 'react';

import '../../App.css';

class LibraryToggle extends Component {
    toggle = (e) => {
        document.querySelector('.sidebar_container').classList.toggle('active')
    }


    render() {
        return (
            <div className='toggle-btn' onClick={this.toggle} id="show_hamburger">
                <span className='line-1 rot'></span>
                <span className='line-2 rot'></span>
                <span className='line-3 '></span>
            </div>
        )
    }
}


export default LibraryToggle

