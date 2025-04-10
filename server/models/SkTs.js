  import mongoose from "mongoose";
  
  const schema = mongoose.Schema;
  const SkTsSchema = new schema({
    name: String,
    email: String
  });

  export const SkTsModel = mongoose.model('SKTs', SkTsSchema);
  