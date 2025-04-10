  import mongoose from "mongoose";
  
  const schema = mongoose.Schema;
  const CategoriesSchema = new schema({
    worldsCategories : [{
        type: String
    }],
    SkillerCategories : [{
        type: String
    }]
  });

  export const CategoriesModel = mongoose.model('categorey', CategoriesSchema);
  