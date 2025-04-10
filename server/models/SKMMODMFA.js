  import mongoose from "mongoose";
  
  const schema = mongoose.Schema;
  const SkMMODMFASchema = new schema({
    
 
    name: String,
    email: String
  });

  export const SkMMODMFAModel = mongoose.model('SKMMODMFA', SkMMODMFASchema);
  