import React from "react";
import { dateFormatter } from "../../util/datetimehelper";


const DetailComment = ({ comment }) => {
  return (
    <li
      key={comment._id}
      className="relative bg-white py-5 px-4 hover:bg-gray-100"
    >
      <div className="flex justify-between lg:space-x-80">
        <div className="min-w-0 flex-1">
          <div className="block focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-900 truncate">
              {comment.author.username}
            </p>
          </div>
        </div>
        <div
          dateTime={comment.createdAt}
          className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
        >
          <br />
          <time>{dateFormatter(comment.createdAt)}</time>
        </div>
      </div>
      <div className="mt-1">
        <p className="line-clamp-2 text-sm text-gray-600">{comment.body}</p>
      </div>
    </li>
  );
};

export default DetailComment;
