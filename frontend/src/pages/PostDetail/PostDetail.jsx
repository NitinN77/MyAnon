import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Cookies from "universal-cookie";
import { BoltIcon, BoltSlashIcon } from "@heroicons/react/24/solid";
import { classNames } from "../../util/tailwindhelper";
import DetailComment from "../../components/DetailComment/DetailComment";
import { dateFormatter } from "../../util/datetimehelper";

const PostDetail = () => {
  const { postId } = useParams();
  const cookies = new Cookies();
  const queryClient = useQueryClient();
  const [newComment, setNewCommment] = useState("");
  const {
    isLoading,
    isError,
    data: detailPost,
  } = useQuery(["singlePost", postId], () => {
    return axios
      .post("http://localhost:3000/post/getone", {
        postId,
      })
      .then((res) => res.data);
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

  const handleNewComment = () => {
    const user = cookies.get("user");
    if (!user) {
      alert("Not logged in!");
      return;
    }
    return axios.post("http://localhost:3000/comment/create", {
      postId,
      userId: user._id,
      body: newComment,
    });
  };

  const newCommentMutation = useMutation(handleNewComment, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      queryClient.invalidateQueries("singlePost");
      setNewCommment("");
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{isError}</div>;
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
              <div className="inline-flex float-right">
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
              </div>
              {detailPost.author.username}
              <br />
              {dateFormatter(detailPost.createdAt)}
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
                  value={newComment}
                  onChange={(e) => {
                    setNewCommment(e.target.value);
                  }}
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
                  <div className="flex"></div>
                  <div className="flex-shrink-0">
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        newCommentMutation.mutate();
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <ul className="mt-2">
              {detailPost.comments
                .sort((a, b) => (a.createdAt < b.createdAt ? 1 : 0))
                .map((comment) => (
                  <DetailComment key={comment._id} comment={comment} />
                ))}
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
