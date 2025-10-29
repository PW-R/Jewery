import Click from '../models/Click.js';

// === TRACK PRODUCT CLICK ===
export const trackClick = async (req, res) => {
  try {
    const { productId, category } = req.body;
    const userId = req.user.id; // get user ID from JWT

    if (!userId) {
      return res.status(401).json({ message: 'User must be logged in' });
    }

    if (!productId) {
      return res.status(400).json({ message: 'ProductId is required' });
    }

    const newClick = new Click({
      userId,
      productId,
      category
    });

    await newClick.save();

    res.status(201).json({ message: 'Click tracked successfully', click: newClick });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
