const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// 获取用户资料
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新用户资料
router.put('/:id', auth, [
  body('username').optional().isLength({ min: 3, max: 20 }),
  body('bio').optional().isLength({ max: 200 })
], async (req, res) => {
  try {
    // 检查是否是用户本人或管理员
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权限修改此用户资料' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, bio, avatar } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({ message: '用户资料更新成功', user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: '用户名已存在' });
    }
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取所有用户（管理员）
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权限访问' });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;