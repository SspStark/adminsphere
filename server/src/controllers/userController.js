import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import logger from '../config/logger.js';
import { populateRolePermissions } from '../services/roleService.js';
import { mapUserResponse } from '../utils/utils.js';
import { deleteFromCloudinary, uploadToCloudinary } from '../integrations/imageService.js';

export const updateMe = async (req, res) => {
  try {
    const id = req.user._id.toString();

    if (req.body.username) {
      const exists = await User.findOne({ username: new RegExp('^' + req.body.username + '$', 'i') });
      if (exists && exists._id.toString() !== id) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
      }
    }

    const allowedFields = ['firstName', 'lastName', 'username'];
    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).populate(populateRolePermissions);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: mapUserResponse(updatedUser),
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const changeMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const id = req.user._id.toString();

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    logger.error('Password change error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const uploadMyAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete old image
    if (user.profileImage?.publicId) {
      await deleteFromCloudinary(user.profileImage.publicId, 'image');
    }

    // Upload new image
    const result = await uploadToCloudinary(req.file.buffer, 'adminsphere/profile-images', 'image');

    user.profileImage = {
      url: result.secure_url,
      publicId: result.publicId,
    };

    await user.save();

    const updatedUser = await User.findById(user._id).populate(populateRolePermissions);

    return res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
      user: mapUserResponse(updatedUser),
    });
  } catch (error) {
    logger.error('My avatar upload error:', error);

    return res.status(500).json({ success: false, message: 'Image upload failed' });
  }
};

export const deleteMyAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.profileImage?.publicId) {
      return res.status(400).json({ success: false, message: 'No profile image to delete' });
    }

    await deleteFromCloudinary(user.profileImage.publicId, 'image');

    user.profileImage = {
      url: '',
      publicId: '',
    };

    await user.save();

    const updatedUser = await User.findById(user._id).populate(populateRolePermissions);

    return res.status(200).json({
      success: true,
      message: 'Profile image deleted successfully',
      user: mapUserResponse(updatedUser),
    });
  } catch (error) {
    logger.error('My avatar upload error:', error);

    return res.status(500).json({ success: false, message: 'Image upload failed' });
  }
};
