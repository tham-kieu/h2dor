import express, { Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// POST: Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    const user = await User.create({ name, email, password });
    const token = user.getSignedJwtToken(); // Sử dụng method từ model

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// POST: Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = user.getSignedJwtToken(); // Sử dụng method từ model

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// GET: Lấy thông tin user hiện tại
router.get('/me', protect, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: Cập nhật thông tin user
router.put('/me', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address },
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Thêm/loại bỏ sản phẩm yêu thích
router.put('/favorites/:productId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const productId = req.params.productId;
    
    // Kiểm tra productId có hợp lệ không
    if (!productId || typeof productId !== 'string') {
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }

    // Kiểm tra xem productId có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    user.favorites = user.favorites || [];
    const alreadyFavorite = user.favorites.some(
      (fav: any) => fav.toString() === productId
    );

    if (alreadyFavorite) {
      user.favorites = user.favorites.filter(
        (fav: any) => fav.toString() !== productId
      );
    } else {
      // Chuyển đổi an toàn sang ObjectId
      user.favorites.push(new mongoose.Types.ObjectId(productId));
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// GET: Lấy danh sách yêu thích
router.get('/favorites', protect, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json(user.favorites);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;