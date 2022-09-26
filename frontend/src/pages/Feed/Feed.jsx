import React from "react";
import { useState } from "react";
import axios from "axios";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useMutation, useInfiniteQuery, useQueryClient } from "react-query";
import FeedPost from "../../components/FeedPost/FeedPost";

import Cookies from "universal-cookie";

const Feed = () => {
  const cookies = new Cookies();
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const queryClient = useQueryClient();
  const {
    data: posts,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isLoading
  } = useInfiniteQuery(
    "posts",
    ({ pageParam = 0 }) => {
      return axios
        .get(import.meta.env.VITE_API_URL + "/post/getall?pageNumber=" + pageParam)
        .then((res) => res.data);
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return pages.length + 1
      },
    }
  );

  const createPost = () => {
    const user = cookies.get("user");
    if (!user) {
      alert("Not logged in!");
      return;
    }
    return axios.post(import.meta.env.VITE_API_URL + "/post/create", {
      title: formTitle,
      body: formBody,
      authorId: user._id,
    });
  };
  const postMutation = useMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      setFormBody("");
      setFormTitle("");
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="w-full lg:w-3/6">
        <div className="m-2">
          <form action="#" className="relative mb-2">
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
          {posts.pages.map((group, i) => (
            <ul role="list" className="divide-y divide-gray-200">
              {group.posts.map((post) => (
                <FeedPost post={post} key={post._id} />
              ))}
            </ul>
          ))}
          <div className="flex justify-center mt-2">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
            </button>
          </div>
          <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Feed;
