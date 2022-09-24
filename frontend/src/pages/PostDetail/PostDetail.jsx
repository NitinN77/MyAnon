import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Cookies from "universal-cookie";

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
    <div className="m-2">
      {detailPost ? (
        <div>
          {detailPost.title}
          <br />
          {detailPost.body}
          <br />
          <br />
          Score: {detailPost.plusOnes.length - detailPost.minusOnes.length}
          <br />
          <br />
          <button
            onClick={(e) => {
              e.preventDefault();
              plusOneMutation.mutate();
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            +1
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              minusOneMutation.mutate();
            }}
            className="inline-flex items-center px-4 py-2 ml-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            -1
          </button>
        </div>
      ) : (
        <div>Loading...</div>
      )}{" "}
    </div>
  );
};

export default PostDetail;
