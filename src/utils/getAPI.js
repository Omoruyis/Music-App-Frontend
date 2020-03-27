import axios from 'axios'
import config from '../config/config'


const getAlbums = async () => {
    const result = await axios.get(`${config().url}/allalbums`, config().headers)
    return result.data
}

const getTracks = async () => {
    const result = await axios.get(`${config().url}/alltracks`, config().headers)
    return result.data
}

const getPlaylists = async () => {
    const result = await axios.get(`${config().url}/allplaylists`, config().headers)
    return result.data
}

const getLikes = async () => {
    const result = await axios.get(`${config().url}/getlikes`, config().headers)
    return result.data
}

export {
    getAlbums, 
    getTracks,
    getPlaylists,
    getLikes
}