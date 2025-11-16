import UserDetails from '../models/UserDetails.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

// Get or create user details
const getOrCreateUserDetails = async (userId) => {
  let userDetails = await UserDetails.findOne({ userId });
  
  if (!userDetails) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    userDetails = new UserDetails({
      userId,
      username: user.name,
      email: user.email,
      orders: [],
      wishlist: [],
      cart: [],
    });
    await userDetails.save();
  }
  
  return userDetails;
};

// Get user details
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Use authenticated user's ID
    const userDetails = await getOrCreateUserDetails(userId);
    
    // Populate order details
    const populatedOrders = await Promise.all(
      userDetails.orders.map(async (order) => {
        if (order.orderId) {
          const orderDoc = await Order.findById(order.orderId)
            .populate('deliveryTracking');
          return {
            ...order.toObject(),
            orderDetails: orderDoc,
          };
        }
        return order.toObject();
      })
    );
    
    res.json({
      ...userDetails.toObject(),
      orders: populatedOrders,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // Use authenticated user's ID
    const { productId, productImage, productName, price } = req.body;
    
    const userDetails = await getOrCreateUserDetails(userId);
    
    // Check if already in wishlist
    const exists = userDetails.wishlist.some(
      (item) => item.productId === productId
    );
    
    if (exists) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }
    
    userDetails.wishlist.push({
      productId,
      productImage,
      productName,
      price,
      addedAt: new Date(),
    });
    
    await userDetails.save();
    res.json(userDetails);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // Use authenticated user's ID
    const { productId } = req.body;
    
    const userDetails = await getOrCreateUserDetails(userId);
    userDetails.wishlist = userDetails.wishlist.filter(
      (item) => item.productId !== productId
    );
    
    await userDetails.save();
    res.json(userDetails);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // Use authenticated user's ID
    const { productId, productImage, productName, price, quantity = 1 } = req.body;
    
    const userDetails = await getOrCreateUserDetails(userId);
    
    // Check if already in cart
    const existingItem = userDetails.cart.find(
      (item) => item.productId === productId
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      userDetails.cart.push({
        productId,
        productImage,
        productName,
        price,
        quantity,
        addedAt: new Date(),
      });
    }
    
    await userDetails.save();
    res.json(userDetails);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id; // Use authenticated user's ID
    const { productId } = req.body;
    
    const userDetails = await getOrCreateUserDetails(userId);
    userDetails.cart = userDetails.cart.filter(
      (item) => item.productId !== productId
    );
    
    await userDetails.save();
    res.json(userDetails);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

// Update cart quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id; // Use authenticated user's ID
    const { productId, quantity } = req.body;
    
    const userDetails = await getOrCreateUserDetails(userId);
    const cartItem = userDetails.cart.find(
      (item) => item.productId === productId
    );
    
    if (cartItem) {
      if (quantity <= 0) {
        userDetails.cart = userDetails.cart.filter(
          (item) => item.productId !== productId
        );
      } else {
        cartItem.quantity = quantity;
      }
    }
    
    await userDetails.save();
    res.json(userDetails);
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(500).json({ error: 'Failed to update cart quantity' });
  }
};

// Clear cart (after checkout)
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id; // Use authenticated user's ID
    const userDetails = await getOrCreateUserDetails(userId);
    userDetails.cart = [];
    await userDetails.save();
    res.json(userDetails);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

// Add order to user details
export const addOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Use authenticated user's ID
    const { orderId, productImages, total } = req.body;
    
    const userDetails = await getOrCreateUserDetails(userId);
    
    userDetails.orders.push({
      orderId,
      productImages,
      orderDate: new Date(),
      status: 'pending',
      total,
    });
    
    await userDetails.save();
    res.json(userDetails);
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'Failed to add order' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const userId = req.user.id; // Use authenticated user's ID
    const { orderId } = req.params;
    const { status } = req.body;
    
    const userDetails = await getOrCreateUserDetails(userId);
    const order = userDetails.orders.find(
      (o) => o.orderId && o.orderId.toString() === orderId
    );
    
    if (order) {
      order.status = status;
      await userDetails.save();
    }
    
    res.json(userDetails);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Use authenticated user's ID
    const { orderId } = req.params;
    
    const userDetails = await getOrCreateUserDetails(userId);
    const order = userDetails.orders.find(
      (o) => o.orderId && o.orderId.toString() === orderId
    );
    
    if (order) {
      order.status = 'cancelled';
      await userDetails.save();
      
      // Also update the Order document
      const orderDoc = await Order.findById(orderId);
      if (orderDoc) {
        orderDoc.status = 'cancelled';
        await orderDoc.save();
      }
    }
    
    res.json(userDetails);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

