import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { 
  UserCircleIcon, 
  PencilIcon,
  CameraIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { posts } = usePosts();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userPosts = posts.filter(post => post.author._id === user?.id);
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likeCount, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.commentCount, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      // 这里应该调用API更新用户资料
      // await updateProfile(formData);
      console.log('Profile updated:', formData);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {formData.avatar ? (
                  <img 
                    src={formData.avatar} 
                    alt={user?.username}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-24 h-24 text-secondary-400" />
                )}
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors duration-200">
                    <CameraIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        用户名
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="input-field"
                        maxLength={20}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        个人简介
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="input-field resize-none"
                        rows={3}
                        maxLength={200}
                        placeholder="介绍一下自己..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        头像链接
                      </label>
                      <input
                        type="url"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                      {user?.username}
                    </h1>
                    <p className="text-secondary-600 mb-4">
                      {user?.bio || '这个人很懒，什么都没有留下...'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-secondary-500">
                      <span>邮箱: {user?.email}</span>
                      <span>•</span>
                      <span>角色: {user?.role === 'admin' ? '管理员' : '用户'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>{loading ? '保存中...' : '保存'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>取消</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-outline flex items-center space-x-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>编辑资料</span>
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {userPosts.length}
            </div>
            <div className="text-secondary-600">文章数</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">
              {totalLikes}
            </div>
            <div className="text-secondary-600">总点赞数</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {totalComments}
            </div>
            <div className="text-secondary-600">总评论数</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {userPosts.length > 0 ? Math.round(totalLikes / userPosts.length) : 0}
            </div>
            <div className="text-secondary-600">平均点赞</div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="card">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">我的文章</h2>
          
          {userPosts.length === 0 ? (
            <div className="text-center py-12">
              <UserCircleIcon className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">还没有文章</h3>
              <p className="text-secondary-600 mb-6">开始创作你的第一篇文章吧！</p>
              <a href="/create-post" className="btn-primary">
                写文章
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <div key={post._id} className="border border-secondary-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        <a 
                          href={`/post/${post._id}`}
                          className="hover:text-primary-600 transition-colors duration-200"
                        >
                          {post.title}
                        </a>
                      </h3>
                      <p className="text-secondary-600 mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-secondary-500">
                        <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                        <span>•</span>
                        <span>{post.likeCount} 点赞</span>
                        <span>•</span>
                        <span>{post.commentCount} 评论</span>
                      </div>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 ml-4">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="px-2 py-1 bg-secondary-100 text-secondary-600 text-xs rounded-full">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;