  import mongoose from "mongoose";
  
  const schema = mongoose.Schema;
  const SkTsWebdevSchema = new schema({
    name: String,
    email: String
  });

  export const SkTsWebdevModel = mongoose.model('SKTsWebdev', SkTsWebdevSchema);
  