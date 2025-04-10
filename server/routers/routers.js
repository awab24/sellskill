import express from 'express'
import cors from 'cors'
import { handleClientSignIn, handleClientSignUp, handleProviderSignUp, verify, insertPost, getPosts, insertCategory, insertLetter, insertPicture,  addRate, getProfileData, getProfilePicture, insertImageCertificate, insertPdfCertificate, getProfileIMAGE, getProfilePDF, handleProviderSignIn, insertPdfExperience, insertImageExperience, getImageExperience, getPdfExperience, insertProviderToClient, getProviderData, submitProposal, getProposals, getProposalId,  sendMessageFromClientToProvider, getMessagesFromClientIntoProvider, sendProviderIdToFront,  sendProviderToClientMessage, getProviderToClientMessagesInClient,  deleteImageCertificate, deletePdfCertificate, deletePdfExperience, deleteImageExperience, showClientPosts, sendProviderOrClientId, deletePost, deleteProviderMessage, deleteClientMessage, sendInvite, getInvitations, getInvitationContent, sendChoosenInvitationId, getReport, insertReport, deleteBlog, getBlog, addBlog, checkClientNewMessages, cancelClientNewMessages, checkProviderNewMessages, cancelProviderNewMessages, cancelProviderNewInvites, checkProviderNewInvites, checkClientNewProposals, cancelClientNewProposals, insertClientPicture, getClientProfilePicture, getClientProfileData, insertClientCategory, getRelatedProviders, insertPaypalEmail, getProfilePDF4Client, getExperienceIMAGE4Client, getBlog4Client, getProfileData4Client, getProfilePicture4Client, getReport4Client, insertInviteAcceptance, getInvitationAcceptance, checkNewInvitationAcceptanceState, killNewInvitationAcceptanceNotification, checkNewReportNotification, killNewReportNotification, purchaseCourse, paidCrypto, checkIfPaid, checkIfPaidFacebookAds, paidFacebookAds, sendCustomerEmail, paidPSCourse, checkIfPaidPSCourse,paidYTCourse, checkIfPaidYTCourse,paidTRCourse, checkIfPaidTRCourse, CheckCryptoW1V2Completion, CryptoW1V2Completion, cryptoProgress, setCryptoCompleted, getCryptoCompletion, generateCertificateForCrypto, getClientId, uploadCertificateWithName, getCryptoCertificate, sendFAADCustomerEmail, checkIfPaidNewMoney, paidNewMoney, sendCodingCustomerEmail, uploadCourse, createInstructor, handleSkillerSignIn, handleSkillerSignUp, getWorlds, addWorld, addLevel, getLevels, getLessons, getResources, uploadTrailer, getTrailer, uploadLevelTrailer, getLevelTrailer, setLessonCompleted, showAvailableAdvisors, mySubscriptions, sendExamRequestFromStudent, getAllWorlds, getWorldPrice, isPaidWorld, paidWorld, sendWorldMessage, getWorldMessage, setLevelCompleted, setExamLinkToBoth, getSkillerProfileData, getSkillerProfilePicture, sendPayment, getMessages1, getMessages2, sendMessages, sendNotification1, getNotification1, getNotification2, startExam, getAdvisorId, insertAdvisor, getAdvisors, chooseAdvisor, ASendSA, AGetS, AGetA1, AGetA2, AsendAS, wGet1, wGet2, wSend, getAllExam1, setExamTime, setExamLink, getExams4Advisor, getExams4Student, setAdvisorToAvailable, rateAdvisor, setExamPassed, setExamGrade, allowAdvisorsForWorld, dontAllowAdvisorsForWorld, setExamNotPassed, setTimeLinkPassingGExamType, sendGradeComment, getProfile, getAttachments, rateWorld, commentWorld, getMates, getCertification, myEarning, myRate, addToCart, getCart, deleteWorldFromCart, getMoneyInHistory, getMoneyOutHistory, getWithdrawMoneyHistory, getTotalCash, getWorld, getLesson, getLevel, getMyWorlds, updateName, editLesson, changeLevelTitle, changeLevelDescription, changeAllowAdvisor, changeWorldThumbnail, changeWorldPrice, changeWorldName, changeNameSurname, checkPastPass, updatePassword, WgetPosts, WaddPost, AGetMates, sendMateRequest, getMateRequests, getAcceptedMates, acceptMateRequest, uploadCoverPhoto, uploadRealWorldResults, deleteLevel, uploadDefiningVideo, updateProfilePicture, deleteProfilePicture, getRealWorldResult, deleteDefiningVideo, deleteLetter, editLevel, editLessonn, deleteLesson, editResources, WuploadPost, WeditPost, getCertainPost, WdeletePost, AgetPosts, ASgetPosts, ASVgetPosts, savePost, unSavePost, SgetProfile, checkIsPaidWorld, publishWorld, getPublishedStatus, getWorldForEdit, editWorld, setWorldPublished, PaddWorld, getMyDrafts, setLevelPublished, setLessonPublished, getSkillerId, getMyCurrentAdvisorId, getToBeAdvisorPermission, setAdvisorToUnAvailable, getWorldName, getLevelTitleAndNumber, setWorldIdInBack, getOnlyPublishedLevels, getOnlyPublishedLessons, ratePublisher, getLessonCompleted, getMyAdvisors, getMyNDStudents, getMyDStudents, getCategoriesForFilterWorlds, getCategoriesForFilterSkillers, getSkillerCoverPicture, updateCoverPicture, deleteCoverPicture, checkIsAlreadyRateWorld, checkIsAlreadyRateSkiller, getWorldsForGetAllWorlds, getLevelsForgetOnlyPublishedLevels, getLessonsForGetOnlyPublishedLessons, getWorldComments, LeadsSkMMODMFA, getSkillersIds, LeadsTsWebDev, SocialLinks, getWorldsIamAdvisorAt, getWorldsForProfile, getImageCertifications, getPdfCertifications, getCertifications, getMProfile, toggleAdvisorStatus, getAllSkillers, uploadJob, getAllJobs, sendProposalLetter, getUploadedJobs, setPropsalAccepted, getAllProposals, getAdvisorPriceNameWorldName, getExamerPriceNameWorldName, getExamers, changeAdvisorPrice, setNotificationReaded, getNumberOfUnreadedNotifications, getAdvisorsAndExamersLength, getEmployees, getNumberOfUnReadedMessages, sendWelcomeNotification, getWithNameAndPicture, setAllMessagesToReaded, getMateRequestss, getAcceptedMatess, refuseMate, LgetAllSkillers, deleteSkiller, getAcceptedMatessLength, sendAdvisorReq, acceptAdvisorReq, sendInviteToSkiller, acceptAdvisorInvitation, getPostResources, addCommentToPost, handleSellerSignUp, handleCustomerSignUp, getSeller} from '../controllers/controllers.js'

import { createCourse } from '../controllers/controllers.js'
// import { uploadVideos } from '../controllers/controllers.js'

import multer from 'multer';

const storage = multer.memoryStorage(); // Use memory storage for now to test
const upload = multer({ storage: storage });
// import uploadMulterAWS from '../middlewares/s3Uploader.js'
// import AWS from 'aws-sdk';  

const router = express.Router()
router.post('/api/endpoints/skillerSignUp', cors(), handleSkillerSignUp)//1
router.post('/api/endpoints/skillerSignIn', cors(), handleSkillerSignIn)//2
router.post('/api/endpoints/category',  cors(), insertCategory)//3
router.post('/api/endpoints/insertSkillerImageCertificate', cors(), insertImageCertificate)//4
router.post('/api/endpoints/insertSkillerPdfCertificate', cors(),upload.single('pdf'), insertPdfCertificate)//5
router.post('/api/endpoints/insertSkillerPicture', cors(),upload.single('picture'), insertClientPicture)//6
router.post('/api/endpoints/uploadCoverPhoto', cors(),upload.single('coverPhoto'), uploadCoverPhoto)//7
router.post('/api/endpoints/insertSkillerLetter', cors(), insertLetter)//8
router.post('/api/endpoints/addWorld',upload.single('thumbnail'), cors(), addWorld)//9
router.post('/api/endpoints/PaddWorld',upload.single('thumbnail'), cors(), PaddWorld)//10
router.patch('/api/endpoints/editWorld',upload.single('thumbnail'), cors(), editWorld)//11
router.get('/api/endpoints/getWorldForEdit', cors(), getWorldForEdit)//12
 
router.get('/api/endpoints/getWorldTrailer', cors(), getTrailer)//13

router.patch('/api/endpoints/setLevelPublished', cors(), setLevelPublished)//14

router.patch('/api/endpoints/editLevel', cors(), editLevel)//15
router.get('/api/endpoints/getLevels', cors(), getLevels)//16
router.get('/api/endpoints/getWorldName', cors(), getWorldName)//17
router.post('/api/endpoints/addLevel', cors(), addLevel)//18
router.delete('/api/endpoints/removeLevel', cors(), deleteLevel)//19
router.patch('/api/endpoints/editLesson', cors(), editLessonn)//20
router.patch('/api/endpoints/setLessonPublished', cors(), setLessonPublished)//21
router.get('/api/endpoints/getLessons', cors(), getLessons)//22
router.get('/api/endpoints/getLevelTitleAndNumber', cors(), getLevelTitleAndNumber)//23
router.post('/api/endpoints/uploadCourse', cors(), uploadCourse)//24
router.delete('/api/endpoints/removeLesson', cors(), deleteLesson )//25
router.get('/api/endpoints/getResources', cors(), getResources)//26
router.patch('/api/endpoints/editResources', cors(), editResources)//27
router.patch('/api/endpoints/setWorldPublished', cors(), setWorldPublished)//28
router.get('/api/endpoints/getAllWorlds', cors(), getAllWorlds)//29
router.patch('/api/endpoints/changeAdvisorPrice', cors(), changeAdvisorPrice)//30
router.get('/api/endpoints/getNumberOfUnReadedMessages', cors(), getNumberOfUnReadedMessages)//31
router.get('/api/endpoints/getNumberOfUnreadedNotifications', cors() , getNumberOfUnreadedNotifications )//32
router.get('/api/endpoints/getCategoriesForFilterWorlds', cors(), getCategoriesForFilterWorlds)//33
router.get('/api/endpoints/getWorldComments', cors(), getWorldComments )//34
router.get('/api/endpoints/getAllSkillers', cors(), getAllSkillers)//35
router.post('/api/endpoints/sendMateRequest', cors(), sendMateRequest)//36
router.get('/api/endpoints/chats1', cors(), getMessages1)//37
router.post('/api/endpoints/SocialLinks', cors(), SocialLinks)//38
router.get('/api/endpoints/getSkillerCoverPicture', cors(), getSkillerCoverPicture )//39
router.delete('/api/endpoints/deletetSkillerLetter', cors(), deleteLetter)//40
router.post('/api/endpoints/uploadVideo', cors(),uploadDefiningVideo )//41
router.get('/api/endpoints/getMProfile', cors(), getMProfile)//42
router.get('/api/endpoints/getWorldsForProfile', cors(), getWorldsForProfile)//43
router.get('/api/endpoints/worldsThatIamAdvisorOn', cors(), getWorldsIamAdvisorAt)//44
router.get('/api/endpoints/getCertifications', cors(), getCertifications)//45
router.delete('/api/endpoints/deleteVideo', cors(),deleteDefiningVideo )//46
router.delete('/api/endpoints/deleteCoverPicture', cors(), deleteCoverPicture )//47
router.get('/api/endpoints/checkPastPass', cors(), checkPastPass)//48
router.patch('/api/endpoints/changeNameSurname', cors(), changeNameSurname)//49
router.patch('/api/endpoints/updateProfilePicture', cors(), upload.single('picture'), updateProfilePicture)
router.patch('/api/endpoints/updateCoverPicture', cors(), upload.single('coverPicture'), updateCoverPicture)
router.delete('/api/endpoints/deleteProfilePicture', cors(), deleteProfilePicture )
router.patch('/api/endpoints/toggleAdvisorStatus', cors(), toggleAdvisorStatus)//53
router.get('/api/endpoints/getCategoriesForFilterSkillers', cors(), getCategoriesForFilterSkillers)//54
router.post('/api/endpoints/uploadJob', cors() , uploadJob)//55
























router.post('/api/endpoints/clientSignIn',cors(), handleClientSignIn )
router.post('/api/endpoints/providerSignIn',cors(), handleProviderSignIn )
router.post('/api/endpoints/clientSignUp', cors(), handleClientSignUp)
router.post('/api/endpoints/providerSignUpData',cors(), handleProviderSignUp)
router.post('/api/endpoints/insertPost', cors(), insertPost)
router.get('/api/endpoints/getPosts', cors(), getPosts)
// router.post('/api/endpoints/category', cors(), insertCategory)
router.post('/api/endpoints/insertLetter', cors(),insertLetter )
router.post('/api/endpoints/insertPicture', cors(),upload.single('picture'), insertPicture)
router.post('/api/endpoints/insertImageCertificate', cors(), insertImageCertificate)
router.post('/api/endpoints/insertPdfCertificate', cors(), insertPdfCertificate)
router.post('/api/endpoints/addRate', cors(), addRate)
router.get('/api/endpoints/getProfileData', cors(), getProfileData)
router.get('/api/endpoints/getProfilePicture', cors(), getProfilePicture)
router.get('/api/endpoints/getProfileIMAGE', cors(),getProfileIMAGE )
router.get('/api/endpoints/getProfilePDF', cors(), getProfilePDF)
router.post('/api/endpoints/insertPdfExperience', cors(),upload.single('experiencePdf'), insertPdfExperience)
router.post('/api/endpoints/insertSkillerPdfExperience', cors(),upload.single('experiencePdf'), insertPdfExperience)
router.post('/api/endpoints/insertSkillerImageExperience', cors(),upload.single('experienceImage'), insertImageExperience)
router.get('/api/endpoints/getExperienceIMAGE', cors(), getImageExperience)
router.get('/api/endpoints/getExperiencePDF', cors(), getPdfExperience)
router.post('/api/endpoints/insertProviderToClient/:id', cors(), insertProviderToClient)
router.get('/api/endpoints/incomingProviderData', cors(), getProviderData)
router.post('/api/endpoints/submitProposal', cors(), submitProposal)
router.get('/api/endpoints/getProposals',cors(), getProposals )
router.post('/api/endpoints/proposalId/:id', getProposalId)
router.post('/api/endpoints/sendMessageFromClientToProvider/:id', cors(), sendMessageFromClientToProvider)
router.get('/api/endpoints/getMessagesFromClientIntoProvider', cors(), getMessagesFromClientIntoProvider)
router.post('/api/endpoints/sendProviderIdToFront', cors() ,sendProviderIdToFront)
router.post('/api/endpoints/sendProviderToClientMessage/:id', cors(), sendProviderToClientMessage)
router.get('/api/endpoints/getProviderToClientMessagesInClient', cors(), getProviderToClientMessagesInClient)
router.get('/api/endpoints/verifyClient', cors(), verify)
router.get('/api/endpoints/verifyProvider', cors(), verify)
router.post('/api/endpoints/addBlog',cors(),upload.single('image'), addBlog)
router.get('/api/endpoints/getBlog', getBlog)
router.delete('/api/endpoints/deleteImageCertificate/:id',cors(), deleteImageCertificate)
router.delete('/api/endpoints/deletePdfCertificate/:id',cors(), deletePdfCertificate)
router.delete('/api/endpoints/deleteImageExperience/:id', cors(), deleteImageExperience)
router.delete('/api/endpoints/deletePdfExperience/:id', cors(), deletePdfExperience)
router.get('/api/endpoints/showClientPosts/:id', cors(), showClientPosts);
router.get('/api/endpoints/providerOrClientId', cors(), sendProviderOrClientId)
router.delete('/api/endpoints/deletePost/:id', cors(), deletePost)
router.delete('/api/endpoints/deleteProviderMessage/:id', cors(), deleteProviderMessage)
router.delete('/api/endpoints/deleteClientMessage/:id', cors(), deleteClientMessage)
router.post('/api/endpoints/sendInvite', cors(), sendInvite)
router.get('/api/endpoints/getInvitations', cors(),getInvitations)
router.get('/api/endpoints/getInvitationContent', cors(), getInvitationContent)
router.post('/api/endpoints/sendChoosenId/:id',cors(), sendChoosenInvitationId)
router.post('/api/endpoints/insertReport', cors(), insertReport)
router.get('/api/endpoints/getReport', cors(), getReport) 
router.patch('/api/endpoints/deleteBlog', cors(), deleteBlog)
router.get('/api/endpoints/checkClientNewMessage', cors(), checkClientNewMessages)
router.patch('/api/endpoints/cancelClientNewMessages', cors(), cancelClientNewMessages)
router.get('/api/endpoints/checkProviderNewMessages', cors(), checkProviderNewMessages)
router.patch('/api/endpoints/cancelProviderNewMessages', cors(), cancelProviderNewMessages)
router.get('/api/endpoints/checkProviderNewInvites', cors(), checkProviderNewInvites)
router.patch('/api/endpoints/cancelProviderNewInvites', cors(), cancelProviderNewInvites)
router.get('/api/endpoints/checkClientNewProposals', cors(), checkClientNewProposals)
router.patch('/api/endpoints/cancelClientNewProposals', cors(), cancelClientNewProposals)
router.post('/api/endpoints/insertClientPicture',  cors(),upload.single('picture'), insertClientPicture)
router.get('/api/endpoints/getClientProfilePicture', cors(), getClientProfilePicture)
router.get('/api/endpoints/getClientProfileData', cors(), getClientProfileData)
router.get('/api/endpoints/getSkillerProfileData', cors(), getClientProfileData)
router.post('/api/endpoints/clientCategory', cors(), insertClientCategory)
router.get('/api/endPoints/getRelatedProviders', cors(), getRelatedProviders)
router.post('/api/endpoints/insertPaypalEmail', cors(), insertPaypalEmail)
router.get('/api/endpoints/getProfileIMAGE4Client/:id', cors(), )
router.get('/api/endpoints/getProfilePDF4Client/:id', cors(), getProfilePDF4Client)
router.get('/api/endpoints/getExperiencePDF4Client/:id', cors(), getExperienceIMAGE4Client)
router.get('/api/endpoints/getExperienceIMAGE4Client/:id', cors(), getExperienceIMAGE4Client)
router.get('/api/endpoints/getBlog4Client/:id', cors(), getBlog4Client)
router.get('/api/endpoints/getProfileData4Client/:id', cors(), getProfileData4Client)
router.get('/api/endpoints/getProfilePicture4Client/:id', cors(), getProfilePicture4Client)
router.get('/api/endpoints/getReport4Client/:id', cors(), getReport4Client)
router.post('/api/endpoints/insertInviteAcceptance/:id', cors(),  insertInviteAcceptance)
router.get('/api/endpoints/getInvitationAcceptance', cors(), getInvitationAcceptance)
router.get('/api/endpoints/getNewInvitationAcceptanceState', cors(),checkNewInvitationAcceptanceState )
router.patch('/api/endpoints/killNewInvitationAcceptanceNotification', cors(), killNewInvitationAcceptanceNotification)
router.get('/api/endpoints/checkNewReportNotification', cors(), checkNewReportNotification)
router.patch('/api/endpoints/killNewReportNotification', cors(), killNewReportNotification)
router.patch('/api/endpoints/update-profile-image')
router.patch('/api/endpoints/update-lastname')
router.patch('/api/endpoints/update-name' )
router.patch('/api/endpoints/cryptoW1V2')
router.post('/api/endpoints/sendCodingCustomerInfo', cors(),sendCodingCustomerEmail )
// routes/routes.js


// Route to create a course

// Route to upload a thumbnail
// router.post('/api/endpoints/uploadThumbnail',cors(), uploadThumbnail);

// Route to upload videos
//// router.post('/api/endpoints/uploadVideos', uploadMulterAWS.array('videos', 10), uploadVideos); // Adjust file limit as needed

  
router.post('/api/endpoints/purchaseCourse/:courseId', cors(), purchaseCourse);
router.patch('/api/endpoints/paidCrypto', cors(), paidCrypto )
router.get('/api/endpoints/isPaidCrypto', cors(), checkIfPaid)
router.patch('/api/endpoints/paidFacebookAds', cors(), paidFacebookAds )
router.get('/api/endpoints/isPaidFacebookAdsCourse', cors(), checkIfPaidFacebookAds)
router.post('/api/endpoints/sendFAADCustomerInfo', cors(), sendFAADCustomerEmail)

router.patch('/api/endpoints/paidPSCourse', cors(), paidPSCourse )   
router.get('/api/endpoints/isPaidPSCourse', cors(), checkIfPaidPSCourse)
router.patch('/api/endpoints/paidYTCourse', cors(), paidYTCourse )
router.get('/api/endpoints/isPaidYTCourse', cors(), checkIfPaidYTCourse)
router.patch('/api/endpoints/paidTRCourse', cors(), paidTRCourse )
router.get('/api/endpoints/isPaidTRCourse', cors(), checkIfPaidTRCourse)
router.patch('/api/endpoints/CryptoW1V2Completion', cors(), CryptoW1V2Completion)
router.get('/api/endpoints/CheckCryptoW1V2Completion', cors(), CheckCryptoW1V2Completion)
router.get('/api/endpoints/cryptoProgress',cors(), cryptoProgress)
router.patch('/api/endpoints/setCryptoCompleted', cors(), setCryptoCompleted)
router.get('/api/endpoints/getCryptoCompletion', cors(), getCryptoCompletion)
router.get('/api/certificate/:id', cors(), generateCertificateForCrypto)
router.get('/api/endpoints/getClientId', cors(), getClientId)

router.get('/api/endpoints/getCryptoCertificate', cors(), getCryptoCertificate)
router.get('/api/endpoints/isPaidNewMoney', cors(), checkIfPaidNewMoney)
router.patch('/api/endpoints/paidNewMoney', cors(), paidNewMoney)



router.post('/api/endpoints/cryptoCertificate/upload', upload.single('picture'), uploadCertificateWithName);//

router.post("/api/endpoints/signup", createInstructor);
router.get('/api/endpoints/getWorlds', cors(), getWorlds);//
router.get('/api/endpoints/getWorlds', cors(), getAllWorlds);//





router.get('/api/endpoints/getWorlds', cors(), getWorlds)



router.post('/api/endpoints/uploadWorldTrailer', cors(), uploadTrailer)

router.post('/api/endpoints/uploadLevelTrailer', cors(), uploadLevelTrailer)
router.get('/api/endpoints/getLevelTrailer', cors(), getLevelTrailer)
router.patch('/api/endpoints/setLessonCompleted', cors(), setLessonCompleted)
router.patch('/api/endpoints/getLessonCompleted', cors(), getLessonCompleted)
router.patch('/api/endpoints/setLevelCompleted', cors(), setLevelCompleted)
// router.post('/api/endpoints/sendNotification', cors(), sendNotification)
router.get('/api/endpoints/getAvailableAdvisors', cors(), showAvailableAdvisors)
router.get('/api/endpoints/getSubscribedIn', cors(), mySubscriptions)
router.post('/api/endpoints/sendExamRequestFromStudent', cors(), sendExamRequestFromStudent)
router.post('/api/endpoints/uploadTrailer', cors(), uploadTrailer)
router.get('/api/endpoints/getPrice', cors(), getWorldPrice)
router.get('/api/endpoints/isPaidWorld', cors(), isPaidWorld)
router.patch('/api/endpoints/paidWorld', cors(), paidWorld)

router.post('/api/endpoints/sendWorldMessages', cors(), sendWorldMessage)
router.get('/api/endpoints/getWorldMessages', cors(), getWorldMessage)
router.patch('/api/endpoints/setExamLinkToBoth', cors(), setExamLinkToBoth)





router.get('/api/endpoints/getSkillerProfileData', cors(), getSkillerProfileData)
router.get('/api/endpoints/getSkillerProfilePicture', cors(), getSkillerProfilePicture)

router.post('/api/endpoints/send-payment', cors(), sendPayment)

router.get('/api/endpoints/studentChats1', cors(), )
router.get('/api/endpoints/chats2', cors(), getMessages2)
router.get('/api/endpoints/getAdvisorMessages', cors(), )
router.post('/api/endpoints/sendMessage', cors(), sendMessages)
router.post('/api/endpoints/sendNotification', cors(), sendNotification1)
router.get('/api/endpoints/getAllNotifications', cors(), getNotification1)
router.get('/api/endpoints/getNotification', cors(), getNotification2)

router.get('/api/endpoints/getAdvisorId', cors(), getAdvisorId)
router.post('/api/endpoints/startExam', cors(), startExam)
router.post('/api/endpoints/insertAdvisor', cors(), insertAdvisor )
router.get('/api/endpoints/getAdvisors', cors(), getAdvisors )
router.patch('/api/endpoints/chooseAdvisor', cors(), chooseAdvisor)
//MyStudentsChats1.js
router.get('/api/endpoints/AAGet1', cors(),  AGetA1)
//MyStudentsChats2.js
router.get('/api/endpoints/AAGet2', cors(), AGetA2 )
router.post('/api/endpoints/ASsend', cors(),  AsendAS)


//WorldChats1.js
router.get('/api/endpoints/wGet1', cors(), wGet1)
//WorldChats2.js
router.get('/api/endpoints/wGet2', cors(), wGet2)
router.post('/api/endpoints/wSend', cors() , wSend)
 
//myAdvisorChat.js
router.get('/api/endpoints/AGet', cors(), AGetS)
router.post('/api/endpoints/AsendSA', cors(), ASendSA)
router.get('/api/endpoints/Gexams', cors(),getAllExam1)
router.patch('/api/endpoints/setExamTime', cors(), setExamTime)
router.patch('/api/endpoints/setExamLink', cors(), setExamLink)
router.get('/api/endpoints/getExams4Student', cors(), getExams4Student)
router.get('/api/endpoints/getExams4Advisor', cors(), getExams4Advisor)
router.patch('/api/endpoints/setAdvisorAsAvailable', cors(), setAdvisorToAvailable)
router.patch('/api/endpoints/setAdvisorToUnAvilable', cors(), setAdvisorToUnAvailable)
router.post('/api/endpoints/insertAdvisor')
router.post('/api/endpoints/rateAdvisor', cors(), rateAdvisor)
router.patch('/api/endpoints/setGrade', cors(), setExamGrade)


router.patch('/api/endpoints/setToPassedExam', cors(), setExamPassed)
router.patch('/api/endpoints/setToNotPassedExam', cors(), setExamNotPassed)
router.patch('/api/endpoints/allowAdvisors', cors(), allowAdvisorsForWorld)
router.patch('/api/endpoints/dontAllowAdvisors', cors(), dontAllowAdvisorsForWorld)
router.post('/api/endpoints/setTimeLinkPassingGExamType', cors() , setTimeLinkPassingGExamType)
router.post('/api/endpoints/sendGradeComment', cors(), sendGradeComment)
router.get('/api/endpoints/getProfile', cors(), getProfile)
router.get('/api/endpoints/SgetProfile', cors(), SgetProfile)
router.get('/api/endpoints/getPosts', cors(), getPosts)
router.get('/api/endpoints/getAttachments', cors(), getAttachments)
router.post('/api/endpoints/rateWorld', cors(), rateWorld)
router.post('/api/endpoints/ratePost', cors(), )
router.post('/api/endpoints/ratePublisher', cors(), ratePublisher)
router.post('/api/endpoints/addCommentToWorld', cors(), commentWorld)

router.get('/api/endpoints/getCertificate', cors(), getCertification)
router.get('/api/endpoints/myEarning', cors(), myEarning)
router.get('/api/endpoints/myRate', cors(), myRate )
router.post('/api/endpoints/addToCart', cors(), addToCart)
router.get('/api/endpoints/getCart', cors(), getCart)
router.delete('/api/endpoints/deleteWorldFromCart', cors(), deleteWorldFromCart)
router.get('/api/endpoints/getMoneyInHistory', cors(), getMoneyInHistory)
router.get('/api/endpoints/getMoneyOutHistory', cors(), getMoneyOutHistory)
router.get('/api/endpoints/getWithdrawMoneyHistory', cors(), getWithdrawMoneyHistory)
router.get('/api/endpoints/getTotalCash', cors(), getTotalCash)
router.get('/api/endpoints/getWorld', cors(), getWorld)
router.get('/api/endpoints/getLevel', cors(), getLevel)
router.get('/api/endpoints/getLesson', cors(), getLesson)
router.get('/api/endpoints/getMyWorlds', cors(), getMyWorlds)
router.get('/api/endpoints/updateName', cors(), updateName )

router.patch('/api/endpoints/changeLevelTitle', cors(), changeLevelTitle)
router.patch('/api/endpoints/changeLevelDescritption', cors(), changeLevelDescription)
router.patch('/api/endpoints/changeWorldName', cors(), changeWorldName)
router.patch('/api/endpoints/changeWorldDescription', cors(), changeLevelDescription)
router.patch('/api/endpoints/changeWorldPrice', cors(), changeWorldPrice)
router.patch('/api/endpoints/changeWorldThumbnail',cors(),  upload.single('thumbnail'), changeWorldThumbnail)
router.patch('/api/endpoints/changeAllowAdvisors',cors(),  changeAllowAdvisor)


router.patch('/api/endpoints/updatePassword', cors(), updatePassword)


router.get('/api/endpoints/WgetPosts', cors(), WgetPosts)
router.get('/api/endpoints/getMates', cors(), AGetMates)



router.get('/api/endpoints/getMyNDStudents', cors(), getMyAdvisors)
router.get('/api/endpoints/getMyNDStudents', cors(), getMyNDStudents)
router.get('/api/endpoints/getMyDStudents', cors(), getMyDStudents)


router.get('/api/endpoints/getMateRequests', cors(), getMateRequests)
router.get('/api/endpoints/getMatesRequestss', cors(), getMateRequestss)
router.get('/api/endpoints/getCurrentMates', cors(), getAcceptedMatess)
router.get('/api/endpoints/getCurrentMatesLength', cors(), getAcceptedMatessLength)

 

router.patch('/api/endpoints/acceptMate', cors(), acceptMateRequest)
router.patch('/api/endpoints/refuseMate', cors(), refuseMate)


router.post('/api/endpoints/realWorldResults', cors(), uploadRealWorldResults)
router.get('/api/endpoints/getSWubscribedInWorlds', cors(),)



router.get('/api/endpoints/getRealWorldResult', cors(),getRealWorldResult )




router.post('/api/endpoints/WaddPost', cors(), WuploadPost )
router.patch('/api/endpoints/WeditPost', cors(), WeditPost)
router.get('/api/endpoints/getCertainPost', cors(), getCertainPost)
router.delete('/api/endpoints/WdeletePost', cors(), WdeletePost)
router.get('/api/endpoints/AgetPosts', cors(),AgetPosts )
router.get('/api/endpoints/ASgetPosts', cors(), ASgetPosts)
router.get('/api/endpoints/ASVgetPosts', cors(), ASVgetPosts)
router.post('/api/endpoints/savePost', cors(), savePost )
router.delete('/api/endpoints/unSavePost', cors(), unSavePost)
router.get('/api/endpoints/checkIsPaidWorld', cors(), checkIsPaidWorld)
router.get('/api/endpoints/getWorldPrice', cors(), getWorldPrice )
router.patch('/api/endpoints/publishWorld', cors() , publishWorld )
router.get('/api/endpoints/getPublishedStatus', cors(), getPublishedStatus)


router.get('/api/endpoints/getMyDrafts', cors(), getMyDrafts)


router.get('/api/endpoints/getSkillerId', cors(), getSkillerId )
router.get('/api/endpoints/getAMyCurrentdvisorId', cors(), getMyCurrentAdvisorId)
router.get('/api/endpoints/getToBeAdvisorPermission', cors(), getToBeAdvisorPermission)


router.patch('/api/endpoints/setWorldIdInBack', cors(), setWorldIdInBack)
router.get('/api/endpoints/getOnlyPublishedLevels', cors(), getOnlyPublishedLevels)
router.get('/api/endpoints/getOnlyPublishedLessons', cors(), getOnlyPublishedLessons)


router.get('/api/endpoints/checkIsAlreadyRateWorld', cors(), checkIsAlreadyRateWorld)
router.get('/api/endpoints/checkIsAlreadyRateSkiller', cors(), checkIsAlreadyRateSkiller)
router.get('/api/endpoints/getmyAdvisors', cors(), getMyAdvisors)
router.get('/api/endpoints/getWorldsForGetAllWorlds', cors(), getWorldsForGetAllWorlds)
router.get('/api/endpoints/getLevelsForgetOnlyPublishedLevels', cors(), getLevelsForgetOnlyPublishedLevels)
router.get('/api/endpoints/getLessonsForgetOnlyPublishedLessons', cors(), getLessonsForGetOnlyPublishedLessons)

router.post('/api/endpoints/SKMMODMFA', cors(), LeadsSkMMODMFA )
router.post('/api/endpoints/SKTsWebDev', cors(), LeadsTsWebDev )

router.get('/api/endpoints/getSkillersIds', cors(), getSkillersIds)




router.get('/api/endpoints/imageCertifications', cors(), getImageCertifications )
router.get('/api/endpoints/pdfCertifications', cors(), getPdfCertifications)



   


router.get('/api/endpoints/LgetAllSkillers', cors(), LgetAllSkillers)



router.get('/api/endpoints/getAllJobs', cors(), getAllJobs)
router.post('/api/endpoints/sendProposalLetter', cors(), sendProposalLetter)
router.get('/api/endpoints/getUploadedJobs', cors(), getUploadedJobs)
router.get('/api/endpoints/getAllProposals', cors(), getAllProposals)
router.patch('/api/endpoints/setProposalAccepted', cors(), setPropsalAccepted)
router.get('/api/endpoints/getAdvisorPriceNameWorldName', cors(), getAdvisorPriceNameWorldName)
router.get('/api/endpoints/getExamerPriceNameWorldName', cors() , getExamerPriceNameWorldName)
router.get('/api/endpoints/getExamers', cors(), getExamers)

router.patch('/api/endpoints/setNotificationReaded', cors(), setNotificationReaded)

router.get('/api/endpoints/getAdvisorsAndExamersLength', cors(), getAdvisorsAndExamersLength )
router.get('/api/endpoints/getEmployees', cors(), getEmployees )

router.post('/api/endpoints/sendWelcomeNotification', cors() , sendWelcomeNotification)
router.get('/api/endpoints/getWithNameAndPicture', cors(), getWithNameAndPicture)
router.patch('/api/endpoints/setAllMessagesToReaded', cors(), setAllMessagesToReaded )
router.delete('/api/endpoints/deleteSkiller', cors(), deleteSkiller)
router.post('/api/endpoints/sendAdvReq', cors(), sendAdvisorReq)
router.patch('/api/endpoints/acceptAdvisorRequest', cors(), acceptAdvisorReq)
router.post('/api/endpoints/inviteSkillerToBeAdvisorInWorld', cors(), sendInviteToSkiller)
router.patch('/api/endpoints/acceptInvite', cors(), acceptAdvisorInvitation)
router.get('/api/endpoints/getImageCertifications', cors(), getImageCertifications)
router.get('/api/endpoints/getPdfCertifications', cors(), getPdfCertifications)
router.post('/api/endpoints/handleLikePost', cors(), )
router.get('/api/endpoints/getPostResources', cors(), getPostResources)
router.get('/api/endpoints/checkIsAlreadyRatePost', cors(), checkIsAlreadyRateSkiller )
router.post('/api/endpoints/addCommentToPost', cors(), addCommentToPost )
router.post('/api/endpoints/sellerSignUp', cors(), handleSellerSignUp)
router.post('/api/endpoints/customerSignUp', cors(), handleCustomerSignUp)

router.get('/api/endpoints/getSeller/:id', cors(), getSeller)
// router.post("/api/endpoints/send", cors() , notification)
export default router;  


// /api/endpoints/addCommentToPost

// /api/endpoints/checkIsAlreadyRatePost

// /api/endpoints/getWorldComments

// /api/endpoints/rateWorld

// addCommentToWorld


// /api/endpoints/getWorldComments

// /api/endpoints/getWorldComments


// /api/endpoints/checkIsAlreadyRatePost
// /api/endpoints/AgetPosts

// /api/endpoints/getResources

// /api/endpoints/handleLikePost

// /api/endpoints/WaddPost


// /api/endpoints/getCertifications
 
// /api/endpoints/insertSkillerPdfCertificate


// /api/endpoints/inviteSkillerToBeAdvisorInWorld
// /api/endpoints/getAdvisors
// /api/endpoints/getNotification
// /api/endpoints/getAdvisorPriceNameWorldName
 
// /api/endpoints/skillerSignUp
// /api/endpoints/skillerSignIn
// /api/endpoints/category
// /api/endpoints/insertSkillerPdfCertificate
// /api/endpoints/insertSkillerImageCertificate
// /api/endpoints/insertSkillerPicture
// /api/endpoints/uploadCoverPhoto  
// /api/endpoints/insertSkillerLetter
// /api/endpoints/addWorld
// /api/endpoints/PaddWorld
// /api/endpoints/editWorld
// /api/endpoints/getWorldForEdit
// /api/endpoints/getWorldTrailer
// /api/endpoints/setLevelPublished
// /api/endpoints/editLevel
// /api/endpoints/getLevels
// /api/endpoints/getWorldName
// /api/endpoints/addLevel
// /api/endpoints/removeLevel
// /api/endpoints/editLesson
// /api/endpoints/setLessonPublished
// /api/endpoints/getLessons
// /api/endpoints/getLevelTitleAndNumber
// /api/endpoints/uploadCourse
// /api/endpoints/removeLesson
// /api/endpoints/getResources
// /api/endpoints/editResources
// /api/endpoints/getPublishedStatus
// /api/endpoints/setWorldPublished
// /api/endpoints/getAllWorlds
// /api/endpoints/changeAdvisorPrice
// /api/endpoints/getNumberOfUnReadedMessages
// /api/endpoints/getNumberOfUnreadedNotifications
// /api/endpoints/getCategoriesForFilterWorlds
// /api/endpoints/getWorldComments
// /api/endpoints/getAllSkillers
// /api/endpoints/sendMateRequest
// /api/endpoints/chats1
// /api/endpoints/sendMateRequest
// /api/endpoints/LgetAllSkillers
// /api/endpoints/chats2
// /api/endpoints/changeAdvisorPrice
// /api/endpoints/SocialLinks
// /api/endpoints/getSkillerCoverPicture
// /api/endpoints/getSubscribedIn
// /api/endpoints/insertSkillerLetter
// /api/endpoints/deletetSkillerLetter
// /api/endpoints/insertSkillerLetter
// /api/endpoints/deletetSkillerLetter
// /api/endpoints/uploadVideo
// /api/endpoints/realWorldResults
// /api/endpoints/getMProfile
// /api/endpoints/getWorldsForProfile
// /api/endpoints/worldsThatIamAdvisorOn
// /api/endpoints/getCertifications
 
// /api/endpoints/deleteVideo
// /api/endpoints/deleteCoverPicture
// /api/endpoints/checkPastPass
// /api/endpoints/updatePassword
// /api/endpoints/changeNameSurname
// /api/endpoints/updateProfilePicture
// /api/endpoints/toggleAdvisorStatus
// /api/endpoints/updateDefinitionVideo
// /api/endpoints/getCategoriesForFilterSkillers
// /api/endpoints/uploadJob
// /api/endpoints/paidWorld
// /api/endpoints/editWorld
// /api/endpoints/paidWorld
// /api/endpoints/getOnlyPublishedLessons
// /api/endpoints/setLessonCompleted
// /api/endpoints/getResources
// /api/endpoints/getLessonCompleted
// /api/endpoints/getAdvisors
// /api/endpoints/addWorld
// /api/endpoints/uploadJob
// /api/endpoints/getCurrentMates
// /api/endpoints/getProfile
// /api/endpoints/getWorldsForProfile
// /api/endpoints/worldsThatIamAdvisorOn
// /api/endpoints/WaddPost