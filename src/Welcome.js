import React from 'react'
import './Welcome.css'
import logo from './wechat-black.svg';

function Welcome() {
    return (
        <div className='welcome'>
            <div className='welcome_container'>
                <img src = {logo} alt=''/>
                <h1>Welcome to Chat Rooms</h1>
            </div>
        </div>
    )
}

export default Welcome
