import { getPlaylists, getTracks, getAlbums, getLikes } from '../utils/getAPI'

export const ALL_ALBUMS = 'ALL_ALBUMS'
export const ALL_TRACKS = 'ALL_TRACKS'
export const ALL_PLAYLISTS = 'ALL_PLAYLISTS'
export const ALL_LIKES = 'ALL_LIKES'
export const DELETE_LIKE = 'DELETE_LIKE'
export const ADD_LIKE = 'ADD_LIKE'
export const DELETE_TRACK = 'DELETE_TRACK'

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

export function getMyLikes (likes) {
    return {
        type: ALL_LIKES,
        likes
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

export const getAllLikes = () => dispatch => (
    getLikes()
        .then(likes => {
            dispatch(getMyLikes(likes))
        })
)