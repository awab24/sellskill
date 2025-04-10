import mongoose from "mongoose";



const schema =  mongoose.Schema;
const ClientSchema = new schema({
  _id: String,
    name: String, 
    surname: String, 
    email: {type: String,
        required: true,
        unique: true,
    }, 
    password: String, 
    confirmPassword: String,
    picture:{
        name: String,
           picture: {
          data: Buffer,
          contentType: String,
        }
     
      }, 
      newMessage: Boolean,
    messages: [{message: {
        providerId: String,
        clientId: String,
        _id: String,
        name: String,
        message: String,
        response: Boolean
      }}],
      invitationAcceptances: 
      [{
        invitationAcceptance: {
          clientId: String,
          providerId: String,
          providerName: String,
          providerEmail: String,

        }
      }
      
      ],
      newInvitationAcceptance: Boolean,
   incomingProviders:[
 {  incomingProvider:{
  _id: String,
  providerName: String,
  providerEmail: String,
  // providerProfile: {
  //     name: String,
  //     providerProfile: {
  //         data: Buffer,
  //         contentType: String
  //     }
  // },

 }}  ],
 newProposal: Boolean,
   proposals: [{
    _id: String,
    proposalId: String,
    proposal: String,
}],
categories: [{
  type: String
}],   
paidFacebookAds: Boolean,
paidPSCourse: Boolean,
paidYTCourse: Boolean,
paidTRCourse: Boolean,
paidKillerFacebookAdsEbook: Boolean,
paidTradingCourse: Boolean,
paidDropshippingCourse: Boolean,
paidEmailMarketingCourse: Boolean,
paidSeoCourse: Boolean,
paidDigitalMarketingCourse: Boolean,


  //crypto data
  CRCompleted: Boolean,
  paidCrypto: Boolean,
  CRW1V1Completion: Boolean,
  CRW1V2Completion: Boolean,
  CRCompleted: Boolean,
  certificate: {
    name: String,
    data: Buffer, // Binary data for the image
    contentType: String, // MIME type (e.g., 'image/png')
  },
  isPaidNewMoney: Boolean,

        //make it as a list every element on it contain proposalId and proposal itself

        
  
        


})

export const ClientModel = mongoose.model('client', ClientSchema)
