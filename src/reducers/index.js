import {
    LOGIN,
    LOGOUT,
    ALL_ALBUMS,
    ALL_TRACKS,
    ALL_PLAYLISTS,
    ALL_RECENT,
    ALL_LIKES,
    ALL_ARTISTS,
    DELETE_LIKE,
    ADD_LIKE, 
    DELETE_TRACK,
    ADD_TRACK,
    CREATE_PLAYLIST,
    DELETE,
    DELETE_FROM_PLAYLIST,
    DELETE_TRACK_FROM_ALBUM,
    DELETE_EMPTY_ALBUM,
    DELETE_PERSONAL_PLAYLIST,
    EDIT_PLAYLIST,
    CHANGE_SONG, 
} from '../actions'

import axios from 'axios'
import config from '../config/config'


function rootReducer (state = { loggedIn: false, deezerType: '', deezerId: '' }, action) {
    const { albums, playlists, recent, likes, artists, category, data, tracks, albumId, trackId, title, description, id, _id, deezerId, deezerType, profile } = action
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
        case ALL_RECENT:
            return {
                ...state,
                recent
            }
        case ALL_LIKES:
            return {
                ...state,
                likes
            }
        case ALL_ARTISTS:
            return {
                ...state,
                artists
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
            return {
                ...state,
                playlists: [...state.playlists, {information: { title, description, tracks: { data: [] } }, personal: true, createdAt: new Date().getTime() }]
            }
        case DELETE:
            axios.post(`${config().url}/delete`, { id, type: category === 'playlists' ? 'playlist' : 'album' }, config().headers)
            return {
                ...state,
                [category]: state[category].filter(cur => cur.information.id !== id)
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
        case DELETE_TRACK_FROM_ALBUM:
            axios.post(`${config().url}/removeAlbPlayTrack`, { id: albumId, trackId }, config().headers)
            const albumIndex = state.albums.findIndex(cur => cur.information.id === albumId)
            let newAlbum = state.albums
            const newAlbumArray = state.albums[albumIndex].information.tracks.data.filter(track => track.id !== trackId)
            newAlbum[albumIndex].information.tracks.data = newAlbumArray
            return {
                ...state,
                albums: [...newAlbum]
            }
        case DELETE_EMPTY_ALBUM:
            const emptyAlbumIndex = state.albums.findIndex(cur => cur.information.id === albumId)
            let newEmptyAlbum = state.albums
            newEmptyAlbum.splice(emptyAlbumIndex, 1)
            console.log('djdjdjdjdjdjdjdjdjdj')
            return {
                ...state,
                albums: [...newEmptyAlbum]
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
        case CHANGE_SONG:
            return {
                ...state,
                deezerId,
                deezerType
            }
        default:
            return state
    }
}

export default rootReducer