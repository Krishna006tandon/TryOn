import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';

// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const { isActive, expired } = req.query;
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const coupons = await Coupon.find(query).sort({ createdAt: -1 });

    // Filter expired coupons if requested
    let filteredCoupons = coupons;
    if (expired === 'true') {
      const now = new Date();
      filteredCoupons = coupons.filter(
        (coupon) => coupon.validUntil < now || (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      );
    } else if (expired === 'false') {
      const now = new Date();
      filteredCoupons = coupons.filter(
        (coupon) => coupon.validUntil >= now && (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)
      );
    }

    res.json(filteredCoupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single coupon by ID
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new coupon
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxDiscountAmount,
      validFrom,
      validUntil,
      usageLimit,
      usageLimitPerUser,
      applicableCategories,
      isActive,
    } = req.body;

    // Check if code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    // Validate dates
    if (new Date(validUntil) <= new Date(validFrom)) {
      return res.status(400).json({ message: 'Valid until date must be after valid from date' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minPurchaseAmount: minPurchaseAmount || 0,
      maxDiscountAmount,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      usageLimit,
      usageLimitPerUser: usageLimitPerUser || 1,
      applicableCategories: applicableCategories || [],
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.userId,
    });

    await coupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    const updateData = req.body;

    // If code is being updated, check for duplicates
    if (updateData.code && updateData.code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: updateData.code.toUpperCase() });
      if (existingCoupon) {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
      updateData.code = updateData.code.toUpperCase();
    }

    // Validate dates if being updated
    const validFrom = updateData.validFrom ? new Date(updateData.validFrom) : coupon.validFrom;
    const validUntil = updateData.validUntil ? new Date(updateData.validUntil) : coupon.validUntil;
    if (validUntil <= validFrom) {
      return res.status(400).json({ message: 'Valid until date must be after valid from date' });
    }

    Object.assign(coupon, updateData);
    await coupon.save();

    res.json({ message: 'Coupon updated successfully', coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Check if coupon has been used
    const usedCount = await Order.countDocuments({ couponId: coupon._id });
    if (usedCount > 0) {
      // Instead of deleting, deactivate it
      coupon.isActive = false;
      await coupon.save();
      return res.json({ message: 'Coupon deactivated (has been used)', coupon });
    }

    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Validate coupon (for checkout)
export const validateCoupon = async (req, res) => {
  try {
    const { code, amount, userId } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return res.status(400).json({ message: 'Coupon is not valid at this time' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    if (amount < coupon.minPurchaseAmount) {
      return res.status(400).json({
        message: `Minimum purchase amount of $${coupon.minPurchaseAmount} required`,
      });
    }

    // Check user usage limit
    if (userId) {
      const userUsageCount = await Order.countDocuments({
        userId,
        couponId: coupon._id,
      });
      if (userUsageCount >= coupon.usageLimitPerUser) {
        return res.status(400).json({ message: 'You have already used this coupon' });
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      valid: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discount: Math.round(discount * 100) / 100,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

