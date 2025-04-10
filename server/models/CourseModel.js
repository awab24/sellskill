  import mongoose from 'mongoose';

  const schema = mongoose.Schema;

  const CourseSchema = new schema({
    providerId: String, // ID of the provider (the one uploading the course)
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    thumbnail: {
      name: String,
      data: Buffer,
      contentType: String,
    },
    content: [
      {
        name: String,
        video: {
          data: Buffer,
          contentType: String,
        },
      },
    ], // List of videos
    dateUploaded: { 
      type: Date, 
      default: Date.now 
    },
  });

  export const CourseModel = mongoose.model('course', CourseSchema);
