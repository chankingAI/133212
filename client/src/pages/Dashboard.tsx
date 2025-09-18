import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import PostCard from '../components/PostCard';
import { 
  PlusIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { posts, fetchPosts, loading } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, []);

  const userPosts = posts.filter(post => post.author._id === user?.id);
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likeCount, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.commentCount, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-secondary-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                欢迎回来，{user?.username}！
              </h1>
              <p className="mt-2 text-secondary-600">
                管理你的内容和与社区互动
              </p>
            </div>
            <Link
              to="/create-post"
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>写文章</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">我的文章</p>
                <p className="text-2xl font-semibold text-secondary-900">{userPosts.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HeartIcon className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">总点赞数</p>
                <p className="text-2xl font-semibold text-secondary-900">{totalLikes}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">总评论数</p>
                <p className="text-2xl font-semibold text-secondary-900">{totalComments}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">社区排名</p>
                <p className="text-2xl font-semibold text-secondary-900">#1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">我的文章</h2>
              <Link
                to="/create-post"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                查看全部 →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-secondary-200 rounded w-1/2 mb-4"></div>
                    <div className="h-20 bg-secondary-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : userPosts.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">还没有文章</h3>
                <p className="text-secondary-600 mb-6">开始创作你的第一篇文章吧！</p>
                <Link to="/create-post" className="btn-primary">
                  写文章
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {userPosts.slice(0, 5).map((post) => (
                  <PostCard 
                    key={post._id} 
                    post={post} 
                    currentUserId={user?.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">快速操作</h3>
              <div className="space-y-3">
                <Link
                  to="/create-post"
                  className="flex items-center p-3 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-200"
                >
                  <PlusIcon className="w-5 h-5 mr-3" />
                  <span>写新文章</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center p-3 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-200"
                >
                  <UserGroupIcon className="w-5 h-5 mr-3" />
                  <span>编辑资料</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">最近活动</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-secondary-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>发布了新文章</span>
                </div>
                <div className="flex items-center text-sm text-secondary-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>收到了 5 个点赞</span>
                </div>
                <div className="flex items-center text-sm text-secondary-600">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span>收到了 2 条评论</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="card bg-gradient-to-r from-primary-50 to-secondary-50">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">写作小贴士</h3>
              <div className="space-y-3 text-sm text-secondary-600">
                <p>• 使用吸引人的标题来增加点击率</p>
                <p>• 添加相关标签帮助读者发现你的内容</p>
                <p>• 定期与读者互动，回复评论</p>
                <p>• 保持内容原创性和质量</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;