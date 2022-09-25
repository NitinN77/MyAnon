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
        <div className="lg:flex items-start block">
          <div className="w-full lg:w-4/6 ">
            <h1 className="text-3xl">{detailPost.title}</h1>
            <br />
            {detailPost.body}
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
      ) : (
        <div>Loading...</div>
      )}{" "}
    </div>
  );
};

export default PostDetail;
