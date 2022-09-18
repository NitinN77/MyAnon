import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");

  const getMe = async () => {
    axios
      .get("http://localhost:3000/user/getcurrent")
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const handleLogOut = async () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleCreatePost = async (e) => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Not logged in!");
      return;
    }
    axios
      .post("http://localhost:3000/post/create", {
        title: formTitle,
        body: formBody,
        authorId: user._id,
      })
      .then( _ => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/post/getall")
      .then((res) => setPosts(res.data))
      .catch((err) => {
        console.log(err);
        if (err) setPosts([]);
      });
  }, []);

  return (
    <div>
      <h1>Feed</h1>
      <div className="main">
        <div>
          <ul>
            {posts &&
              posts.map((post) => (
                <li key={post._id}>
                  {post.title} [{post.body}] by {post.author.username}
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h2>Create a Post</h2>
          <form className="createPostForm" onSubmit={handleCreatePost}>
            <p>Title</p>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="formLabel"
            />
            <p>Body</p>
            <textarea
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
              cols="48"
            />
            <br /> <br />
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feed;
