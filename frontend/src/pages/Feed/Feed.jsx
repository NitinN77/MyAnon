import React from "react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Feed.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { dateFormatter } from "../../util/datetimehelper";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  let navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery("posts", () => {
    axios
      .get("http://localhost:3000/post/getall")
      .then((res) => setPosts(res.data));
  });

  const handleLogOut = async () => {
    localStorage.clear();
    window.location.reload();
  };

  const postMutation = useMutation((_) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Not logged in!");
      return;
    }
    return axios.post("http://localhost:3000/post/create", {
      title: formTitle,
      body: formBody,
      authorId: user._id,
    });
  });

  const postsInvalidate = useMutation(postMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });

  return (
    <div>
      <div className="main">
        <div>
          <ul role="list" className="divide-y divide-gray-200">
            {isLoading ? (
              <div>Loading... </div>
            ) : (
              posts.map((post) => (
                <li
                  key={post._id}
                  className="relative bg-white py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                  onClick={() => {
                    navigate(`/posts/${post._id}`);
                  }}
                >
                  <div className="flex justify-between lg:space-x-80">
                    <div className="min-w-0 flex-1">
                      <a href="#" className="block focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {post.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {post.author.username}
                        </p>
                      </a>
                    </div>
                    <time
                      dateTime={post.createdAt && post.createdAt}
                      className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                    >
                      {post.createdAt && dateFormatter(post.createdAt)}
                    </time>
                  </div>
                  <div className="mt-1">
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {post.body}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div>
          <h2>Create a Post</h2>
          <form className="createPostForm">
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
            <button
              onClick={(e) => {
                e.preventDefault()
                postMutation.mutate();
              }}
            >
              Create
            </button>
          </form>
          {postMutation.isError ? <h2>{postMutation.error.message}</h2> : <></>}
          {postMutation.isLoading ? <h2>Creating your post...</h2> : <></>}
          {postMutation.isSuccess ? <h2>Post created!</h2> : <></>}
        </div>
      </div>
    </div>
  );
};

export default Feed;
