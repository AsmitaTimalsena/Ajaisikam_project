import axios from 'axios'

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
})

// attach access token automatically to protected requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('access_token')

  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }

  return req
})

// ---------- Auth APIs ----------
export const registerUser = (data) => API.post('register/', data)

export const loginUser = (data) => API.post('login/', data)

export const logoutUser = (data) => API.post('logout/', data)

export default API