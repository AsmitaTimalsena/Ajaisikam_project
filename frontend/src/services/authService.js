import axios from 'axios'

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
})

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  // don't attach token for login/register
  if (
    token &&
    !req.url.includes("login/") &&
    !req.url.includes("register/")
  ) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ---------- Auth APIs ----------
export const registerUser = (data) => API.post('register/', data)

export const loginUser = (data) => API.post('login/', data)

export const logoutUser = (data) => API.post('logout/', data)

// ---------- Seeker Profile APIs ----------
export const getSeekerProfile = () => API.get('seeker/profile/')
export const updateSeekerProfile = (data) => API.put('seeker/profile/', data)

// ---------- Seeker Posts APIs ----------
export const getSeekerPosts = () => API.get('seeker/posts/')
export const createSeekerPost = (data) => API.post('seeker/posts/', data)
export const updateSeekerPost = (id, data) => API.put(`seeker/posts/${id}/`, data)
export const deleteSeekerPost = (id) => API.delete(`seeker/posts/${id}/`)


//-------------------Mentor Profile APIs--------------
// Mentor Profile
export const getMentorProfile = () => API.get("mentor/profile/")
export const updateMentorProfile = (data) => API.put("mentor/profile/", data)

// Replies
export const getRecommendedPosts = () => API.get("mentor/posts/")
export const createReply = (postId, data) =>API.post(`mentor/posts/${postId}/replies/`, data)

export const updateReply = (id, data) => API.put(`mentor/replies/${id}/`, data)

export const deleteReply = (id) =>API.delete(`mentor/replies/${id}/`)

//to see replies
export const getMyReplies = () =>API.get("mentor/replies/")






export default API

