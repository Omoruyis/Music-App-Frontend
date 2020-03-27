import {
    LOGIN,
    LOGOUT,
    ALL_ALBUMS,
    ALL_TRACKS,
    ALL_PLAYLISTS,
    ALL_LIKES,
    DELETE_LIKE,
    ADD_LIKE, 
    DELETE_TRACK
} from '../actions'
import { combineReducers } from 'redux'
import { getPlaylists, getTracks, getAlbums, getLikes } from '../utils/getAPI'

import axios from 'axios'
import config from '../config/config'


function rootReducer (state = { loggedIn: false}, action) {
    const { albums, playlists, likes, category, data, tracks, albumId, trackId } = action
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                loggedIn: true
            }
        case LOGOUT:
            return {
                ...state,
                loggedIn: false
            }
        case ALL_ALBUMS:
            return {
                ...state,
                albums
            }
        case ALL_TRACKS:
            return {
                ...state,
                tracks
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
        case DELETE_LIKE:
            axios.post(`${config().url}/unlikeUndownload`, { type: data.information.type, data: {id: data.information.id} }, config().headers)
            return {
                ...state,
                likes: {
                    ...state.likes,
                    [category]: state.likes[category].filter(cur => cur.information.id !== data.information.id)
                }
            }
        case ADD_LIKE:
            axios.post(`${config().url}/likeUndownload`, { type: data.information.type, data: {id: data.information.id} }, config().headers)
            return {
                ...state,
                likes: {
                    ...state.likes,
                    [category]: [...state.likes[category], data]
                }
            }
        case DELETE_TRACK:
        axios.post(`${config().url}/removeAlbPlayTrack`, { id: albumId, trackId }, config().headers)
        return {
            ...state,
            tracks: state.tracks.filter(cur => cur.information.id !== trackId)
        }
        default:
            return state
    }
}

export default rootReducer