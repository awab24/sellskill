import mongoose from "mongoose";


const schema =  mongoose.Schema;
const PostSchema = new schema({

   _id: String,
   worldId: String,
   levelId: String,
   //poster
   poster: {
     _id: String,
     name: String,
     picture: {
       name: String,
       picture: {
         data: Buffer,
         contentType: String,
       }
     },
   iAmThePublisher: Boolean,//4 world
   iAmAnAdvisor: Boolean},



   title: String,
   thumbnail: String,
   //media
   attachments: [{

     photos: [{
       contentUrl: String, // Firebase URL for photos
       order: Number
     }],
     videos: [{
       contentUrl: String, // Firebase URL for videos
       order: Number,
     }],
     pdfs: [{
       contentUrl: String, // Firebase URL for videos
       order: Number,
     }],
     texts: [{
       text: String,
       order: Number
     }], // Store text directly
     quizs: [{
       question: String,
       order: Number,
       choices: [String],
       correctAnswer: String
     }]

   }],




   
   //likes
   likes: [{
     _id: String,
     liker: {
       name: String,
       picture: {
         name: String,
         picture: {
           data: Buffer,
           contentType: String,
         }
       },
     }}
   ],
   //comments
   comments: [{
     _id: String,
     //commenter
     commenter: {
       _id: String,
       name: String,
       picture: {
         name: String,
         picture: {
           data: Buffer,
           contentType: String,
         }
       },
     },
     comment: String
   }]

 })

export const PostsModel = mongoose.model('post', PostSchema)