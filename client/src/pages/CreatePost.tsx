import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const CreatePost: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { createPost } = usePosts();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('请输入文章标题');
      return;
    }

    if (!formData.content.trim()) {
      setError('请输入文章内容');
      return;
    }

    setLoading(true);

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await createPost(formData.title, formData.content, tags);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-secondary-600 hover:text-secondary-900 transition-colors duration-200 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            返回
          </button>
          <h1 className="text-3xl font-bold text-secondary-900">写文章</h1>
          <p className="mt-2 text-secondary-600">
            分享你的想法和见解，与社区成员交流
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
              文章标题 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field text-lg"
              placeholder="输入一个吸引人的标题..."
              maxLength={100}
            />
            <p className="mt-1 text-sm text-secondary-500">
              {formData.title.length}/100 字符
            </p>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-secondary-700 mb-2">
              标签
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input-field"
              placeholder="输入标签，用逗号分隔（例如：技术, React, 教程）"
            />
            <p className="mt-1 text-sm text-secondary-500">
              添加相关标签帮助读者发现你的内容
            </p>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-secondary-700 mb-2">
              文章内容 *
            </label>
            <textarea
              id="content"
              name="content"
              rows={15}
              value={formData.content}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="开始写作..."
              maxLength={2000}
            />
            <p className="mt-1 text-sm text-secondary-500">
              {formData.content.length}/2000 字符
            </p>
          </div>

          {/* Preview */}
          {formData.title && formData.content && (
            <div className="border border-secondary-200 rounded-lg p-4 bg-secondary-50">
              <h3 className="text-sm font-medium text-secondary-700 mb-2">预览</h3>
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-secondary-900 mb-2">
                  {formData.title}
                </h2>
                <div className="text-secondary-700 whitespace-pre-wrap">
                  {formData.content}
                </div>
                {formData.tags && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-secondary-200">
            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary"
            >
              取消
            </button>
            <div className="flex space-x-4">
              <button
                type="button"
                className="btn-outline"
                disabled={loading}
              >
                保存草稿
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title.trim() || !formData.content.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    发布中...
                  </>
                ) : (
                  '发布文章'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;