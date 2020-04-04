import {
    LOGIN,
    LOGOUT,
    ALL_ALBUMS,
    ALL_TRACKS,
    ALL_PLAYLISTS,
    ALL_LIKES,
    DELETE_LIKE,
    ADD_LIKE, 
    DELETE_TRACK,
    ADD_TRACK,
    CREATE_PLAYLIST,
    DELETE_PLAYLIST,
    DELETE_FROM_PLAYLIST,
    DELETE_PERSONAL_PLAYLIST,
    EDIT_PLAYLIST
} from '../actions'

import axios from 'axios'
import config from '../config/config'


function rootReducer (state = { loggedIn: false}, action) {
    const { albums, playlists, likes, category, data, tracks, albumId, trackId, title, description, id, _id } = action
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
            axios.post(`${config().url}/likeUndownload`, { type: data.information.type, data: {...data.information, album: {id: data.albumId, title: data.albumTitle, picture: data.cover, type: 'album'}} }, config().headers)
            return {
                ...state,
                likes: {
                    ...state.likes,
                    [category]: [...state.likes[category], {...data, information: {...data.information, album: {id: data.albumId, title: data.albumTitle, picture: data.cover }}}]
                }
            }
        case DELETE_TRACK:
            axios.post(`${config().url}/removeAlbPlayTrack`, { id: albumId, trackId }, config().headers)
            return {
                ...state,
                tracks: state.tracks.filter(cur => cur.information.id !== trackId)
            }
        case ADD_TRACK:
            axios.post(`${config().url}/addAlbPlayTrack`, { type: 'track', id: data.information.album.id, trackId: data.information.id }, config().headers)
            return {
                ...state,
                tracks: [...state.tracks, {...data, albumTitle: data.information.album.title, albumId: data.information.album.id, cover: data.information.album.picture ? data.information.album.picture : data.information.album.cover, createdAt:  new Date().getTime() }]
            }
        case CREATE_PLAYLIST:
            axios.post(`${config().url}/createplaylist`, { title, description }, config().headers)
            return {
                ...state,
                playlists: [...state.playlists, {information: { title, description, tracks: { data: [] } }, personal: true, createdAt: new Date().getTime() }]
            }
        case DELETE_PLAYLIST:
            axios.post(`${config().url}/delete`, { id, type: 'playlist' }, config().headers)
            return {
                ...state,
                playlists: state.playlists.filter(cur => cur.information.id !== id)
            }
        case DELETE_FROM_PLAYLIST:
            axios.post(`${config().url}/deletefromplaylist`, { id, title }, config().headers)
            const updated = state.playlists.findIndex(cur => cur.personal === true && cur.information.title === title)
            const newPlaylist = state.playlists
            const newArray = state.playlists[updated].information.tracks.data.filter(track => track.id !== id)
            newPlaylist[updated].information.tracks.data = newArray
            return {
                ...state,
                playlists: [...newPlaylist]
            }
        case DELETE_PERSONAL_PLAYLIST:
            axios.post(`${config().url}/deleteplaylist`, { _id }, config().headers)
            return {
                ...state,
                playlists: state.playlists.filter(cur => cur._id !== _id)
            }
        case EDIT_PLAYLIST:
            axios.patch(`${config().url}/editplaylist`, { _id, title, description }, config().headers)
            const index = state.playlists.findIndex(cur => cur.personal === true && cur._id === _id)
            let latestPlaylist = state.playlists
            latestPlaylist[index].information.title = title
            latestPlaylist[index].information.description = description
            return {
                ...state,
                playlists: [...latestPlaylist]
            }
        default:
            return state
    }
}

export default rootReducer