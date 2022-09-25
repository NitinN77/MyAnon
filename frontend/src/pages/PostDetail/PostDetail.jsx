import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Cookies from "universal-cookie";
import { BoltIcon, BoltSlashIcon } from "@heroicons/react/24/solid";
import { classNames } from "../../util/tailwindhelper";

const PostDetail = () => {
  const { postId } = useParams();
  const cookies = new Cookies();
  const queryClient = useQueryClient();
  const [detailPost, setDetailPost] = useState(null);

  const { isLoading, isError, data } = useQuery("singlePost", () => {
    axios
      .post("http://localhost:3000/post/getone", {
        postId,
      })
      .then((post) => {
        setDetailPost(post.data);
      })
      .catch((err) => console.log(err));
  });

  const handlePlusOne = () => {
    const user = cookies.get("user");
    if (!user) {
      alert("Not logged in!");
      return;
    }
    return axios.post("http://localhost:3000/post/plusone", {
      postId,
      userId: user._id,
    });
  };

  const handleMinusOne = () => {
    const user = cookies.get("user");
    if (!user) {
      alert("Not logged in!");
      return;
    }
    return axios.post("http://localhost:3000/post/minusone", {
      postId,
      userId: user._id,
    });
  };

  const plusOneMutation = useMutation(handlePlusOne, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      queryClient.invalidateQueries("singlePost");
    },
  });

  const minusOneMutation = useMutation(handleMinusOne, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      queryClient.invalidateQueries("singlePost");
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="m-3">
      {detailPost ? (
        <div>
          <div className="lg:flex items-start block">
            <div className="w-full lg:w-4/6 ">
              <h1 className="text-3xl">{detailPost.title}</h1>
              <br />
              {detailPost.body}
              <br />
            </div>
            <div className=" w-full lg:w-2/6 mt-2 lg:ml-4 border-2 rounded-md p-4">
              <p className="inline-flex float-right">
                <BoltIcon
                  onClick={(e) => {
                    e.preventDefault();
                    plusOneMutation.mutate();
                  }}
                  className="h-6 w-6 cursor-pointer text-indigo-600 mr-4 hover:bg-indigo-600 hover:text-gray-200 rounded"
                ></BoltIcon>
                <div
                  className={classNames(
                    detailPost.plusOnes.length - detailPost.minusOnes.length > 0
                      ? "text-indigo-600"
                      : "text-gray-600",
                    "inline-flex float-right"
                  )}
                >
                  {detailPost.plusOnes.length - detailPost.minusOnes.length}
                </div>
                <BoltSlashIcon
                  onClick={(e) => {
                    e.preventDefault();
                    minusOneMutation.mutate();
                  }}
                  className="h-6 w-6 cursor-pointer text-gray-600 ml-4 hover:bg-gray-600 hover:text-gray-200 rounded"
                >
                  -1
                </BoltSlashIcon>
              </p>
              {detailPost.author.username}
              <br />
              Lorem ipsum dolor sit.
            </div>
          </div>
          <div className="lg:w-4/6 w-full mt-4">
          <form action="#" className="relative ">
            <div className="border pt-4 border-gray-300 pl-4 rounded-lg shadow-sm overflow-hidden ">
              <label htmlFor="description" className="sr-only">
                Description
              </label>
              <textarea
                rows={4}
                name="description"
                id="description"
                className="block w-full border-0 py-0 pr-2 resize-none placeholder-gray-500 focus:outline-none sm:text-sm"
                placeholder="Write a comment..."
                value={``}
                onChange={(e) => {}}
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
                  ></button>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="submit"
                    onClick={(e) => {}}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </form>
          <ul>
          {
            detailPost.comments.map(comment => <li>{comment.body} {comment.author.username}</li>)
          }
          </ul>
          </div>

        </div>
      ) : (
        <div>Loading...</div>
      )}{" "}
    </div>
  );
};

export default PostDetail;
