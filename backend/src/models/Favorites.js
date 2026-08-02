import mongoose from 'mongoose';

const favoritesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate favorite cities for the same user
favoritesSchema.index({ userId: 1, city: 1 }, { unique: true });

export default mongoose.model('Favorites', favoritesSchema);