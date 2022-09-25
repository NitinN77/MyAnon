import React from "react";
import { BoltIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { classNames } from "../../util/tailwindhelper";
import { dateFormatter } from "../../util/datetimehelper";
import { useNavigate } from "react-router-dom";

const FeedPost = ({ post }) => {
  let navigate = useNavigate();
  return (
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
          <div className="inline-flex float-right">
            <p
              className={classNames(
                post.plusOnes.length - post.minusOnes.length > 0
                  ? "text-indigo-600"
                  : "",
                "inline-flex"
              )}
            >
              {post.plusOnes.length - post.minusOnes.length}
              <BoltIcon className="ml-[0.15rem] mt-[0.15rem] h-4 w-4" />
            </p>
            <p className="inline-flex">
            <span className="ml-2 mr-[0.15rem]">0</span>
            <ChatBubbleLeftRightIcon className="ml-[0.15rem] mt-[0.15rem] h-4 w-4" />
            </p>
          </div>
          <br />
          <time>{dateFormatter(post.createdAt)}</time>
        </div>
      </div>
      <div className="mt-1">
        <p className="line-clamp-2 text-sm text-gray-600">{post.body}</p>
      </div>
    </li>
  );
};

export default FeedPost;
