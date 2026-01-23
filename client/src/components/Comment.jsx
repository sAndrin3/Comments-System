import { IconBtn} from "./IconBtn.jsx";
import {FaEdit, FaHeart, FaRegHeart, FaReply, FaTrash} from 'react-icons/fa'
import {usePost} from "../contexts/PostContext.jsx";
import {CommentList} from "./CommentList.jsx";
import {useState} from "react";
import {CommentForm} from "./CommentForm.jsx";
import {createComment, deleteComment, updateComment, toggleLikeComment} from "../services/comments.jsx";
import {useAsyncFn} from "../hooks/useAsync.jsx";
import {useUser} from "../hooks/useUser.jsx";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
})

export function Comment({ id, message, user, createdAt, likeCount, likedByMe }) {
    const [areChildrenHidden, setAreChildrenHidden] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { post, getReplies, createLocalComment, updateLocalComment, deleteLocalComment, toggleLocalCommentLike } = usePost()
    const createCommentFn = useAsyncFn(createComment)
    const updateCommentFn = useAsyncFn(updateComment)
    const deleteCommentFn = useAsyncFn(deleteComment)
    const toggleCommentLikeFn = useAsyncFn(toggleLikeComment)
    const childComments = getReplies(id)
    const currentUser = useUser()

    console.log(currentUser)
    console.log("Comparison Check:", {
        commentAuthorId: user.id,
        currentUserId: currentUser.id,
        isMatch: user.id === currentUser.id
    })
    console.log("CURRENT USER", currentUser)
    console.log("COMMENT USER", user)

    function onCommentReply(message) {
        return createCommentFn
            .execute({ postId: post.id, message, parentId: id })
            .then(comment => {
                setIsReplying(false)
                createLocalComment(comment)
            })
    }

    function onCommentUpdate(message) {
        return updateCommentFn
            .execute({ postId: post.id, message, id })
            .then(comment => {
                setIsEditing(false)
                updateLocalComment(id, comment.message)
            })
    }

    function onCommentDelete() {
        return deleteCommentFn
            .execute({ postId: post.id, id })
            .then(() => deleteLocalComment(id))
    }

    function onToggleCommentLike() {
        return toggleCommentLikeFn
            .execute({id, postId: post.id})
            .then(({ addLike }) => toggleLocalCommentLike(id, addLike))
    }

    return (
        <>
            <div className="comment">
                <div className="header">
                    <span className="name">{user.name}</span>
                    <span className="date">{dateFormatter.format(Date.parse(createdAt))}</span>
                </div>
                {isEditing ? (
                    <CommentForm
                        autoFocus
                        initialValue={message}
                        onSubmit={onCommentUpdate}
                        loading={updateCommentFn.loading}
                        error={updateCommentFn.error}
                    />
                ) : (
                    <div className="message">{message}</div>
                )}
                <div className="footer">
                    <IconBtn
                        onClick={onToggleCommentLike}
                        disabled={toggleCommentLikeFn.loading}
                        Icon={likedByMe ? FaHeart : FaRegHeart}
                        aria-label={likedByMe ? "Unlike" : "Like"}
                    >
                        {likeCount}
                    </IconBtn>

                    <IconBtn
                        onClick={() => setIsReplying(prev => !prev)}
                        isActive={isReplying}
                        Icon={FaReply}
                        aria-label={isReplying ? "Cancel Reply" : "Reply"}
                    />

                    { user.id !== currentUser.id  && (
                        <>
                            <IconBtn
                                onClick={() => setIsEditing(prev => !prev)}
                                isActive={isEditing}
                                Icon={FaEdit}
                                aria-label={ isEditing ? "Cancel Edit" : "Edit" }
                            />

                            <IconBtn
                                disabled={deleteCommentFn.loading}
                                onClick={onCommentDelete}
                                Icon={FaTrash}
                                aria-label="Delete"
                                color="danger"
                            />
                        </>
                    )}

                </div>
                {deleteCommentFn.error && (
                    <div className="error-msg mt-1">{deleteCommentFn.error}</div>
                )}
            </div>
            {isReplying && (
                <div className="mt-1 ml-3">
                    <CommentForm
                        autoFocus
                        onSubmit={onCommentReply}
                        loading={createCommentFn.loading}
                        error={createCommentFn.error} />
                </div>
            )}
            {childComments?.length > 0 && (
                <>
                    <div className={`nested-comments-stack ${
                        areChildrenHidden ? "hide" : ""
                    }`}
                    >
                        <button className="collapse-line" aria-label="Hide Replies"
                                onClick={() => setAreChildrenHidden(true)}
                        />
                        <div className="nested-comments">
                            <CommentList comments={childComments} />
                        </div>
                    </div>
                    <button className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
                            onClick={() => setAreChildrenHidden(false)}
                    >
                        Show Replies
                    </button>
                </>
            )}
        </>
    )
}
