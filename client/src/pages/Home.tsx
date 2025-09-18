import React, { useEffect, useState } from 'react';
import { usePosts } from '../contexts/PostContext';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { posts, fetchPosts, loading, error } = usePosts();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handleLike = (postId: string) => {
    // 这里可以添加点赞逻辑
    console.log('Liked post:', postId);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-16 mb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gradient mb-6 animate-fade-in">
            欢迎来到全栈网站
          </h1>
          <p className="text-xl text-secondary-600 mb-8 animate-slide-up">
            分享你的想法，发现精彩内容，与社区互动交流
          </p>
          {!user && (
            <div className="flex justify-center space-x-4 animate-slide-up">
              <a 
                href="/register" 
                className="btn-primary text-lg px-8 py-3"
              >
                立即注册
              </a>
              <a 
                href="/login" 
                className="btn-outline text-lg px-8 py-3"
              >
                登录
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Posts Section */}
      <section className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-secondary-900">最新文章</h2>
          {user && (
            <a 
              href="/create-post" 
              className="btn-primary flex items-center space-x-2"
            >
              <span>写文章</span>
            </a>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {posts.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">暂无文章</h3>
            <p className="text-secondary-600">成为第一个分享内容的人吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard 
                key={post._id} 
                post={post} 
                onLike={handleLike}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {posts.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={loading}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '加载中...' : '加载更多'}
            </button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16 mt-20 bg-white rounded-2xl shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            为什么选择我们
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">快速响应</h3>
              <p className="text-secondary-600">基于现代技术栈，提供流畅的用户体验</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">安全可靠</h3>
              <p className="text-secondary-600">采用JWT认证，保护用户数据安全</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">社区互动</h3>
              <p className="text-secondary-600">点赞、评论、分享，与社区成员互动交流</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;