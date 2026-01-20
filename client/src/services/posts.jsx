import {makeRequest} from "./makeRequest.jsx";

export function getPosts() {
    return makeRequest("/posts")
}

export function getPost(id) {
    return makeRequest(`/posts/${id}`)
}
