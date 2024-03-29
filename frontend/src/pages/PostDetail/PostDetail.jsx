import axios from "axios"
import React, { useEffect } from "react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "react-query"
import Cookies from "universal-cookie"
import { BoltIcon, BoltSlashIcon } from "@heroicons/react/24/solid"
import { classNames } from "../../util/tailwindhelper"
import DetailComment from "../../components/DetailComment/DetailComment"
import { dateFormatter } from "../../util/datetimehelper"

const PostDetail = () => {
  const { postId } = useParams()
  const cookies = new Cookies()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [newComment, setNewCommment] = useState("")
  const [editToggle, setEditToggle] = useState(false)
  const [newBody, setNewBody] = useState("")

  const {
    isLoading,
    isError,
    data: detailPost,
  } = useQuery(["singlePost", postId], () => {
    return axios
      .get(import.meta.env.VITE_API_URL + `/post/getbyid/${postId}`)
      .then((res) => res.data)
  })

  useEffect(() => {
    if (detailPost) {
      setNewBody(detailPost.body)
    }
  }, [detailPost])

  const handlePlusOne = () => {
    const user = cookies.get("user")
    if (!user) {
      alert("Not logged in!")
      return
    }
    return axios.post(import.meta.env.VITE_API_URL + "/post/plusone", {
      postId,
      userId: user._id,
    })
  }

  const handleMinusOne = () => {
    const user = cookies.get("user")
    if (!user) {
      alert("Not logged in!")
      return
    }
    return axios.post(import.meta.env.VITE_API_URL + "/post/minusone", {
      postId,
      userId: user._id,
    })
  }

  const plusOneMutation = useMutation(handlePlusOne, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts")
      queryClient.invalidateQueries("singlePost")
    },
  })

  const minusOneMutation = useMutation(handleMinusOne, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts")
      queryClient.invalidateQueries("singlePost")
    },
  })

  const handleNewComment = () => {
    const user = cookies.get("user")
    if (!user) {
      alert("Not logged in!")
      return
    }
    return axios.post(import.meta.env.VITE_API_URL + "/comment/create", {
      postId,
      userId: user._id,
      body: newComment,
    })
  }

  const newCommentMutation = useMutation(handleNewComment, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts")
      queryClient.invalidateQueries("singlePost")
      setNewCommment("")
    },
    onError: (err) => {
      alert(err.response.data.errors.map((err) => err.msg))
    },
  })

  const handlePostDelete = () => {
    const user = cookies.get("user")
    if (!user) {
      alert("Not logged in!")
      return
    }
    return axios.post(import.meta.env.VITE_API_URL + "/post/delete", {
      postId,
      userId: user._id,
    })
  }

  const deletePostMutation = useMutation(handlePostDelete, {
    onSuccess: () => {
      navigate("/")
      queryClient.invalidateQueries("posts")
      queryClient.invalidateQueries("singlePost")
    },
  })

  const handlePostEdit = () => {
    const user = cookies.get("user")
    if (!user) {
      alert("Not logged in!")
      return
    }
    return axios.post(import.meta.env.VITE_API_URL + "/post/update", {
      postId,
      userId: user._id,
      newBody,
    })
  }

  const editPostMutation = useMutation(handlePostEdit, {
    onSuccess: () => {
      setEditToggle(!editToggle)
      queryClient.invalidateQueries("posts")
      queryClient.invalidateQueries("singlePost")
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>{isError}</div>
  }

  return (
    <div className="m-3 lg:mx-32">
      {detailPost ? (
        <div>
          <div className="lg:flex items-start block">
            <div className="w-full lg:w-4/6 ">
              {!editToggle ? (
                <>
                  <h1 className="text-3xl">{detailPost.title}</h1>
                  <br />
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {detailPost.body}
                  </div>
                  <br />
                </>
              ) : (
                <>
                  <h1 className="text-3xl">{detailPost.title}</h1>
                  <br />
                  <textarea
                    value={newBody}
                    rows={10}
                    className="block w-full border-0 py-0 pr-2 resize-none focus:outline-none"
                    onChange={(e) => setNewBody(e.target.value)}
                  ></textarea>
                  <br />
                </>
              )}
            </div>
            <div className=" w-full lg:w-2/6 mt-2 lg:ml-4 border-2 rounded-md p-4">
              <div className="inline-flex float-right">
                <BoltIcon
                  onClick={(e) => {
                    e.preventDefault()
                    plusOneMutation.mutate()
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
                    e.preventDefault()
                    minusOneMutation.mutate()
                  }}
                  className="h-6 w-6 cursor-pointer text-gray-600 ml-4 hover:bg-gray-600 hover:text-gray-200 rounded"
                >
                  -1
                </BoltSlashIcon>
              </div>
              {detailPost.author.username}
              <br />
              {dateFormatter(detailPost.createdAt)}
              <br />
              {cookies.get("user")?._id === detailPost.author._id ? (
                <div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      deletePostMutation.mutate()
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setEditToggle(!editToggle)
                    }}
                    className="ml-2 mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit
                  </button>
                  {editToggle && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        editPostMutation.mutate()
                      }}
                      className="ml-2 mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Confirm
                    </button>
                  )}
                </div>
              ) : (
                <></>
              )}
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
                    setNewCommment(e.target.value)
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
                        e.preventDefault()
                        newCommentMutation.mutate()
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
  )
}

export default PostDetail
