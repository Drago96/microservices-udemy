const CommentList = ({ comments }) => (
  <ul>
    {comments.map((comment) => (
      <li key={comment.id}>{comment.content}</li>
    ))}
  </ul>
);

export default CommentList;
