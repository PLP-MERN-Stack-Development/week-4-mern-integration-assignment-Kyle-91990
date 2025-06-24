import { createContext, useContext, useState } from 'react';

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Optimistic add
  const addPost = async (post, apiCall) => {
    setPosts(prev => [post, ...prev]);
    try {
      const saved = await apiCall();
      setPosts(prev => [saved, ...prev.filter(p => p !== post)]);
    } catch {
      setPosts(prev => prev.filter(p => p !== post));
    }
  };

  // Optimistic edit
  const editPost = async (id, updated, apiCall) => {
    const prev = posts.find(p => p._id === id);
    setPosts(prevPosts => prevPosts.map(p => p._id === id ? { ...p, ...updated } : p));
    try {
      const saved = await apiCall();
      setPosts(prevPosts => prevPosts.map(p => p._id === id ? saved : p));
    } catch {
      setPosts(prevPosts => prevPosts.map(p => p._id === id ? prev : p));
    }
  };

  // Optimistic delete
  const deletePost = async (id, apiCall) => {
    const prev = posts;
    setPosts(prevPosts => prevPosts.filter(p => p._id !== id));
    try {
      await apiCall();
    } catch {
      setPosts(prev);
    }
  };

  return (
    <PostsContext.Provider value={{
      posts, setPosts, loading, setLoading, addPost, editPost, deletePost
    }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostsContext);
}
