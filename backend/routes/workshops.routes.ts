import { createHash, randomBytes } from 'crypto';
import express from 'express';
import mongoose from 'mongoose';
import Workshop from '../models/Workshop';
import WorkshopBooking from '../models/WorkshopBooking';
import { admin, AuthRequest, protect } from '../middleware/auth.middleware';

const router = express.Router();
const cancellationWindowMs = 48 * 60 * 60 * 1000;

const hashCode = (code: string) =>
  createHash('sha256').update(code).digest('hex');

router.get('/', async (_req, res) => {
  try {
    const workshops = await Workshop.find({
      isActive: true,
      startsAt: { $gt: new Date() },
    })
      .sort({ startsAt: 1 })
      .lean();

    res.json(workshops);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Không thể tải workshop',
    });
  }
});

router.post('/bookings/cancel', async (req, res) => {
  const code = typeof req.body?.confirmationCode === 'string'
    ? req.body.confirmationCode.trim()
    : '';
  if (!/^[a-f0-9]{32}$/i.test(code)) {
    return res.status(400).json({ message: 'Mã xác nhận không hợp lệ' });
  }

  try {
    const booking = await WorkshopBooking.findOneAndUpdate(
      {
        confirmationCodeHash: hashCode(code),
        status: 'booked',
      },
      { status: 'cancelled' },
      { new: true },
    );

    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt chỗ đang hoạt động' });
    }

    const workshop = await Workshop.findOneAndUpdate(
      {
        _id: booking.workshop,
        startsAt: { $gt: new Date(Date.now() + cancellationWindowMs) },
      },
      { $inc: { bookedSeats: -booking.seats } },
      { new: true },
    );

    if (!workshop) {
      await WorkshopBooking.updateOne(
        { _id: booking._id, status: 'cancelled' },
        { status: 'booked' },
      );
      return res.status(400).json({
        message: 'Chỉ có thể hủy workshop trước giờ bắt đầu ít nhất 48 giờ',
      });
    }

    res.json({ message: 'Đã hủy đặt chỗ thành công' });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Không thể hủy đặt chỗ',
    });
  }
});

router.post('/:id/bookings', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Workshop không hợp lệ' });
  }

  const body = req.body ?? {};
  const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const seats = Number(body.seats);

  if (customerName.length < 2 || customerName.length > 80) {
    return res.status(400).json({ message: 'Tên phải từ 2 đến 80 ký tự' });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Email không hợp lệ' });
  }
  if (phone.length < 8 || phone.length > 30) {
    return res.status(400).json({ message: 'Số điện thoại phải từ 8 đến 30 ký tự' });
  }
  if (!Number.isInteger(seats) || seats < 1 || seats > 10) {
    return res.status(400).json({ message: 'Số chỗ đặt phải từ 1 đến 10' });
  }

  try {
    const workshop = await Workshop.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
        startsAt: { $gt: new Date() },
        $expr: { $lte: [{ $add: ['$bookedSeats', seats] }, '$capacity'] },
      },
      { $inc: { bookedSeats: seats } },
      { new: true },
    );

    if (!workshop) {
      return res.status(409).json({
        message: 'Workshop không còn chỗ hoặc đã bắt đầu',
      });
    }

    const confirmationCode = randomBytes(16).toString('hex');
    let booking;
    try {
      booking = await WorkshopBooking.create({
        workshop: workshop._id,
        customerName,
        email,
        phone,
        seats,
        confirmationCodeHash: hashCode(confirmationCode),
      });
    } catch (error) {
      await Workshop.updateOne(
        { _id: workshop._id },
        { $inc: { bookedSeats: -seats } },
      );
      throw error;
    }

    res.status(201).json({
      bookingId: booking.id,
      confirmationCode,
      workshopTitle: workshop.title,
      startsAt: workshop.startsAt,
      seats: booking.seats,
      cancellationDeadline: new Date(workshop.startsAt.getTime() - cancellationWindowMs),
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Không thể tạo đặt chỗ',
    });
  }
});

router.post('/', protect, admin, async (req: AuthRequest, res) => {
  const startsAt = new Date(req.body?.startsAt);
  if (Number.isNaN(startsAt.getTime()) || startsAt <= new Date()) {
    return res.status(400).json({
      message: 'Thời gian bắt đầu phải hợp lệ và nằm trong tương lai',
    });
  }

  try {
    const workshop = await Workshop.create(req.body);
    res.status(201).json(workshop);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Dữ liệu workshop không hợp lệ',
    });
  }
});

export default router;
