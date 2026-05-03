import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      default: null,
    },
    workExperience: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    github: {
      type: String,
      default: null,
    },
    linkedin: {
      type: String,
      default: null,
    },
    technologies: [String],
    profileImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
