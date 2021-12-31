const CommentList = ({ comments }) => (
  <ul>
    {comments.map((comment) => (
      <li key={comment.id}>
        {comment.status === "approved" && comment.content}
        {comment.status === "pending" && "This comment is awaiting moderation"}
        {comment.status === "rejected" && "This comment has been rejected"}
      </li>
    ))}
  </ul>
);

export default CommentList;
