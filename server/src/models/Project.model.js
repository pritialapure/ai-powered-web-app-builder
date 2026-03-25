import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Untitled Project',
    },
    description: {
      type: String,
      default: '',
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
        },
        content: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    generatedCode: {
      type: String,
      default: '',
    },
    versions: [
      {
        code: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
