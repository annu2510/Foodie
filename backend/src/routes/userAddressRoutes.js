const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Address = require('../models/Address');
const mongoose = require('mongoose');

// Get all addresses for the current user
router.get('/', protect, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id })
      .sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ 
      message: 'Error fetching addresses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add a new address
router.post('/', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      fullName,
      mobileNumber,
      building,
      roomNumber,
      landmark,
      addressType,
      pinCode,
      city
    } = req.body;

    // Validate required fields
    const requiredFields = ['fullName', 'mobileNumber', 'building', 'roomNumber', 'landmark', 'addressType'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        fields: missingFields 
      });
    }

    // Check if this is the first address for the user
    const addressCount = await Address.countDocuments({ user: req.user._id }).session(session);
    const isDefault = addressCount === 0;

    // Create new address
    const address = await Address.create([{
      user: req.user._id,
      fullName,
      mobileNumber,
      building,
      roomNumber,
      landmark,
      addressType,
      pinCode,
      city,
      isDefault
    }], { session });

    await session.commitTransaction();
    
    // Get the created address
    const createdAddress = address[0];
    res.status(201).json(createdAddress);
  } catch (error) {
    await session.abortTransaction();
    console.error('Error adding address:', error);
    res.status(400).json({ 
      message: 'Error adding address',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
});

// Set an address as default
router.put('/:id/default', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid address ID' });
    }

    // First, remove default from all other addresses
    await Address.updateMany(
      { user: req.user._id },
      { $set: { isDefault: false } },
      { session }
    );

    // Set the selected address as default
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { isDefault: true } },
      { new: true, session }
    );

    if (!address) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Address not found' });
    }

    await session.commitTransaction();
    res.json(address);
  } catch (error) {
    await session.abortTransaction();
    console.error('Error updating default address:', error);
    res.status(400).json({ 
      message: 'Error updating default address',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
});

// Delete an address
router.delete('/:id', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid address ID' });
    }

    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    }).session(session);

    if (!address) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Address not found' });
    }

    // If the deleted address was default and there are other addresses,
    // make the first remaining address the default
    if (address.isDefault) {
      const firstAddress = await Address.findOne({ user: req.user._id }).session(session);
      if (firstAddress) {
        firstAddress.isDefault = true;
        await firstAddress.save({ session });
      }
    }

    await session.commitTransaction();
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error deleting address:', error);
    res.status(400).json({ 
      message: 'Error deleting address',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
});

module.exports = router; 