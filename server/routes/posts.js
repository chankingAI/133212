const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// 获取所有文章
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isPublished: true })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ isPublished: true });

    res.json({
      posts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取单篇文章
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('comments.author', 'username avatar');

    if (!post || !post.isPublished) {
      return res.status(404).json({ message: '文章不存在' });
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建文章
router.post('/', auth, [
  body('title').isLength({ min: 1, max: 100 }).withMessage('标题长度必须在1-100个字符之间'),
  body('content').isLength({ min: 1, max: 2000 }).withMessage('内容长度必须在1-2000个字符之间')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user._id,
      tags: tags || []
    });

    await post.save();
    await post.populate('author', 'username avatar');

    res.status(201).json({ message: '文章创建成功', post });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新文章
router.put('/:id', auth, [
  body('title').optional().isLength({ min: 1, max: 100 }),
  body('content').optional().isLength({ min: 1, max: 2000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 检查是否是作者或管理员
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权限修改此文章' });
    }

    const { title, content, tags } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (tags) updateData.tags = tags;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');

    res.json({ message: '文章更新成功', post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除文章
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 检查是否是作者或管理员
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权限删除此文章' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: '文章删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 点赞文章
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    const isLiked = post.likes.includes(req.user._id);
    
    if (isLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ 
      message: isLiked ? '取消点赞成功' : '点赞成功',
      likeCount: post.likeCount 
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 添加评论
router.post('/:id/comments', auth, [
  body('content').isLength({ min: 1, max: 500 }).withMessage('评论长度必须在1-500个字符之间')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    const comment = {
      author: req.user._id,
      content: req.body.content
    };

    post.comments.push(comment);
    await post.save();

    await post.populate('comments.author', 'username avatar');
    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({ 
      message: '评论添加成功', 
      comment: newComment 
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;