import { getPlaylists, getAlbums, getLikes } from '../utils/getAPI'

export const ALL_ALBUMS = 'ALL_ALBUMS'
export const ALL_PLAYLISTS = 'ALL_PLAYLISTS'
export const ALL_LIKES = 'ALL_LIKES'

export function getMyAlbums (albums) {
    return {
        type: ALL_ALBUMS, 
        albums
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

// export function changeTrack ({ id }) {
//     return {
//         type: CHANGE_TRACK,
//         id 
//     }
// }




export const getAllAlbums = () => dispatch => (
    getAlbums()
        .then(albums => {
            dispatch(getMyAlbums(albums))
            console.log('nope')
        })
)

export const getAllPlaylists = () => dispatch => (
    getPlaylists()
        .then(playlists => {
            dispatch(getMyPlaylists(playlists))
            console.log('yep')
        })
)

export const getAllLikes = () => dispatch => (
    getLikes()
        .then(likes => {
            dispatch(getMyLikes(likes))
            console.log('see')
        })
)