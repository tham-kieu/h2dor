import express from 'express';
import LocationReview from '../models/LocationReview';

const router = express.Router();
const supportedLocationIds = new Set(['h2dor-ha-noi']);

router.get('/:locationId/reviews', async (req, res) => {
  const { locationId } = req.params;
  if (!supportedLocationIds.has(locationId)) {
    return res.status(404).json({ message: 'Không tìm thấy địa điểm' });
  }

  try {
    const [reviews, summary] = await Promise.all([
      LocationReview.find({ locationId }).sort({ createdAt: -1 }).limit(50).lean(),
      LocationReview.aggregate([
        { $match: { locationId } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
          },
        },
      ]),
    ]);

    res.json({
      reviews,
      averageRating: summary[0]?.averageRating ?? 0,
      totalReviews: summary[0]?.totalReviews ?? 0,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Không thể tải đánh giá',
    });
  }
});

router.post('/:locationId/reviews', async (req, res) => {
  const { locationId } = req.params;
  if (!supportedLocationIds.has(locationId)) {
    return res.status(404).json({ message: 'Không tìm thấy địa điểm' });
  }

  const body = req.body ?? {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const comment = typeof body.comment === 'string' ? body.comment.trim() : '';
  const rating = Number(body.rating);

  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ message: 'Tên phải từ 2 đến 80 ký tự' });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Vui lòng chọn số sao từ 1 đến 5' });
  }
  if (comment.length < 5 || comment.length > 1000) {
    return res.status(400).json({ message: 'Nhận xét phải từ 5 đến 1000 ký tự' });
  }

  try {
    const review = await LocationReview.create({ locationId, name, rating, comment });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Không thể gửi đánh giá',
    });
  }
});

export default router;
