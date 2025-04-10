import mongoose from "mongoose";


const schema =  mongoose.Schema
const ProviderSchema = new schema({
  _id: String,
    name: String, 
    surname: String, 
    email: String, 
    password: String, 
    confirmPassword: String,
    letter: String,
    ///////////////////////////////////
    instructorDescription: String,
    allowedToUpload: Boolean,
    instructorLevel: String,
    worlds: [{
        WorldDescription: String,
        levels: [{

            level: [{
                levelNumber: Number,
                levelDescription: String,
                lessons: [{
                    lessonNumber: Number,
                    lessonDescription: String,
                    lessonResource: {
                      type: String
                    }
                }]
            }],

        }]
    }],
    ////////////////////////////////////////////
    ratePerHour: Number,
    proposal: String,
    paypalAccessToken: String,
    paypalRefreshToken: String,
    paypal_email:   String , 
    invitaions: [{
      invitaion: {
        clientId: String,
        invitorClientName: String,
        invitaionContent: String,
        acceptance: Boolean,
      }
    }

    ],
    reports: [
      {
        report:{
          clientName: String,
          clientEmail: String,
          report: String
        }
      }
    ],
    newReportNotification: Boolean,
    newInvite: Boolean,
    newMessage: Boolean,
    messages: [{

      message: {

      _id: String,
      clientId: String,
      providerId: String,
      name: String,
      message: String,
      response: Boolean,
    }}],
    picture:{
      name: String,
      picture: {
        data: Buffer,
        contentType: String,
      }
   
    }, 
    categories: [{
        type: String
    }],
    pdfCertifications:[
      {
        name: String,

        pdfCertificateId: String,
        pdfCertificate: {
          data: Buffer,
          contentType: String,
          id: String,
        }
        
      }
    ]
,
    pdfExperiences: [
      {
        name: String, 
 
        pdfExperienceId: String,
        pdfExperience: {
          data: Buffer, 
          contentType: String,
          id: String,
        }
      }
    ]
,
    imageCertifications:
     [
      {
        name: String,

        imageCertificateId: String,
        imageCertificate: {
          data: Buffer,
          contentType: String,
          imageCertificationId: String,
        }
        
       }
    ]
    
    ,
    imageExperiences:
    [
      {
        name: String,
        imageExperience: {
          data: Buffer, 
          contentType: String,
          id: String,
        }
      }
    ]
,
    blog: 
      {
        name: String,
        picture: {
          data: Buffer,
          contentType: String,

        }
 
      }

    ,
    videoPrevExperience:{
     data: Buffer,
     contentType: String,
     filename: String
    }, 
    photoPrevExperience:{
     data: Buffer,
     contentType: String
    },
    linkPrevExperiences: [{
      providerId: String,
      prevExperienceId: String,
      linkPrevExperience: String,
      
    }],
    coursesToSell: [
     {
       title: String,
       price: Number,
       description: String,
       video: {
         data: Buffer,
         contentType: String
        }
     }
  ],
 

})

export const ProviderModel = mongoose.model('provider', ProviderSchema)
