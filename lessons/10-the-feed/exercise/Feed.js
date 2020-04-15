import React, { useState, useEffect, useReducer } from "react"
import FeedPost from "app/FeedPost"
import { loadFeedPosts, subscribeToNewFeedPosts } from "app/utils"
// import FeedFinal from './Feed.final'
// export default FeedFinal
export default Feed

let feedState = null

function Feed() {
  const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case 'NEW_POSTS_LOADED': return {
        ...state,
        newPosts: action.newPosts
      }
      case 'LOAD_POSTS': return {
        ...state,
        posts: action.posts
      }
      case 'LOAD_NEW_POSTS': return {
        ...state,
        time: Date.now(),
        limit: state.limit + state.newPosts.length
      }
      case 'VIEW_MORE': return {
        ...state,
        limit: state.limit + 3
      }
      default: throw new Error(`Unknown action ${action.type}`)
    }
  }, 
  feedState || {
    posts: [],
    time: Date.now(),
    limit: 3,
    newPosts: []
  })

  useEffect(() => {
    feedState = state
  })

  const { posts, time, limit, newPosts } = state

  useEffect(() => {
    return subscribeToNewFeedPosts(time, (newPosts) => {
      dispatch({ type: 'NEW_POSTS_LOADED', newPosts })
    })
  }, [time])

  useEffect(() => {
    let isCurrent = true
    loadFeedPosts(time, limit)
      .then(posts => {
        if (isCurrent) dispatch({ type: 'LOAD_POSTS', posts })
      })
    return () => {
      isCurrent = false
    }
  }, [time, limit])

  return (
    <div className="Feed">
      {newPosts.length > 0 && (
        <div className="Feed_button_wrapper">
          <button
            onClick={() => {
              dispatch({ type: 'LOAD_NEW_POSTS', newPosts })
            }}
          className="Feed_new_posts_button icon_button">
            View {newPosts.length} New Posts
          </button>
        </div>
      )}

      {posts.map((post, index) => (
        <FeedPost post={post} key={index} />
      ))}

      <div className="Feed_button_wrapper">
        <button
          onClick={() => {
            dispatch({ type: 'VIEW_MORE' })
          }}
          className="Feed_new_posts_button icon_button">View More</button>
      </div>
    </div>
  )
}

// you can delete this
const fakePost = {
  createdAt: Date.now() - 10000,
  date: "2019-03-30",
  message: "Went for a run",
  minutes: 45,
  uid: "0BrC0fB6r2Rb5MNxyQxu5EnYacf2"
}

