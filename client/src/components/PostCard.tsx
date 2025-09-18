import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  CalendarIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  tags: string[];
  likes: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  currentUserId?: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, currentUserId }) => {
  const isLiked = currentUserId && post.likes.includes(currentUserId);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {post.author.avatar ? (
            <img 
              src={post.author.avatar} 
              alt={post.author.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="w-10 h-10 text-secondary-400" />
          )}
          <div>
            <p className="font-medium text-secondary-900">{post.author.username}</p>
            <p className="text-sm text-secondary-500 flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <Link 
          to={`/post/${post._id}`}
          className="block group-hover:text-primary-600 transition-colors duration-200"
        >
          <h3 className="text-xl font-semibold text-secondary-900 mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-secondary-600 leading-relaxed">
            {truncateContent(post.content)}
          </p>
        </Link>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onLike?.(post._id)}
            className={`flex items-center space-x-1 transition-colors duration-200 ${
              isLiked 
                ? 'text-red-500' 
                : 'text-secondary-500 hover:text-red-500'
            }`}
          >
            {isLiked ? (
              <HeartSolidIcon className="w-5 h-5" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{post.likeCount}</span>
          </button>
          
          <Link 
            to={`/post/${post._id}`}
            className="flex items-center space-x-1 text-secondary-500 hover:text-primary-600 transition-colors duration-200"
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{post.commentCount}</span>
          </Link>
        </div>
        
        <Link 
          to={`/post/${post._id}`}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
        >
          阅读更多 →
        </Link>
      </div>
    </div>
  );
};

export default PostCard;