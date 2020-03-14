export const CHANGE_ARTIST = 'CHANGE_ARTIST'
export const CHANGE_ALBUM = 'CHANGE_ALBUM'
export const CHANGE_PLAYLIST = 'CHANGE_PLAYLIST'
export const CHANGE_TRACK = 'CHANGE_TRACK'

export function changeArtist ({ id }) {
    return {
        type: CHANGE_ARTIST, 
        id
    }
}

export function changeAlbum ({ id }) {
    return {
        type: CHANGE_ALBUM,
        id 
    }
}

export function changePlaylist ({ id }) {
    return {
        type: CHANGE_PLAYLIST,
        id 
    }
}

export function changeTrack ({ id }) {
    return {
        type: CHANGE_TRACK,
        id 
    }
}