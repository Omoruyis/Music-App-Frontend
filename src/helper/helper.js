const time = (seconds) => {
    const hours = Math.floor(seconds / (60 * 60))
    const remainingSeconds = seconds % (60 * 60)
    const minutes = Math.floor(remainingSeconds / 60)
    // const secs = minutes % 60
    return `${hours} hrs ${minutes} mins`
}

const trackTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes < 10 ? 0 : ''}${minutes}:${secs < 10 ? 0 : ''}${secs}`
}

const trimString = (str, length) => {
    if (str.length > length) {
        const res = str.slice(0, length - 1);
        return `${res}...`
    }
    return str
}

export {
    time, 
    trackTime, 
    trimString
}