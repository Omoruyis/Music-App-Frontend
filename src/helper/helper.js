const time = (seconds) => {
    const hours = Math.floor(seconds / (60 * 60))
    const remainingSeconds = seconds % (60 * 60)
    const minutes = Math.floor(remainingSeconds / 60)
    // const secs = minutes % 60
    return `${hours} hrs ${minutes} mins`
}

export default time