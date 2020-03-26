import {
    ALL_ALBUMS,
    ALL_PLAYLISTS,
    ALL_LIKES,
} from '../actions'
import { combineReducers } from 'redux'
import { getPlaylists, getAlbums, getLikes } from '../utils/getAPI'

import axios from 'axios'
import config from '../config/config'


function rootReducer (state = {}, action) {
    const { albums, playlists, likes } = action
    switch (action.type) {
        case ALL_ALBUMS:
            return {
                ...state,
                albums
            }
        case ALL_PLAYLISTS:
            return {
                ...state,
                playlists
            }
        case ALL_LIKES:
            return {
                ...state,
                likes
            }
        default:
            return state
    }
}

export default rootReducer