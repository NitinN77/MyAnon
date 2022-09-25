import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BoltIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { dateFormatter } from "../../util/datetimehelper";
import Cookies from "universal-cookie";

import { classNames } from "../../util/tailwindhelper";

const Feed = () => {
  const cookies = new Cookies();
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

  const createPost = () => {
    const user = cookies.get("user");
    if (!user) {
      alert("Not logged in!");
      return;
    }
    return axios.post("http://localhost:3000/post/create", {
      title: formTitle,
      body: formBody,
      authorId: user._id,
    });
  };
  const postMutation = useMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });

  return (
    <div>
      <div className="w-full lg:w-3/6">
        <div className="m-2">
          <form action="#" className="relative">
            <div className="border border-gray-300 pl-4 rounded-lg shadow-sm overflow-hidden ">
              <label htmlFor="title" className="sr-only">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="block w-full border-0 pt-2.5 text-lg font-medium placeholder-gray-500 focus:outline-none"
                placeholder="Title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
              <label htmlFor="description" className="sr-only">
                Description
              </label>
              <textarea
                rows={4}
                name="description"
                id="description"
                className="block w-full border-0 py-0 pr-2 resize-none placeholder-gray-500 focus:outline-none sm:text-sm"
                placeholder="Write a description..."
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
              />

              {/* Spacer element to match the height of the toolbar */}
              <div aria-hidden="true">
                <div className="h-px" />
                <div className="py-2">
                  <div className="py-px">
                    <div className="h-9" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-px">
              {/* Actions: These are just examples to demonstrate the concept, replace/wire these up however makes sense for your project. */}

              <div className="border-t border-gray-200 px-2 py-2 flex justify-between items-center space-x-3 sm:px-3">
                <div className="flex">
                  <button
                    type="button"
                    className="-ml-2 -my-2 rounded-full px-3 py-2 inline-flex items-center text-left text-gray-400 group"
                  >
                    <Cog6ToothIcon
                      className="-ml-1 h-5 w-5 mt-[0.1rem] mr-2 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-gray-500 group-hover:text-gray-600 italic">
                      Advanced Creation
                    </span>
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      postMutation.mutate();
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </form>
          <ul role="list" className="divide-y mt-2 divide-gray-200">
            {isLoading ? (
              <div>Loading... </div>
            ) : (
              posts.map((post) => (
                <li
                  key={post._id}
                  className="relative bg-white py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset"
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
                    <div
                      dateTime={post.createdAt}
                      className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                    >
                      <p
                        className={classNames(
                          post.plusOnes.length - post.minusOnes.length > 0 ? "text-indigo-600" : "",
                          "inline-flex float-right"
                        )}
                      >
                        {post.plusOnes.length - post.minusOnes.length}
                        <BoltIcon className="ml-[0.15rem] mt-[0.15rem] h-4 w-4" />
                      </p>
                      <br />
                      <time>{dateFormatter(post.createdAt)}</time>
                    </div>
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
        <div></div>
      </div>
    </div>
  );
};

export default Feed;
