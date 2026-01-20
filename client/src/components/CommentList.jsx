import {Comment} from "./Comment.jsx";

export function CommentList({comments}) {
    return comments.map(comment => (
        <div key={comment.id} className="comment-stack">
            <Comment {...comment} />
        </div>
    ))
}
