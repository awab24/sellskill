  import mongoose from "mongoose";
  
  const schema = mongoose.Schema;
  const JobSchema = new schema({
    _id: String,
    title: String,
    description: String,
    term: String,
    experience: String,
    budget: Number,
    
    categories: [{
        type: String
      }],
    publisher: {
        _id: String,
        name: String,
        rate: Number,
        picture: {
          name: String,
          picture: {
            data: Buffer,
            contentType: String,
          }
        },
      },
    Freelancers: {
        _id: String,
        theOne: Boolean,
        name: String,
        rate: Number,
        letter: String,
        picture: {
          name: String,
          picture: {
            data: Buffer,
            contentType: String,
          }
        },
    }

  });

  export const JobsModel = mongoose.model('Job', JobSchema);
  