import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  CalendarIcon,
  UserCircleIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPost, fetchPost, likePost, addComment, deletePost, loading, error } = usePosts();
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentPost && user) {
      setIsLiked(currentPost.likes.includes(user.id));
    }
  }, [currentPost, user]);

  const handleLike = async () => {
    if (id) {
      await likePost(id);
      setIsLiked(!isLiked);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !id) return;

    try {
      await addComment(id, comment);
      setComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleDelete = async () => {
    if (!id || !currentPost) return;
    
    if (window.confirm('确定要删除这篇文章吗？此操作无法撤销。')) {
      try {
        await deletePost(id);
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to delete post:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">文章不存在</h2>
          <p className="text-secondary-600 mb-6">您访问的文章可能已被删除或不存在。</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const isAuthor = user && currentPost.author._id === user.id;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-secondary-600 hover:text-secondary-900 transition-colors duration-200 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          返回
        </button>

        {/* Post Header */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {currentPost.author.avatar ? (
                <img 
                  src={currentPost.author.avatar} 
                  alt={currentPost.author.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-12 h-12 text-secondary-400" />
              )}
              <div>
                <h3 className="font-semibold text-secondary-900">{currentPost.author.username}</h3>
                <p className="text-sm text-secondary-500 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {formatDate(currentPost.createdAt)}
                </p>
              </div>
            </div>

            {isAuthor && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate(`/edit-post/${currentPost._id}`)}
                  className="p-2 text-secondary-500 hover:text-primary-600 transition-colors duration-200"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-secondary-500 hover:text-red-600 transition-colors duration-200"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            {currentPost.title}
          </h1>

          {currentPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {currentPost.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-6 text-secondary-500">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                isLiked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              {isLiked ? (
                <HeartSolidIcon className="w-6 h-6" />
              ) : (
                <HeartIcon className="w-6 h-6" />
              )}
              <span className="font-medium">{currentPost.likeCount}</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <ChatBubbleLeftIcon className="w-6 h-6" />
              <span className="font-medium">{currentPost.commentCount}</span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="card mb-6">
          <div className="prose max-w-none">
            <div className="text-secondary-700 leading-relaxed whitespace-pre-wrap">
              {currentPost.content}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="card">
          <h3 className="text-xl font-semibold text-secondary-900 mb-6">
            评论 ({currentPost.comments.length})
          </h3>

          {/* Add Comment */}
          {user && (
            <form onSubmit={handleComment} className="mb-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="写下你的评论..."
                    className="input-field resize-none"
                    rows={3}
                    maxLength={500}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="btn-primary self-end disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  评论
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {currentPost.comments.length === 0 ? (
              <p className="text-secondary-500 text-center py-8">
                还没有评论，成为第一个评论的人吧！
              </p>
            ) : (
              currentPost.comments.map((comment) => (
                <div key={comment._id} className="flex space-x-3 p-4 bg-secondary-50 rounded-lg">
                  {comment.author.avatar ? (
                    <img 
                      src={comment.author.avatar} 
                      alt={comment.author.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-secondary-400" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-secondary-900">
                        {comment.author.username}
                      </h4>
                      <span className="text-sm text-secondary-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-secondary-700">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;