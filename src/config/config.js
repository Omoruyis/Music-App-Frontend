const url = 'http://localhost:8080'
// const url = 'https://omoruyi-music-store-app.herokuapp.com'

function config () {
    let token 
    if (localStorage.token) {
        token = localStorage.token
    }

    if (!token) {
        return {
            url,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    } else {
        return {
            url,
            headers: {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    authorization: `Bearer ${token}`
                }
            }
        }
    }
}

export default config

