const url = 'http://localhost:8080'
// const url = 'https://omoruyi-music-store-app.herokuapp.com'

// let token 
let config 
// token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTY4YjViNjJmZTQwZTMwMTBjYTFkMTIiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTgzOTIwNTY2fQ.ZsE5uI-JNYlmWF3vP6oYcGwHcgHfzqRgZ50OVG3ByRU"

// if (!token) {
//     config = {
//         url,
//         headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json'
//         }
//     }
// } else {
    config = {
        url,
        headers: {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTY4YjViNjJmZTQwZTMwMTBjYTFkMTIiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTgzOTIwNTY2fQ.ZsE5uI-JNYlmWF3vP6oYcGwHcgHfzqRgZ50OVG3ByRU'
            }
        }
    }
// }




export default config

