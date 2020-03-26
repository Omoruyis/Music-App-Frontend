import {
    CHANGE_ARTIST,
    CHANGE_ALBUM,
    CHANGE_PLAYLIST,
    CHANGE_TRACK
} from '../actions'
import { combineReducers } from 'redux'
import { getPlaylists, getAlbums, getLikes } from '../utils/getAPI'

import axios from 'axios'
import config from '../config/config'

let using

(async () => {
    const result = await axios.post(`${config().url}/search`, { searchQuery: 'eminem' }, config().headers)
    using = result.data
})()

function reducer (state = {}, action) {
    const { id } = action
    switch (action.type) {
        case CHANGE_ARTIST:
            return {
                ...state,
                artist: id
            }
        case CHANGE_ALBUM:
            return {
                ...state,
                album: id
            }
        case CHANGE_PLAYLIST:
            return {
                ...state,
                playlist: id
            }
        case CHANGE_TRACK:
            return {
                ...state,
                track: id
            }
        default:
            return state
    }
}

export default reducer