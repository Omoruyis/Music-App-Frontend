import { getPlaylists, getTracks, getAlbums, getRecent, getLikes, getArtists } from '../utils/getAPI'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const ALL_ALBUMS = 'ALL_ALBUMS'
export const ALL_TRACKS = 'ALL_TRACKS'
export const ALL_PLAYLISTS = 'ALL_PLAYLISTS'
export const ALL_RECENT = 'ALL_RECENT'
export const ALL_LIKES = 'ALL_LIKES'
export const ALL_ARTISTS = 'ALL_ARTISTS'
export const DELETE_LIKE = 'DELETE_LIKE'
export const ADD_LIKE = 'ADD_LIKE'
export const DELETE_TRACK = 'DELETE_TRACK'
export const ADD_TRACK = 'ADD_TRACK'
export const CREATE_PLAYLIST = 'CREATE_PLAYLIST'
export const DELETE = 'DELETE'
export const DELETE_FROM_PLAYLIST = 'DELETE_FROM_PLAYLIST'
export const DELETE_TRACK_FROM_ALBUM = 'DELETE_TRACK_FROM_ALBUM'
export const DELETE_EMPTY_ALBUM = 'DELETE_EMPTY_ALBUM'
export const DELETE_PERSONAL_PLAYLIST = 'DELETE_PERSONAL_PLAYLIST'
export const EDIT_PLAYLIST = 'EDIT_PLAYLIST'


export function login () {
    return {
        type: LOGIN, 
    }
}

export function logout () {
    return {
        type: LOGOUT, 
    }
}

export function getMyAlbums (albums) {
    return {
        type: ALL_ALBUMS, 
        albums
    }
}

export function getMyTracks (tracks) {
    return {
        type: ALL_TRACKS, 
        tracks
    }
}

export function getMyPlaylists (playlists) {
    return {
        type: ALL_PLAYLISTS,
        playlists 
    }
}

export function getMyRecent (recent) {
    return {
        type: ALL_RECENT,
        recent 
    }
}

export function getMyLikes (likes) {
    return {
        type: ALL_LIKES,
        likes
    }
}

export function getMyArtists (artists) {
    return {
        type: ALL_ARTISTS,
        artists
    }
}

export function deleteLike (category, data) {
    return {
        type: DELETE_LIKE,
        category,
        data
    }
}

export function addLike (category, data) {
    return {
        type: ADD_LIKE,
        category,
        data
    }
}

export function deleteTrack (albumId, trackId) {
    return {
        type: DELETE_TRACK,
        albumId,
        trackId
    }
}

export function addTrack (data) {
    return {
        type: ADD_TRACK,
        data
    }
}

export function createPlaylist (title, description) {
    return {
        type: CREATE_PLAYLIST,
        title, 
        description
    }
}

export function deletePlaylist (id, category) {
    return {
        type: DELETE,
        id, 
        category
    }
}

export function deleteFromPlaylist (id, title) {
    return {
        type: DELETE_FROM_PLAYLIST,
        id,
        title, 
    }
}

export function deleteTrackFromAlbum (albumId, trackId) {
    return {
        type: DELETE_TRACK_FROM_ALBUM,
        albumId,
        trackId
    }
}

export function deleteEmptyAlbum (albumId) {
    return {
        type: DELETE_EMPTY_ALBUM,
        albumId
    }
}

export function deletePersonalPlaylist (_id) {
    return {
        type: DELETE_PERSONAL_PLAYLIST,
        _id
    }
}

export function editPlaylist (_id, title, description) {
    return {
        type: EDIT_PLAYLIST,
        _id,
        title,
        description
    }
}



/******Thunk */

export const getAllAlbums = () => dispatch => (
    getAlbums()
        .then(albums => {
            dispatch(getMyAlbums(albums))
        })
)

export const getAllTracks = () => dispatch => (
    getTracks()
        .then(tracks => {
            dispatch(getMyTracks(tracks))
        })
)

export const getAllPlaylists = () => dispatch => (
    getPlaylists()
        .then(playlists => {
            dispatch(getMyPlaylists(playlists))
        })
)

export const getAllRecent = () => dispatch => (
    getRecent()
        .then(recent => {
            dispatch(getMyRecent(recent))
        })
)

export const getAllLikes = () => dispatch => (
    getLikes()
        .then(likes => {
            dispatch(getMyLikes(likes))
        })
)

export const getAllArtists = () => dispatch => (
    getArtists()
        .then(artists => {
            dispatch(getMyArtists(artists))
        })
)