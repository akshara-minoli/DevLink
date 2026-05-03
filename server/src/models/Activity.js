import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['project_created', 'project_joined', 'profile_updated', 'project_left', 'join_request_sent'],
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    description: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

activitySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Activity', activitySchema);
