  import mongoose from "mongoose";
  
  const schema = mongoose.Schema;
  const SkillerSchema = new schema({
     
    _id: String,
    name: String, 
    surname: String, 
    FcmToken: String,
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,

    requestsToBeAdvisor: {
      _id: String,
      coverLetter: String,
      worldId: String,
      skillerWantToBeAdvisorId: String
    },
 
    coverPicture: {
      name: String,
      picture: {
        data: Buffer,
        contentType: String,
      }
    },
    picture: {
      name: String,
      picture: {
        data: Buffer,
        contentType: String,
      }
    },
    rate: Number, //it will be displayed as stars
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

 

    raters: [{
      rate: Number,
      rater:{
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
      }
    ],
    mates: [{
      _id: String,
      pending: Boolean,
      accepted: Boolean,
      refused: Boolean,
      sender: Boolean,
      receiver: Boolean,
      mateId: String
    }],
    totalCash: Number,  
definingVideo: String,
letter: String,
realWorldResults: [{
  _id: String,
  title: String,
  thumbnail: String,
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
}],
joinedAt: Date,







    email: String, 
    token: String,
    password: String, 






    withdrawHistory:[ {
      _id: String,
      amount: Number,
      date: Date
    }],
    cash:[ {
      _id: String,
      date: Date,
      amount: Number,
      buyer: Boolean,
      seller: Boolean,
      advisor: Boolean,
      sender: {
        _id: String,
        name: String
      },
      receiver: {
        _id: String,
        name: String
      },
      world: {
        _id: String,
        published: Boolean,
        name: String
      }

    }],

    confirmPassword: String,
    newNotification: Boolean,
    newExam: Boolean,
    newMessage: Boolean,
    newCertification: Boolean,
    newEarning: Boolean,
    myCart: [{
      _id: String
    }],
    myPosts: [{
      _id: String
    }],
    posts: [{
      _id: String
    }],

    savedPosts: [{

      _id: String,
     
    }],









    followers: [{
      _id: String,
      followerName: String,
      followerPicture: String,
      
    }],
    following: [{
      _id: String,
      followerName: String,
      followerPicture: String,
      
    }],
    myAllAdvisors: [{
      _id: String,
      worldName: String,
      levelNumber: Number,
      examGrade: Number
    }],
    iAmAnAdvisorAt: [{
      _id: String,
      myRateOnThisWorld: Number,
      worldName: String,
      cashIMadeFromThatWorld: Number,
      iAmAnAdvisorInThisWorldSince: Date
    }],
    myStudents: [{
      _id: String,
      studentName: String,
      worldId: String,
      levelId: String,
      rate: Number,
      direct: Boolean

    }],
    ///////////////////////////////////
    instructorDescription: String,
    allowedToUpload: Boolean,
    instructorLevel: String,
    canDoDirectEx: Boolean,

    exams: [{
      _id: String,  
      title: String,
      worldName: String,
      levelNumber: Number,
      worldId: String,
      isWorldAllowingAdvisors: Boolean,
      levelId: String,
      iamInstructor: Boolean,
      //if is exam started then enable setting grade 
      isStarted: Boolean,
      //in the controller of grade set exam 
      //1_to ended 2_ make certification 3_grade and rate 4_add to advisors if this level is the graduation level 5_add cash 
      isEnded: Boolean,
      studentId: String,
      studentName: String,
      instructorId: String,
      instructorName: String,
      examTitle: String,
      examTime: Date,
      examLink: String,
      grade: Number,
      isGraded: Boolean,
      isApproved: Boolean,
      tryNumber: Number,
      isPassed: Boolean,
      isGraduationLevel: Boolean,
      comment: String,
      cashPerPass: Number, 
      examWillBeAs: String,
      passingGrade: Number
    }],

    certifications: [{
      _id: String,
      examId: String,
      worldId: String,
      levelId: String,
      name: String,
      data: Buffer, // Binary data for the image
      contentType: String, // MIME type (e.g., 'image/png')

    }],

    
    notificationsss: [ {
      _id: String,
      typeee: String,
      ///for world s
      title: String,
      content: String,
      requestId: String,
      readed: Boolean,
 
    }],

    messages: [ {
      _id: String,
      withId: String,
      ///for world s
      worldId: String,
      levelId: String,
      student: Boolean,
      advisor: Boolean,
      readed: Boolean,
      //for world e
      senderId: String,
      senderName:String,
      response: Boolean,
      content: String,
      document: String
    }],

 


    requestExamStudents: [{
      _id: String,
      studentId: String,
      studentName: String,
      time: Date,
      isRequestApproved: Boolean
    }],
    // approvedExamStudent: [{
    //   studentId: String,
    //   studentName: String,
    //   time: Date,
    // }],
    examsIWillSitFor: [{
      _id: String,
      examLink: String,
      worldName: String,
      level: Number,
      advisorId: String,
      advisorName: String,
      time: String,
      isApproved: Boolean

    }],
    examsIWillGive: [{
      _id: String,
      examLink: String,
      studentId: String,
      studentName: String,
      worldName: String,
      level: Number,
      time: String,
      isApproved: Boolean
    }],
    mySubTeachers: [
      {
      studentId: String,
        studentName: String
      }
    ],
    generalLevel:Number,
    joinedAt: Date,
    participateIn: [{//for the projects that will be done in sk
      projectName: String
    }],
    worldsSubscribedIn: [{
      worldIds: String
    }],

    myAdvisors: {
      _id: String,
      worldId: String,
      levelId: String
    
    },


    worlds: [{
      _id: String, // Auto-generated unique identifier for each world
      skillerId: String,
      cashGenerated: Number,
      published: Boolean,
      draft: Boolean,
      price: Number,
      advisorAmount: Number,
      dateOfPublish: Date,
      publisherId: String,
      allowAdvisors: Boolean,
      isWorldAllowingAdvisors: Boolean,
      publisher: Boolean, 
      student: Boolean,
      publisherr: {
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
      worldThumbnail: {
        data: Buffer,
        contentType: String,
      },
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
      
      myCurrentAdvisorId: String,
      myAllWorldAdvisors: [{
        _id: String,
        worldId: String,
        worldName: String,
        levelNumber: Number,
        examGrade: Number
      }],
      worldName: String,
      price: Number,
      iAmA: String, //publisher, student or a advisor
      heIsThePublisher: Boolean,
      heIsAnAdvisor: Boolean,
      mySubTeachersInThisWorld:[{

      }],
      cashFromThisCourse: Number,

      youAreTeaching: [{
        studentId: String,
        studentName: String
      }],
      advisors: [
        {
          advisorId: String,
          advisorName: String,
          advisorLevel: String
        }
      ],
      worldTrailer: [{
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
      worldThumbnail: {
        data: Buffer,
        contentType: String,
      },
      worldDescription: String,

      yourSubTeachers: [{

      }],


      levels: [{
        _id: String, // Auto-generated unique identifier for each level
        myCurrentAdvisorId: String,
        isItGraduationLevel: Boolean,
        published: Boolean,
        draft: Boolean,
        isOpen: Boolean,
        levelNumber: Number,
        levelTitle: String,
        levelDescription: String,
        toBeAnAdvisorLevel: Boolean,
      
        isLevelCompleted:{ type: Boolean, default: false},
        isPassedLevelExam: Boolean,
        myAdvisorId: String,
        iAmA: String,

        studentInfo:[{ 
        studentId: String,
        grade: Number,

        certificate: {
          name: String,
          data: Buffer, // Binary data for the image
          contentType: String, // MIME type (e.g., 'image/png')
        }
      }],

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
        }]
      }]
    }],
    paypalAccessToken: String,
    paypalRefreshToken: String,
    paypal_email: String, 
    invitations: [{
      invitation: {
        clientId: String,
        invitorClientName: String,
        invitationContent: String,
        acceptance: Boolean,
      }
    }],
    reports: [{
      report: {
        clientName: String,
        clientEmail: String,
        report: String
      }
    }],
    newReportNotification: Boolean,
    newInvite: Boolean,

    categories: [{
      type: String
    }],
    pdfCertifications: [{
      contentUrl: String,
      title: String,
      descriptioin: String,
      _id: String
    }],
    imageCertifications: [{
      contentUrl: String,
      title: String,
      descriptioin: String,
      _id: String
    }],
    pdfExperiences: [{
      contentUrl: String,
 
    }],

    imageExperiences: [{
      contentUrl: String,
 
    }],
    blog: {
      name: String,
      picture: {
        data: Buffer,
        contentType: String,
      }
    },
    videoPrevExperience: {
      data: Buffer,
      contentType: String,
      filename: String
    }, 
    photoPrevExperience: {
      data: Buffer,
      contentType: String
    },
    linkPrevExperiences: [{
      providerId: String,
      prevExperienceId: String,
      linkPrevExperience: String,
    }],
    // coursesToSell: [{
    //   title: String,
    //   price: Number,
    //   description: String,
    //   video: {
    //     data: Buffer,
    //     contentType: String
    //   }
    // }]
  });

  export const SkillerModel = mongoose.model('skiller', SkillerSchema);
  



   