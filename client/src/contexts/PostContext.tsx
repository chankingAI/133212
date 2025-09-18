import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface Comment {
  _id: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
    bio?: string;
  };
  tags: string[];
  likes: string[];
  comments: Comment[];
  likeCount: number;
  commentCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PostContextType {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  fetchPosts: (page?: number) => Promise<void>;
  fetchPost: (id: string) => Promise<void>;
  createPost: (title: string, content: string, tags?: string[]) => Promise<void>;
  updatePost: (id: string, title: string, content: string, tags?: string[]) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  clearError: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/posts?page=${page}&limit=10`);
      setPosts(response.data.posts);
    } catch (error: any) {
      setError(error.response?.data?.message || '获取文章失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/posts/${id}`);
      setCurrentPost(response.data.post);
    } catch (error: any) {
      setError(error.response?.data?.message || '获取文章详情失败');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (title: string, content: string, tags: string[] = []) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/posts', { title, content, tags });
      setPosts(prev => [response.data.post, ...prev]);
    } catch (error: any) {
      setError(error.response?.data?.message || '创建文章失败');
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id: string, title: string, content: string, tags: string[] = []) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/posts/${id}`, { title, content, tags });
      setPosts(prev => prev.map(post => 
        post._id === id ? response.data.post : post
      ));
      if (currentPost?._id === id) {
        setCurrentPost(response.data.post);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || '更新文章失败');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/posts/${id}`);
      setPosts(prev => prev.filter(post => post._id !== id));
      if (currentPost?._id === id) {
        setCurrentPost(null);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || '删除文章失败');
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (id: string) => {
    try {
      const response = await axios.post(`/api/posts/${id}/like`);
      setPosts(prev => prev.map(post => 
        post._id === id 
          ? { ...post, likeCount: response.data.likeCount }
          : post
      ));
      if (currentPost?._id === id) {
        setCurrentPost(prev => prev ? { ...prev, likeCount: response.data.likeCount } : null);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || '操作失败');
    }
  };

  const addComment = async (postId: string, content: string) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, { content });
      if (currentPost?._id === postId) {
        setCurrentPost(prev => prev ? {
          ...prev,
          comments: [...prev.comments, response.data.comment],
          commentCount: prev.commentCount + 1
        } : null);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || '添加评论失败');
    }
  };

  const value = {
    posts,
    currentPost,
    loading,
    error,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
    clearError
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};