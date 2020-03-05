// const url = 'http://localhost:8080'
const url = 'https://omoruyi-music-store-app.herokuapp.com'

let token 
let config 

if (!token) {
    config = {
        url,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    }
} else {
    config = {
        url,
        headers: {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTU3YjRhYWZlN2ZiZDc4MzBkY2VlYmUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTgyODA2MTg4fQ._mKRL6RGyQEvkphLZk3o8HZPxnEGJfIceZCas3frssM',
                take: 'skskks',
                Accept: 'application/json'
            }
        }
    }
}




export default config

