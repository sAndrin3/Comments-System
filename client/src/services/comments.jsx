import {makeRequest} from "./makeRequest.jsx";

export function createComment({ postId, message, parentId }) {
    return makeRequest(`posts/${postId}/comments`, {
        method: 'POST',
        data: {message, parentId},
    })
}
