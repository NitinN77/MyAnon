import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "react-query";


const PostDetail = () => {
  const { postId } = useParams()
  const queryClient = useQueryClient()
  const [detailPost, setDetailPost] = useState(null)

  const { isLoading, isError, data } = useQuery('singlePost', () => {
    axios.post('http://localhost:3000/post/getone', {
      postId
    })
    .then(post => {
      setDetailPost(post.data)
    })
    .catch(err => console.log(err))
  })
  
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='m-2'>{detailPost && detailPost.title }</div>
  )
}

export default PostDetail