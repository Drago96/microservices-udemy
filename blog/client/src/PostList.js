import { useEffect, useState } from "react";
import axios from "axios";

import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = () => {
  const [posts, setPosts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axios.get("http://localhost:4000/posts");

      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <>
      <h1>Posts</h1>
      <div className="d-flex flex-row flex-wrap justify-content-between">
        {Object.values(posts).map((post) => (
          <div
            className="card"
            style={{ width: "30%", marginBottom: "20px" }}
            key={post.id}
          >
            <div className="card-body">
              <h3>{post.title}</h3>
              <CommentList postId={post.id} />
              <CommentCreate postId={post.id} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PostList;
