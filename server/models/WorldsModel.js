////***ALL SHOULd BE INSIDE INSTRUCTOR */
//world
//instructor world
//levels, students and subteachers
//lessons
import mongoose from "mongoose";

const schema = mongoose.Schema;
const WorldsSchema = new schema({
  //this model is only responsible for showing the model in the VERY FIRST PAGE
    //this model is only responsible for showing the model in the VERY FIRST PAGE
      //this model is only responsible for showing the model in the VERY FIRST PAGE
        //this model is only responsible for showing the model in the VERY FIRST PAGE
          //this model is only responsible for showing the model in the VERY FIRST PAGE
            //this model is only responsible for showing the model in the VERY FIRST PAGE
              //this model is only responsible for showing the model in the VERY FIRST PAGE
                //this model is only responsible for showing the model in the VERY FIRST PAGE
                  //this model is only responsible for showing the model in the VERY FIRST PAGE
                    //this model is only responsible for showing the model in the VERY FIRST PAGE
                    

    _id:String,
      publisherId : String,
      published: Boolean,
      draft: Boolean,
      cashGenerated: Number,
      category: [{type: String}], 
      dateOfPublish: Date,
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
      isWorldAllowingAdvisors: Boolean,
      isWorldAllowingExamers: Boolean,

      worldName: String,
      price: Number,
      advisorAmount: Number,
      isGraduated: Boolean,
      allowAdvisors: Boolean,
      examers:[{
        _id: String,
        price: Number,
        name: String,
        surname: String,
        isAvailable: Boolean
      }],
      
      examsssssssssssssssss: [{
        _id : String,
 
        price: Number,
        levelId: String,
        type: String,
        haveExam: Boolean,
        willAllowYouToBeAdvisor: Boolean,
        examers: [{

        }],
        applyers: [{

        }],


      }],
      comments: [{
        _id: String,
        comment: String,
        //commenter
        commenter: [{
          _id: String,
          
          name: String,
          picture: {
            name: String,
            picture: {
              data: Buffer,
              contentType: String,
            }
          },
        }],

      }],
      rates: [{
        _id: String,
        rate: Number,
        //rater
        rater: {
          _id: String,
          name: String,
          picture: {
            name: String,
            picture: {
              data: Buffer,
              contentType: String,
            }
          },
        }
      }],

//posts 
        posts: [
    {      
      _id: String,
      title: String,
      thumbnail: String,
      description: String,
      worldId: String,
      levelId: String,
      poster: {
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
      photos: [{
        contentUrl: String, // Firebase URL for photos
        order: Number
      }],
      videos: [{
        contentUrl: String, // Firebase URL for videos
        order: Number,
      }],
      texts: [{
        text: String,
        order: Number
      }], // Store text directly
      pdfs: [{
        contentUrl: String, // Firebase URL for videos
        order: Number,
      }],
      quizs: [{
        question: String,
        order: Number,
        choices: [String],
        correctAnswer: String
      }],

      likers: [{
        _id: String,
        
        name: String,
        picture: {
          name: String,
          picture: {
            data: Buffer,
            contentType: String,
          }
        },
      }],
      comments: [{
        _id: String,
        comment: String,
        //commenter
        commenter: [{
          _id: String,
          
          name: String,
          picture: {
            name: String,
            picture: {
              data: Buffer,
              contentType: String,
            }
          },
        }],

      }],

      rates: [{
        _id: String,
        rate: Number,
        //rater
        rater: {
          _id: String,
          name: String,
          picture: {
            name: String,
            picture: {
              data: Buffer,
              contentType: String,
            }
          },
        }
      }],
      //title
      //thumbnail
     // poster
          //attchements: 
    }
  ],
      students: [{
        _id: String,
        studentName: String,
        rate: Number,
        levelId: String,
        picture: {
          name: String,
          picture: {
            data: Buffer,
            contentType: String,
          }
        },
      }],
      advisors: [
        {

       
          _id: String,
          title: String,
          description: String,
          
          price: Number,
          originAdvisorId: String,
          originaAdvisorName: String,
          studentToBeAdvisorName: String, //which the advisor in this case
          studentToBeAdvisorSurname: String,
          isAvailable: Boolean,

          
          requested: Boolean,
          acceptedRequest: Boolean,
          invited: Boolean,
          invitedAccept: Boolean
          
        }
      ],
      worldTrailer: {
        photos: [{
          contentUrl: String, // Firebase URL for photos
          order: Number
        }],
        videos: [{
          contentUrl: String, // Firebase URL for videos
          order: Number,
        }],
        texts: [{
          text: String,
          order: Number
        }], // Store text directly
      },
      worldThumbnail: {
        data: Buffer,
        contentType: String,
      },
      worldDescription: String,
      yourStudents: [
        {
          
        }
      ],
      yourSubTeachers: [{
  
      }],
      levels: [{
        _id: String, // Auto-generated unique identifier for each level
        isItGraduationLevel: Boolean,
        isOpen: Boolean,
        levelNumber: Number,
        published: Boolean,
        draft: Boolean,
        levelTitle: String,
        levelDescription: String,
        isLevelCompleted: Boolean,
        isPassedLevelExam: String,
        examLink: String,
        grade: Number,
        toBeAnAdvisorLevel : Boolean,
        certificate: {
          name: String,
          data: Buffer, // Binary data for the image
          contentType: String, // MIME type (e.g., 'image/png')
        },
        levelTrailer: [{
          photos: [{
            contentUrl: String, // Firebase URL for photos
            order: Number
          }],
          videos: [{
            contentUrl: String, // Firebase URL for videos
            order: Number,
          }],
          texts: [{
            text: String,
            order: Number
          }], // Store text directly
        }],
        lessons: [{
          _id: String,
          lessonNumber: Number,
          lessonTitle: String,
          published: Boolean,
          draft: Boolean,
          lessonDescription: String,
          isLessonCompleted: Boolean,
          photos: [{
            contentUrl: String, // Firebase URL for photos
            order: Number
          }],
          videos: [{
            contentUrl: String, // Firebase URL for videos
            order: Number,
          }],
          texts: [{
            text: String,
            order: Number
          }], // Store text directly
          pdfs: [{
            contentUrl: String, // Firebase URL for videos
            order: Number,
          }],
          quizs: [{
            question: String,
            order: Number,
            choices: [String],
            correctAnswer: String
          }]
        }]
      
    }],


})
export const WorldsModel = mongoose.model('worlds', WorldsSchema)