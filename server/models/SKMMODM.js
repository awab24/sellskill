  import mongoose from "mongoose";
  
  const schema = mongoose.Schema;
  const SkMMODMSchema = new schema({
    
 
    name: String,
    email: String
  });

  export const SkMMODMModel = mongoose.model('SKMMODM', SkMMODMSchema);
  