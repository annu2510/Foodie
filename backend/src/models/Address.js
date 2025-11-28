const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  building: {
    type: String,
    required: true,
    trim: true
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  landmark: {
    type: String,
    required: true,
    trim: true
  },
  addressType: {
    type: String,
    enum: ['Home', 'Office', 'Hostel', 'Other'],
    required: true,
    default: 'Hostel'
  },
  pinCode: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

addressSchema.index({ user: 1, isDefault: 1 });

module.exports = mongoose.model('Address', addressSchema); 