import React, { useState, useEffect } from "react";
import axios from "axios";
import { MessageCircle, Trash2, Edit } from "lucide-react";
import "./comments.css";

const MovieComments = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get("http://localhost:8800/api/comments", {
        headers: { token },
      });
      const movieComments = response.data.filter(
        (comment) => comment.movie === movieId
      );
      setComments(movieComments);
    } catch (err) {
      setError("Failed to load comments");
      console.error("Error fetching comments:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:8800/api/comments",
        {
          user: userId,
          movie: movieId,
          content: newComment.trim(),
        },
        {
          headers: { token },
        }
      );
      setNewComment("");
      await fetchComments();
    } catch (err) {
      setError("Failed to post comment");
      console.error("Error posting comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    try {
      setError(null);
      const response = await axios.delete(
        `http://localhost:8800/api/comments/${commentId}`,
        {
          data: { user: userId },
          headers: { token },
        }
      );
      if (response.status === 200) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (err) {
      setError("Failed to delete comment");
      console.error("Error deleting comment:", err);
    }
  };

  const handleEdit = async (commentId) => {
    if (editingId === commentId) {
      if (editContent.trim().length < 5) {
        setError("Comment must be at least 5 characters long");
        return;
      }
      try {
        setError(null);
        await axios.put(
          `http://localhost:8800/api/comments/${commentId}`,
          { content: editContent.trim() },
          { headers: { token } }
        );
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? { ...comment, content: editContent.trim() }
              : comment
          )
        );
        setEditingId(null);
        setEditContent("");
      } catch (err) {
        setError("Failed to update comment");
        console.error("Error updating comment:", err);
      }
    } else {
      const comment = comments.find((c) => c._id === commentId);
      setEditContent(comment.content);
      setEditingId(commentId);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
    setError(null);
  };

  return (
    <div className="movie-comments">
      <h3 className="comments-title">
        <MessageCircle className="icon" />
        Comments ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment...  (5-100 characters)"
          maxLength="100"
          minLength="5"
        />
        <button
          type="submit"
          disabled={loading || newComment.trim().length < 5}
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              {editingId === comment._id ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="edit-textarea"
                  maxLength={100}
                />
              ) : (
                <p className="comment-content">{comment.content}</p>
              )}

              {comment.user === userId && (
                <div className="comment-actions">
                  {editingId === comment._id ? (
                    <>
                      <button
                        onClick={() => handleEdit(comment._id)}
                        className="save-btn"
                        disabled={editContent.trim().length < 5}
                      >
                        Save
                      </button>
                      <button onClick={cancelEdit} className="cancel-btn">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(comment._id)}
                        className="edit-btn"
                        title="Edit comment"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="delete-btn"
                        title="Delete comment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MovieComments;
