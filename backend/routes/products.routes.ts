import express, { Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import User from '../models/User';
import { protect, admin, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// GET: Lấy tất cả sản phẩm (có filter)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // Xây dựng filter
    const filter: Record<string, any> = {};
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.isFeatured === 'true') {
      filter.isFeatured = true;
    }
    if (req.query.isNew === 'true') {
      filter.isNew = true;
    }

    // Sort
    const sort: Record<string, any> = {};
    switch (req.query.sortBy) {
      case 'price-asc': sort.price = 1; break;
      case 'price-desc': sort.price = -1; break;
      case 'rating': sort.rating = -1; break;
      case 'newest': sort.createdAt = -1; break;
      default: sort.createdAt = -1;
    }

    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skip);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Lấy sản phẩm theo slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Lấy sản phẩm theo ID
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id as string;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Tạo sản phẩm mới (Admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Cập nhật sản phẩm (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const productId = req.params.id as string;
    const product = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Xóa sản phẩm (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const productId = req.params.id as string;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Thêm đánh giá
router.post('/:id/reviews', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id as string;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Kiểm tra đã đánh giá chưa
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này' });
    }

    const review = {
      user: req.user.id,
      name: currentUser.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Đánh giá thành công' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;