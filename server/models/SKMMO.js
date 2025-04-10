  import mongoose from "mongoose";
  
  const schema = mongoose.Schema;
  const SkMMOSchema = new schema({
    
 
    name: String,
    email: String
  });

  export const SkMMOModel = mongoose.model('SKMMO', SkMMOSchema);
  