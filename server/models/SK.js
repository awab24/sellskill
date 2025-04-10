  import mongoose from "mongoose";
  
  const schema = mongoose.Schema;
  const SkSchema = new schema({
    name: String,
    email: String
  });

  export const SkModel = mongoose.model('SK', SkSchema);
  