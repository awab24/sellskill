import mongoose from "mongoose";
import { json, response } from "express";
import { ClientModel } from "../models/ClientModel.js"
import { PostsModel } from "../models/PostsModel.js";
import { ProviderModel } from "../models/ProviderModel.js"
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { PaymentModel } from "../models/PaymentModel.js";
import { CourseModel } from '../models/CourseModel.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { CustomerModel } from "../models/CustomerModel.js";
import PDFDocument from 'pdfkit';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const certificateTemplatePath = path.join(__dirname, '../certificates/certificate-template.png');
import { createCanvas, loadImage } from 'canvas';
import { FAADCustomerModel } from "../models/FAADCustomerModel.js";
import { CodingCustomerModel } from "../models/CodingCustomerModel.js";
import { SkillerModel } from "../models/SkillerModel.js";
import multer from "multer";
import { WorldsModel } from "../models/WorldsModel.js";
// import { admin } from "../index.js";
 
import axios from 'axios';
import dotenv from 'dotenv';

 
import { start } from "repl";
import { CategoriesModel } from "../models/Categories.js";
import { SkModel } from "../models/SK.js";
import { SkMMOModel } from "../models/SKMMO.js";
import { SkMMODMModel } from "../models/SKMMODM.js";
import { SkMMODMFAModel } from "../models/SKMMODMFA.js";
import { SkTsWebdevModel } from "../models/SKTsWebdev.js";
import { SkTsModel } from "../models/SkTs.js";
import { sendNotification } from "../firebase/firebaseAdmin.js";
import { JobsModel } from "../models/JobsModel.js";
import { constants } from "buffer";
import { connectStorageEmulator } from "firebase/storage";
import { CustomerrModel } from "../models/Customer.js";
import { sellerModel } from "../models/Seller.js";
 
 

let providerOrClientId;
//sksksksk
let skillerId;
let withId;
let worldId;
let levelId;
let lessonId;
let postId;
let examId;
 
let advisorId;
let studentId;
let worldName;
let levelNumber;
let worldDescription;
let elements;
let toBeAnAdvisorLevel;
let levelTitle;
let time;
let examLink;
let notificationId;
//sksksksk
let clientId;
let providerId;
let provider;
let proposalId;
let providerImageCertificationsImageCertificateData = [];
let providerImageCertifications = [];
let choosenInvitationId;
let worldsForGetAllWorlds = [];
let levelsForGetOnlyPublishedLevels;
let lessonsForGetOnlyPublishedLessons;
let resources;
let nextStartPoint = 0;
const PAGE_SIZE = 6;
let allSkillersss = [];
// PayPal API credentials





export const handleSkillerSignUp = async (req, res) => {//1
  try {
 
 
    // Validate required fields   
    const {skillerId, name, surname, email, password, FcmToken  } = req.body;
  
    console.log('skillerId from sign up ==================> > > > >  ###############*****>>',skillerId)
    // Check if the email is already in use
    const existingSkiller = await SkillerModel.findOne({ email });
    if (existingSkiller) {
      return res.status(409).json({ error: 'Email is already in use' }); // Conflict
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPwd = await bcryptjs.hash(password, salt);

    // Prepare the skiller object for insertion
    const newSkiller = {
      _id: skillerId,
      name,
      surname,
      email,
      password: hashedPwd,
      FcmToken: FcmToken || '', // Default to an empty string if not provided
      newMessage: false,
      allowedToUpload: false, 
      instructorLevel: '0',
      rate: 0,
      joinedAt: new Date().toISOString().split('T')[0],
 
    };   

    // Insert the new skiller into the database
    const createdSkiller = await SkillerModel.create(newSkiller);
 

    await createdSkiller.save();
    
    // Generate JWT token
    const token = jwt.sign({ _id: createdSkiller._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Respond with the token
    return res.status(201).json({ token }); // 201 Created
  } catch (error) {
 
    return res.status(500).json({ error: 'Internal server error' });
  }
};





export const handleSkillerSignIn = async (req, res) => {//2
  try {
    const { email, password } = req.body;

 
    console.time("findSkiller");
    const skiller = await SkillerModel.findOne({ email }).select('password');
    console.timeEnd("findSkiller");

    if (!skiller) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcryptjs.compare(password, skiller.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email or password is incorrect" });
    }
    skillerId = skiller._id;
    const token = jwt.sign({ _id: skiller._id }, process.env.SECRET_KEY, { expiresIn: "30m" });

    return res.status(200).json({ token : {token}, skillerId : skiller._id });
  } catch (error) {
    console.error("Error in handleSkillerSignIn:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const insertCategory = async (req, res) => {//3

   
  try {
    const categoriesFromFront = req.body.categoriesFromFront;
    console.log('##############################*********************req.body.categoriesFromFront from insertCategory***************************************####################### ================================-=-=--=-=-=-=-=-=-=-> > > > > > >>   ',req.body.categoriesFromFront)
    const skillerId = req.body.skillerId;
    console.log('##############################*********************req.body.skillerId from insertCategory***************************************####################### ================================-=-=--=-=-=-=-=-=-=-> > > > > > >>   ',req.body.skillerId)
    console.log('##############################*********************req.body from insertCategory***************************************####################### ================================-=-=--=-=-=-=-=-=-=-> > > > > > >>   ',req.body)
await SkillerModel.updateOne(
  { _id: skillerId },
  { $addToSet: { categories: { $each: categoriesFromFront } } },
  { upsert: true }
);

    await CategoriesModel.updateOne(
      { /* Add specific filters if needed */ },
      {
        $addToSet: { SkillerCategories: { $each: categoriesFromFront } } // Using $each with $addToSet
      },
      { upsert: true } // Create the document if it doesn't exist
    );

    res.status(200).send({ message: "Categories updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred while updating categories" });
  }

    // Update CategoriesModel for all categories at once


};


export const insertImageCertificate = async (req, res) => {//4
  try {
 
    const skillerId = req.body.skillerId
    const certifications = req.body.certifications; // Expecting an array of certifications

 

    const updates = certifications?.map((certification) => ({
      contentUrl: certification.url,
      title: certification.title,
      description: certification.description,
      _id: certification.id,
    }));

    const updatedSkiller = await SkillerModel.findByIdAndUpdate(
      skillerId,
      { $push: { imageCertifications: { $each: updates } } },
      { new: true }
    );

 

    res.status(200).json({ message: "Certifications added successfully.", updatedSkiller });
  } catch (error) {
 
    res.status(500).json({ error: "Internal server error." });
  }
};


export const insertPdfCertificate = async(req, res)=>{//5
  try {
 

    const certifications = req.body.certifications; // Expecting an array of certifications
    const skillerId = req.body.skillerId;
 

    const updates = certifications?.map((certification) => ({
      contentUrl: certification.url,
      title: certification.title,
      description: certification.description,
      _id: certification.id,
    }));

    const updatedSkiller = await SkillerModel.findByIdAndUpdate(
      skillerId,
      { $push: { pdfCertifications: { $each: updates } } },
      { new: true }
    );

    if (!updatedSkiller) {
      return res.status(404).json({ error: "Skiller not found." });
    }

    res.status(200).json({ message: "Certifications added successfully.", updatedSkiller });
  } catch (error) {
    console.error("Error in insertImageCertificate:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export const insertClientPicture = async(req, res) => {//6
  const skillerId = req.body.skillerId
   try {
     await SkillerModel.findByIdAndUpdate(
        skillerId,
       {$set: {picture: {
         name: req.body.name,
         picture: {
           data: req.file.buffer,
           contentType: req.file.mimetype
         }
        
       }}},
       {new: true}
     )
 
   } catch (error) {
     
   }
 }
 


 export const uploadCoverPhoto = async (req, res) => {//7

  const file = req.file;
  const skillerId = req.body.skillerId

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const updatedUser = await SkillerModel.findByIdAndUpdate(
      skillerId,
      {
        coverPicture: {
          name: file.originalname,
          picture: {
            data: file.buffer,
            contentType: file.mimetype,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "Cover photo uploaded successfully", updatedUser });
  } catch (error) {

    res.status(500).json({ error: "Server error" });
  }
};


export const insertLetter = async(req, res)=> {//8
  try
{ 
  const skillerId = req.body.skillerId
   const letter = req.body.letter
  // Update the provider's letter
  await SkillerModel.findOneAndUpdate(
    { _id: skillerId },
    { $set: { letter: letter } },
    { new: true }
  );
  res.status(200).message('letter inserted successfully')
}catch(error){
 
}
}

export const addWorld = async (req, res) => {//9
  let advisors = [];
  let examers = [];
  try  
  {
        const instructorId = req.body.skillerId; // Assuming skillerId is set globally or passed in the request
        console.log("Instructor ID:", instructorId);
  
        // Fetch the instructor from the database
        const instructor = await SkillerModel.findById(instructorId).select('name surname rate picture');
  
  
        // Validate request body
   
       const   worldId = req.body.worldId
      
        const {  worldName, worldDescription,   price, advisorAmount, category , meAsExamerPrice, meAsAdvisorPrice,iAmAdvisor, iAmExamer ,isWorldAllowingAdvisors,isWorldAllowingExamers } = req.body;
        console.log('req.body from addWorld ============================================-=-=--=-=-=--=-=-=-=-=-=-=-->>> > > > >  > > >    >> > >  ',req.body)
  
  
  
        // Create the new world object
        const newWorld = {
          _id: worldId, // Assuming worldId is unique
          worldName,
          price,
          category,
          advisorAmount,
          worldDescription,
          published: false,
          draft: true,
          publisher: true,
          student: false,
          isWorldAllowingAdvisors: Boolean(isWorldAllowingAdvisors), // Ensure this is stored as a boolean
          isWorldAllowingExamers: Boolean(isWorldAllowingExamers),
    
          worldThumbnail: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          },
          iAmA: "publisher",
          levels: [], // Initialize levels as an empty array
          
        };
  
        // Update the instructor's document with the new world
  
  
      const updatedInstructor = await SkillerModel.findOneAndUpdate(
          { _id: instructorId },
          { $push: { worlds: newWorld } },
          { new: true } // Return the updated document
        );
  
        if (!updatedInstructor) {
          return res.status(404).json({ message: "Instructor not found" });
        }
  
        console.log("Instructor updated:", updatedInstructor);
  
        // Add the new world to the WorldsModel
        if( iAmAdvisor) {
            advisors = [{
              _id: skillerId,
              price: Number(meAsAdvisorPrice),
   
   
              studentToBeAdvisorName: instructor.name, //which the advisor in this case
              studentToBeAdvisorSurname: instructor.surname,
              isAvailable: true
              
          }]
        }
        if ( iAmExamer) {
            examers = [{
              _id: skillerId,
              price: meAsExamerPrice,
              name: instructor.name,
              surname: instructor.surname,
              isAvailable: true
          }]
        }
  
        await WorldsModel.create({
          _id: worldId,
          publisherId: instructorId,
          worldName,
          price,
          category,
          advisorAmount,
          published: false,
          draft: true,
          worldDescription,
          dateOfPublish: new Date().toISOString().split('T')[0],
          isWorldAllowingAdvisors: Boolean(isWorldAllowingAdvisors),
          isWorldAllowingExamers: Boolean(isWorldAllowingExamers),
          advisors: advisors,
          examers: examers,
          worldThumbnail: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          },
  
          levels: [],
          publisher: {
            _id: skillerId,
            name: instructor.name,
            rate: instructor.rate,
            picture: instructor.picture
          },})
  
  //it been delivered as a set
  
  
  // Update the CategoriesModel
  // Split and clean up categories from the request body
  // Sanitize and process categories from the request body
  const categoryList = Array.isArray(category) 
    ? category 
    : category.split(',').map(cat => cat.trim().replace(/^[\["']+|[\]"']+$/g, '')); // Remove unwanted quotes or brackets
  
  for (const singleCategory of categoryList) {
    console.log('Processing clean category:', singleCategory);
  
    // Update the worldsCategories array for each individual category
    await CategoriesModel.updateOne(
      {},
      { $addToSet: { worldsCategories: singleCategory } }, // Add to array only if it doesn't already exist
      { upsert: true } // Create a new document if none exists
    );
  }
     
  
  
  
  
  
       
  //update world
  //update
  //update///////////////////////////////////////////
  
  
        res.status(200).json({ message: "World added successfully", world: newWorld });
  }
  catch(error){
    console.log(error.message)
  }
    };
  


    export const PaddWorld = async (req, res) => {//10


      let examers = [];
      let advisors = [];
     try 
    {
      const instructorId = req.body.skillerId; // Assuming skillerId is set globally or passed in the request
    
      // Fetch the instructor from the database
      const instructor = await SkillerModel.findById(instructorId).select('name surname picture');
    
      // Validate request body
     
       const worldId = req.body.worldId
     
      const {  worldName, worldDescription,  price, advisorAmount, category,meAsExamerPrice, meAsAdvisorPrice,iAmAdvisor, iAmExamer ,isWorldAllowingAdvisors,isWorldAllowingExamers  } = req.body;
      console.log('req.body from addWorld ============================================-=-=--=-=-=--=-=-=-=-=-=-=-->>> > > > >  > > >    >> > >  ',req.body)
    
    
    
      // Create the new world object
      const newWorld = {
        _id: worldId, // Assuming worldId is unique
        worldName,
        price,
        category,
        advisorAmount,
        worldDescription,
        published: true,
        draft: false,
        publisher: true,
        student: false,
        isWorldAllowingAdvisors: Boolean(isWorldAllowingAdvisors), // Ensure this is stored as a boolean
        worldThumbnail: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
        iAmA: "publisher",
        levels: [], // Initialize levels as an empty array
        
      };
    
      // Update the instructor's document with the new world
    
    
    const updatedInstructor = await SkillerModel.findOneAndUpdate(
        { _id: instructorId },
        { $push: { worlds: newWorld } },
        { new: true } // Return the updated document
      );
    
      if (!updatedInstructor) {
        return res.status(404).json({ message: "Instructor not found" });
      }
    
      console.log("Instructor updated:", updatedInstructor);
    
    
    
      if( iAmAdvisor) {
        advisors = [{
          _id: skillerId,
          price: Number(meAsAdvisorPrice),
    
    
          studentToBeAdvisorName: instructor.name, //which the advisor in this case
          studentToBeAdvisorSurname: instructor.surname,
          isAvailable: true
          
      }]
    }
    if ( iAmExamer) {
        examers = [{
          _id: skillerId,
          price: meAsExamerPrice,
          name: instructor.name,
          surname: instructor.surname,
          isAvailable: true
      }]
    }
    
    
      // Add the new world to the WorldsModel
      await WorldsModel.create({
        _id: worldId,
        publisherId: instructorId,
        worldName,
        price,
        category,
        advisorAmount,
        published: true,
        draft: false,
        worldDescription,
        dateOfPublish: new Date().toISOString().split('T')[0],
        isWorldAllowingAdvisors: Boolean(isWorldAllowingAdvisors),
        isWorldAllowingExamers: Boolean(isWorldAllowingExamers),
        advisors: advisors,
        examers: examers,
        worldThumbnail: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
        levels: [],
        publisher: {
          _id: skillerId,
          name: instructor.name,
          rate: instructor.rate,
          picture: instructor.picture
        },})
    
    
    
    // Split and clean up categories from the request body
    // Sanitize and process categories from the request body
    const categoryList = Array.isArray(category) 
      ? category 
      : category.split(',').map(cat => cat.trim().replace(/^[\["']+|[\]"']+$/g, '')); // Remove unwanted quotes or brackets
    
    for (const singleCategory of categoryList) {
     
    
      // Update the worldsCategories array for each individual category
      await CategoriesModel.updateOne(
        {},
        { $addToSet: { worldsCategories: singleCategory } }, // Add to array only if it doesn't already exist
        { upsert: true } // Create a new document if none exists
      );
    }
    
    
     
    //update world
    //update
    //update///////////////////////////////////////////
    
    
      res.status(200).json({ message: "World added successfully", world: newWorld });}
      catch(error){
        console.log(error.message)
      }
    
    }

    export const editWorld = async (req, res) => {//11

      console.log('req.body from editWorld ##################################******************************** ==================-=-=-=-=-=-=-> > > > > > >   ',req.body)
      let thumbnail;
      try {
     
        const {
          worldId,
          skillerId, 
          worldName,
          worldDescription,
          price,
          advisorAmount,
          isWorldAllowingAdvisors,
          category,
        } = req.body;
    
     
        // Parse category if needed
        let parsedCategory = [];
        try {
          parsedCategory = JSON.parse(category);
        } catch (error) {
       
        
        }
    
        // Handle file upload for thumbnail
     
    if(req.file)
      {    thumbnail = {
          data: req?.file?.buffer,
          contentType: req?.file?.mimetype,
        };
    }
        // Construct the new world object
 
    
        // Update all skillers who have the world
        const updatedSkillers = await SkillerModel.updateMany(
          { "worlds._id": worldId },
          { $set: { "worlds.$.worldName": worldName,
            "worlds.$.price":  Number(price),
            "worlds.$.category": parsedCategory,
            "worlds.$.advisorAmount": Number(advisorAmount),
            "worlds.$.worldDescription": worldDescription,
            "worlds.$.isWorldAllowingAdvisors": Boolean(isWorldAllowingAdvisors),
            "worlds.$.worldThumbnail": thumbnail,
    
    
           } }
        );
    
     
        // Update WorldsModel
        const updatedWorld = await WorldsModel.findByIdAndUpdate(
          worldId,
          {
            $set: {
              worldName,
              price: Number(price),
              category: parsedCategory,
              advisorAmount: Number(advisorAmount),
              worldDescription,
              isWorldAllowingAdvisors: Boolean(isWorldAllowingAdvisors),
              worldThumbnail: thumbnail,
            },
          },
          { new: true } // Return the updated document
        );
    
     
        console.log("World updated successfully:", updatedWorld);
        res.status(200).json({
          message: "World updated successfully",
          // world: updatedWorld,
          // affectedSkillers: updatedSkillers.modifiedCount,
        });
      } catch (error) {
        console.error("Error updating world ####################*************************  ======================-=-=-=-=-=-=-=-> > > > > >   ", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
      }
    };


    export const getWorldForEdit = async(req, res) => {//12
 
      const worldId = req.query.worldId
    
     const world = await WorldsModel.findById(worldId).select({
      _id: 1,
       worldName:1,
       worldDescription: 1,
       worldThumbnail: 1,
       price: 1,
        published: 1
     })
     res.status(200).json(world)
   }



   export const getTrailer = async(req, res) => {//13  
    worldId = req.query.worldId

  const world = await WorldsModel.findById(worldId).select('worldTrailer');


  // Find the specified world using the worldName

  if (!world) {
    return res.status(404).json({ message: 'World not found' });
  }

  // Find the specified level within the world using the levelNumber
  const trailer = world.worldTrailer

  // Combine resources with their order and type
   resources = [
    ...trailer.photos.map(photo => ({ type: 'image', url: photo.contentUrl, order: photo.order })),
    ...trailer.videos.map(video => ({ type: 'video', url: video.contentUrl, order: video.order })),
    ...trailer.texts.map(text => ({ type: 'text', content: text.text, order: text.order })),

  ];

  // Sort resources by order
  resources.sort((a, b) => a.order - b.order);

  res.status(200).json(resources)};

  export const setLevelPublished = async (req, res) => {//14
 
    const skillerId = req.body.skillerId;
    const levelId = req.body.levelId;
   
  
  const   worldId = req.body.worldId;
  
  
 
 
  
 
   // Respond to the client immediately
   try {
     // Update World and Skiller models asynchronously
     await WorldsModel.findOneAndUpdate(
       { _id: worldId, 'levels._id': levelId },
      { $set: { 'levels.$.published': true, 'levels.$.draft': false }},
       { new: true }
     );
 
     const skillerUpdate = await SkillerModel.findOneAndUpdate(
       {
         _id: skillerId,
         'worlds._id': worldId,
         'worlds.levels._id': levelId,
       },
       {
         $set: {
           'worlds.$[world].levels.$[level].published': true,
           'worlds.$[world].levels.$[level].draft': false,
         },
       },
       {
         arrayFilters: [
           { 'world._id': worldId }, // Match specific world
           { 'level._id': levelId }, // Match specific level
         ],
         new: true,
       }
     );
     
  
   } catch (error) {
  
   }
 };
 

 export const editLevel = async (req, res) => {//15

 
  const skillerId = req.body.skillerId;
  const  worldId = req.body.worldId;

try
{      // Extract data from the request body
    const updatedLevel = req.body.updatedLevel;
    levelId = updatedLevel._id

    // Validate required fields

    // Update the level within the specified world for the instructor
    const updatedInstructor = await SkillerModel.updateMany(
      { "worlds._id": worldId, "worlds.levels._id": levelId,  }, // Match level and world
      {
        $set: {
          "worlds.$[worldFilter].levels.$[levelFilter].levelTitle": updatedLevel.levelTitle,
          "worlds.$[worldFilter].levels.$[levelFilter].levelDescription": updatedLevel.levelDescription || "",
          "worlds.$[worldFilter].levels.$[levelFilter].toBeAnAdvisorLevel": Boolean(updatedLevel.toBeAnAdvisorLevel),
        },
      },
      {
        arrayFilters: [
          { "worldFilter._id": worldId },
          { "levelFilter._id": levelId },
        ],
        new: true, // Return the updated document
      }
    );

    if (!updatedInstructor) {
      return res.status(404).json({ message: "Instructor or world not found." });
    }


    // Update the WorldsModel with the updated level details
    const updatedWorld = await WorldsModel.findOneAndUpdate(
      { _id: worldId, "levels._id": levelId }, // Match world and level
      {
        $set: {
          "levels.$.levelTitle": updatedLevel.levelTitle,
          "levels.$.levelDescription": updatedLevel.levelDescription || "",
          "levels.$.toBeAnAdvisorLevel": Boolean(updatedLevel.toBeAnAdvisorLevel),
        },
      },
      { new: true } // Return the updated document
    );



    res.status(200).json({ message: "Level updated successfully" });}
    catch(error){

    }
};


export const getLevels = async (req, res) => {//16
  try{
   
    const skillerId = req.query.skillerId;
    const  worldId = req.query.worldId;
 
      // Retrieve the instructor and ensure they exist
      const instructor = await SkillerModel.findById(skillerId).select({
        worlds: {
          _id: 1,
          levels: 1
        }
      });
   
   
   
      // Find the personal world and its levels for the skiller
      const skWorld = instructor.worlds.find((w) => w._id === worldId);
  
      const skLevels = skWorld.levels;
   
      // Retrieve the world details from the Worlds collection
  
      // Map through the levels in the Worlds collection and merge with personal completion state
  
  // change i have made is to return skLevels rather than mergedLevels
      res.status(200).json(skLevels);
    } catch (error) {
   
      res.status(500).json({ message: 'Error fetching levels', error });
    }
  };

  export const getWorldName = async(req, res) => {//17
 try
  {  const skillerId = req.query.skillerId;
    const   worldId = req.query.worldId;
 
    const world = await WorldsModel.findById(worldId).select('worldName price');
    res.status(200).json({worldName: world.worldName, worldPrice: world.price})}
    catch(error){
   
    }
  }


  export const addLevel = async (req, res) => {//18
    try {
      // Extract data from the request body
   
      const skillerId = req.body.skillerId;
     const   levelId = req.body._id;
   
   
     const   worldId = req.body.worldId;
   
      const {
  
  
        levelTitle,
        levelDescription,
        toBeAnAdvisorLevel,
  
      } = req.body;
      const world = await WorldsModel.findById(worldId).select('levels')
      const levelNumber = world?.levels?.length + 1 || 1
      // Validate required fields
      if (!levelId || !worldId  || !levelTitle) {
        return res.status(400).json({
          message: "Missing required fields: levelId, worldId, levelNumber, and levelTitle are mandatory.",
        });
      }
  
   
      const instructorId = skillerId; // Assuming skillerId is globally available or passed with the request
  
      // Update the instructor's document
      const updatedInstructor = await SkillerModel.findOneAndUpdate(
        { _id: instructorId, "worlds._id": worldId }, // Match instructor and specific world
        {
          $push: {
            "worlds.$.levels": {
              _id: levelId,
              levelNumber,
              published: false,
              draft: true,
              isOpen: levelNumber === 1 ? true: false,
              levelTitle,
              levelDescription: levelDescription || `Level ${levelNumber}`,
              toBeAnAdvisorLevel: Boolean(toBeAnAdvisorLevel), // Ensure this is a boolean
            },
          },
        },
        { new: true } // Return the updated document
      );
  
      // Check if the instructor and world were found
      if (!updatedInstructor) {
        return res.status(404).json({ message: "Instructor or world not found." });
      }
  
   
      // Update the WorldsModel with the new level
      const updatedWorld = await WorldsModel.findByIdAndUpdate(
        worldId,
        {
          $push: {
            levels: {
              _id: levelId,
              levelNumber,
              published: false,
              draft: true,
              isOpen: levelNumber === 1 ? true: false,
              levelTitle,
              levelDescription: levelDescription || `Level ${levelNumber}`,
              toBeAnAdvisorLevel: Boolean(toBeAnAdvisorLevel),
            },
          },
        },
        { new: true } // Return the updated document
      );
  
      // Check if the world was found and updated
      if (!updatedWorld) {
        return res.status(404).json({ message: "World not found." });
      }
  
   
  
      res.status(200).json({ message: "Level added successfully" });
    } catch (error) {
   
      res.status(500).json({ message: "Error adding level", error });
    }
  };

  export const deleteSkiller = async (req, res) => {


    const skillerId = req.query.skillerId;
    await SkillerModel.findByIdAndDelete(
      skillerId
    )
   
  


  }
  



  export const deleteLevel = async (req, res) => {//19

    const skillerId = req.query.skillerId;
    const  worldId = req.query.worldId;
 
 
   const   levelId = req.query._id;
   
 
    try {

      if (!worldId || !levelId) {
        return res.status(400).json({ message: "worldId and levelId are required" });
      }


      // Step 1: Remove the level from all skillers
      const updatedSkillers = await SkillerModel.updateMany(
        {
          'worlds._id': worldId,
          'worlds.levels._id': levelId,
        },
        {
          $pull: { 'worlds.$[world].levels': { _id: levelId } },
        },
        {
          arrayFilters: [
            { 'world._id': worldId }, // Match the correct world
          ],
          new: true, // Optional: Ensures returning the updated document
        }
      );
  
      // Step 2: Remove the level from the world's levels array
      const updatedWorld = await WorldsModel.findByIdAndUpdate(
        worldId,
        {
          $pull: { levels: { _id: levelId } }, // Remove the level with the matching _id
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedWorld) {
        return res.status(404).json({ message: "World not found" });
      }
  
      res.status(200).json({
        message: "Level deleted successfully from the world and all related skillers",
        updatedWorld,
        skillersUpdatedCount: updatedSkillers.modifiedCount,
      });
    } catch (error) {
 
      res.status(500).json({ message: "An error occurred while deleting the level", error });
    }
  };
  



  export const editLessonn = async (req, res) => {//20
    try {
      // Extract the data from the request body
      const {  title, description, resources, skillerId, worldId, levelId, lessonId } = req.body;
   
      
 
  
      if (!lessonId || !worldId || !levelId ) {
        return res.status(400).json({
          error: "Missing required fields (_id, worldId, levelId, resources)",
        });
      }
  
      // Categorize resources by type
      const photos = [];
      const videos = [];
      const texts = [];
      const pdfs = [];
      const quizs = [];
  
      resources?.forEach((resource, index) => {
        const order = index + 1;
        if (resource.type === "photo") {
          photos.push({ contentUrl: resource.content, order });
        } else if (resource.type === "video") {
          videos.push({ contentUrl: resource.content, order });
        } else if (resource.type === "pdf") {
          pdfs.push({ contentUrl: resource.content, order });
        } else if (resource.type === "text") {
          texts.push({ text: resource.content, order });
        } else if (resource.type === "quiz") {
          quizs.push({
            question: resource.content,
            choices: resource.choices,
            correctAnswer: resource.correctAnswer,
            order,
          });
        }
      });
  
      // Create the updated lesson object
      const updatedLesson = {
        _id: lessonId,
        lessonTitle: title,
        lessonDescription: description,
        photos,
        videos,
        pdfs,
        texts,
        quizs,
      };
  
      // Update the lesson in SkillerModel for all users
      const skillerUpdateResult = await SkillerModel.updateMany(
        {
          "worlds._id": worldId,
          "worlds.levels._id": levelId,
          "worlds.levels.lessons._id": lessonId,
        },
        {
          $set: {
            "worlds.$[world].levels.$[level].lessons.$[lesson]": updatedLesson,
          },
        },
        {
          arrayFilters: [
            { "world._id": worldId },
            { "level._id": levelId },
            { "lesson._id": lessonId },
          ],
          new: true,
        }
      );
  
      // Update the lesson in WorldsModel
      const worldsUpdateResult = await WorldsModel.findOneAndUpdate(
        {
          _id: worldId,
          "levels._id": levelId,
          "levels.lessons._id": lessonId,
        },
        {
          $set: {
            "levels.$[level].lessons.$[lesson]": updatedLesson,
          },
        },
        {
          arrayFilters: [
            { "level._id": levelId },
            { "lesson._id": lessonId },
          ],
          new: true,
        }
      );
  
      // Validate updates
      if (!skillerUpdateResult.modifiedCount && !worldsUpdateResult) {
        return res.status(404).json({ error: "Lesson not found or not updated." });
      }
  
      // Success response
      res.status(200).json({ message: "Lesson updated successfully", updatedLesson });
    } catch (error) {
   
      res.status(500).json({ error: "Internal server error", details: error });
    }
  };

  
export const setLessonPublished = async (req, res) => {//21
 
  const skillerId = req.body.skillerId
  const  levelId = req.body.levelId
  
   
  const  worldId = req.body.worldId
 
  
 const   lessonId = req.body.lessonId
  
 
 
    // Respond to the client immediately
    res.status(202).json({ message: 'World publishing initiated.' });

    try {
      // Update World and Skiller models asynchronously
      await WorldsModel.findOneAndUpdate(
        {_id: worldId,
          "levels._id": levelId,
          "levels.lessons._id": lessonId
        },
      {$set:  { "levels.$[level].lessons.$[lesson].published": true, "levels.$[level].lessons.$[lesson].draft": false }},
        {
          arrayFilters: [

              {'level._id': levelId},
              {'lesson._id': lessonId},
             // Match the correct world
          ],
          new: true }
      );

      await SkillerModel.findOneAndUpdate(
        {
          _id: skillerId,
          'worlds._id': worldId,
          "worlds.levels._id":levelId,
          "worlds.levels.lessons._id": lessonId
        },
    {  $set:  {
          'worlds.$[world].levels.$[level].lessons.$[lesson].published': true,
          'worlds.$[world].levels.$[level].lessons.$[lesson].draft': false,
        }},
        {    arrayFilters: [
          { 'world._id': worldId} ,

            {'level._id': levelId},
            {'lesson._id': lessonId},
           // Match the correct world
        ],
        new: true, }
      );

   
    } catch (error) {
 
    }
  
};



export const getLessons = async (req, res) => {//22
  try{
 
    const skillerId = req.query.skillerId
    const  worldId = req.query.worldId
  
    const  levelId = req.query.levelId
 
  
 
      const instructor = await SkillerModel.findById(skillerId).select({
        worlds: {
          _id : 1,
          levels: {
            _id : 1,
            lessons: {
               _id: 1,
              lessonNumber: 1,
               lessonTitle: 1,
               lessonDescription: 1,
               isCompleted: 1,
               lessonDescription:1,
               published: 1,
            }
          }
        }
      });
 
      // Find the specified world using the worldName
      const world = instructor.worlds.find(w => w._id === worldId);
      if (!world) {
        return res.status(404).json({ message: 'World not found' });
      }
      console.log('world from getLessons ============>> ', world);
  
      // Find the specified level within the world using the levelNumber
  
      const level = world.levels.find(l => l._id === levelId);
 
  
  
      // Sort lessons by lessonNumber and map to response format
      const lessons = level.lessons
        .sort((a, b) => a.lessonNumber - b.lessonNumber) // Sort by lessonNumber
        .map((lesson) => ({
          _id: lesson._id,
          name: lesson.lessonNumber,
          title: lesson.lessonTitle,
          description: lesson.lessonDescription,
          isCompleted: lesson.isCompleted,
          description: lesson.lessonDescription,
          published: lesson.published,
        }));
 
      res.status(200).json(lessons);
    } catch (error) {
 
      res.status(500).json({ message: "Error fetching lessons", error });
    }
  };
  
  export const getLevelTitleAndNumber = async(req, res) => {//23
    try
{ 
  
    const  worldId = req.query.worldId
    
    const skillerId = req.query.skillerId
    const   levelId = req.query.levelId
    
    const world = await WorldsModel.findById(worldId).select({
      _id: 1,
      levels: {
        _id: 1,
        levelTitle: 1,
        levelNumber: 1,

      }
    });
    const level = world.levels.find(lv => lv._id === levelId)

    res.status(200).json({title: level.levelTitle, number: level.levelNumber})}
    catch(error){
      console.log(error.message)
    }
  }

  export const uploadCourse = async (req, res) => {//24
    try {
      // Extract data from request body
   
      const {
  
        description,
        elements,
        title,
      } = req.body;
      
      const skillerId = req.body.skillerId
      const  worldId = req.body.worldId
   
   
     const   levelId = req.body.levelId
   
    
     const   lessonId = req.body._id
      
  
  
  
      // Log the incoming request for debugging
  
  
      // Separate elements into specific content types
      const photos = [];
      const videos = [];
      const texts = [];
      const quizs = [];
      const pdfs = [];
  
      elements?.forEach((el, index) => {
        const order = index + 1;
        if (el.type === "photo") {
          photos.push({ contentUrl: el.content, order });
        } else if (el.type === "video") {
          videos.push({ contentUrl: el.content, order });
        } 
        else if (el.type === "pdf") {
          pdfs.push({ contentUrl: el.content, order });
        }
        else if (el.type === "text") {
          texts.push({ text: el.content, order });
        } else if (el.type === "quiz") {
          quizs.push({
            question: el.content,
            choices: el.choices,
            correctAnswer: el.correctAnswer,
            order,
          });
        }
      });
  
      // Find the instructor
      const instructor = await SkillerModel.findById(skillerId).select({
        _id: 1,
        worlds: {
          _id: 1,
          levels: {
            _id: 1,
            lessons: {
              _id: 1,
              
            }
          }
        }
      });
 
      // Find the world and level within the instructor's data
      const world = instructor.worlds.find((w) => w._id === worldId);
   
  
      const level = world.levels.find((l) => l._id === levelId);
      if (!level) {
        return res.status(404).json({ error: "Level not found" });
      }
  
      // Determine the lesson number
      const lessonNumber = level?.lessons?.length ? level.lessons.length + 1 : 1;
  
      // Construct the lesson object
      const lesson = {
       _id: lessonId,
        lessonNumber,
        published: false,
        draft: true,
        lessonTitle: title || `Lesson ${lessonNumber}`,
        lessonDescription: description || `Lesson ${lessonNumber}`,
        photos,
        videos,
        pdfs,
        texts,
        quizs,
      };
  
      // Update the instructor's lessons
      await SkillerModel.findOneAndUpdate(
        {
          _id: skillerId,
          "worlds._id": worldId,
          "worlds.levels._id": levelId,
        },
        {
          $push: {
            "worlds.$[world].levels.$[level].lessons": lesson,
          },
        },
        {
          arrayFilters: [
            { "world._id": worldId },
            { "level._id": levelId },
          ],
          new: true,
        }
      );
  
      // Update the world's lessons
      await WorldsModel.findOneAndUpdate(
        {
          _id: worldId,
          "levels._id": levelId,
        },
        {
          $push: {
            "levels.$[level].lessons": lesson,
          },
        },
        {
          arrayFilters: [{ "level._id": levelId }],
          new: true,
        }
      );
  
      res.status(200).json({ message: "Lesson added successfully", lesson });
    } catch (error) {
   
      res.status(500).json({ error: "Error uploading course", details: error });
    }
  };

  export const deleteLesson = async (req, res) => {//25

 
    const  worldId = req.query.worldId
   
    
    const  levelId = req.query.levelId
    
  
    const  lessonId = req.query._id
  
 
 
    try {
      // Step 1: Remove the lesson from the SkillerModel
      const updatedSkillers = await SkillerModel.updateMany(
        {
          'worlds._id': worldId,
          'worlds.levels._id': levelId,
          'worlds.levels.lessons._id': lessonId,
        },
        {
          $pull: { 'worlds.$[world].levels.$[level].lessons': { _id: lessonId } },
        },
        {
          arrayFilters: [
            { 'world._id': worldId },
            { 'level._id': levelId },
          ],
        }
      );
  
      // Step 2: Remove the lesson from the World's levels array
      const updatedWorld = await WorldsModel.findOneAndUpdate(
        { _id: worldId, 'levels._id': levelId },
        {
          $pull: { 'levels.$.lessons': { _id: lessonId } },
        },
        { new: true } // Ensure the updated document is returned
      );
  
      if (!updatedWorld) {
        return res.status(404).json({ message: "World or Level not found" });
      }
  
      res.status(200).json({
        message: "Lesson deleted successfully from the world and all related skillers",
        updatedWorld,
        skillersUpdatedCount: updatedSkillers.modifiedCount,
      });
    } catch (error) {
      console.error("Error deleting lesson:", error.message);
      res.status(500).json({ message: "An error occurred while deleting the lesson", error });
    }
  };
  
  export const getResources = async(req, res) => {//26
    try{
     
   const skillerId = req.query.skillerId
       const  worldId = req.query.worldId
     
     
      const  levelId = req.query.levelId
     
     
      const   lessonId = req.query.lessonId
     
     
    
        // Find the specified world using the worldName
        const world = await WorldsModel.findById(worldId).select({
          _id: 1,
          levels: {
            _id: 1,
            lessons: {
              _id: 1,
              photos: 1,
              videos: 1,
              quizs: 1,
              pdfs: 1,
              texts: 1
            }
          }
        })
     
         
        // Find the specified level within the world using the levelNumber
        const level = world.levels.find(l => l._id === levelId);
        
     
    
        const lesson = level.lessons.find(ls => ls._id === lessonId);
     
     
        // Combine resources with their order and type
        const resources = [
          ...lesson.photos.map(photo => ({ type: 'image' , url: photo.contentUrl, order: photo.order })),
          ...lesson.videos.map(video => ({ type: 'video', url: video.contentUrl, order: video.order })),
          ...lesson.texts.map(text => ({ type: 'text', content: text.text, order: text.order })),
          ...lesson.pdfs.map(text => ({ type: 'pdf', content: text.text, order: text.order })),
          ...lesson.quizs.map(quiz => ({ type: 'quiz', content: quiz, order: quiz.order }))
        ];
     
        // Sort resources by order
        resources.sort((a, b) => a.order - b.order);
       
        res.status(200).json(resources);
      } catch (error) {
       
        res.status(500).json({ message: "Error fetching lessons", error });
      }
    };
    

    export const editResources = async (req, res) => {//27
      try {
        // Extract data from request body
     
        const {
    
          elements
    
        } = req.body;
     
        const skillerId= req.body.skillerId
        const  worldId = req.body.worldId
     
      
        const  levelId = req.body.levelId
       
        
        const lessonId = req.body.lessonId
      
    
        if (!lessonId || !worldId || !levelId ) {
          return res.status(400).json({
            error: "Missing required fields (_id, worldId, levelId, elements)",
          });
        }
    
        // Log the incoming request for debugging
    
    
        // Separate elements into specific content types
        const photos = [];
        const videos = [];
        const texts = [];
        const quizs = [];
        const pdfs = [];
    
        elements?.forEach((el, index) => {
          const order = index + 1;
          if (el.type === "image" || el.type === "photo") {
            photos.push({ contentUrl: el.content, order });
          } else if (el.type === "video") {
            videos.push({ contentUrl: el.content, order });
          } 
          else if (el.type === "pdf") {
            pdfs.push({ contentUrl: el.content, order });
          }
          else if (el.type === "text") {
            texts.push({ text: el.content, order });
          } else if (el.type === "quiz") {
            quizs.push({
              question: el.content,
              choices: el.choices,
              correctAnswer: el.correctAnswer,
              order,
            });
          }
        });
    
     
     
     
     
    
        // Determine the lesson number
     
        // Construct the lesson object
      
    
        // Update the instructor's lessons
        await SkillerModel.updateMany(
          {
            _id: skillerId, // Ensure you target the correct Skiller document
            "worlds._id": worldId,
            "worlds.levels._id": levelId,
            "worlds.levels.lessons._id": lessonId
          },
          {
            $set: {
              "worlds.$[world].levels.$[level].lessons.$[lesson].photos": photos,
              "worlds.$[world].levels.$[level].lessons.$[lesson].videos": videos,
              "worlds.$[world].levels.$[level].lessons.$[lesson].pdfs": pdfs,
              "worlds.$[world].levels.$[level].lessons.$[lesson].texts": texts,
              "worlds.$[world].levels.$[level].lessons.$[lesson].quizs": quizs,
            },
          },
          {
            arrayFilters: [
              { "world._id": worldId },
              { "level._id": levelId },
              { "lesson._id": lessonId }
            ],
          }
        );
        
    
        // Update the world's lessons
        await WorldsModel.findOneAndUpdate(
          {
            _id: worldId,
            "levels._id": levelId,
            "levels.lessons._id": lessonId
          },
          {
            $set: {
              "levels.$[level].lessons.$[lesson].photos": photos,
              "levels.$[level].lessons.$[lesson].videos": videos,
              "levels.$[level].lessons.$[lesson].pdfs": pdfs,
              "levels.$[level].lessons.$[lesson].texts": texts,
              "levels.$[level].lessons.$[lesson].quizs": quizs,
            },
          },
          {
            arrayFilters: [
              { "level._id": levelId },
              { "lesson._id": lessonId }
            ],
          }
        );
        
        res.status(200).json({ message: "Lesson added successfully" });
      } catch (error) {
       
        res.status(500).json({ error: "Error uploading course", details: error });
      }
    };
    



























export const sendProviderOrClientId = (req, res) => {
  res.send(providerOrClientId)
}
export const handleClientSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const findUser = await SkillerModel.findOne({ email });

    if (findUser) {
      const compare = await bcryptjs.compare(password, findUser.password);
      if (!compare) {
        return res.status(401).json({ redirectUrl: 'http://localhost:3000/cancel' });
      }
      const token = jwt.sign({ _id: findUser._id }, process.env.SECRET_KEY, { expiresIn: '30m' });
      providerOrClientId = findUser._id;
      return res.json({ token });
    }

    return res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.error('Error in handleClientSignIn:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const handleProviderSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const findUser = await SkillerModel.findOne({ email });

    if (findUser) {
      const compare = await bcryptjs.compare(password, findUser.password);
      if (!compare) {
        return res.status(401).send('Email or password is incorrect');
      }
      const token = jwt.sign({ _id: findUser._id }, process.env.SECRET_KEY, { expiresIn: '30m' });
      providerOrClientId = findUser._id;
      return res.json({ token });
    }

    return res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.error('Error in handleProviderSignIn:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



export const sendProviderIdToFront = async(req, res) => {
  res.send(providerOrClientId)
}


export const handleClientSignUp = async(req, res) => {

  const findProviderUser = await SkillerModel.findOne({email: req.body.email})   
  // const findClientUser = await SkillerModel.findOne({email: req.body.email})  
  skillerId = req.body._id                                          
 if (findProviderUser || findClientUser){
     res.send(false)
  }else{
        const salt = await bcryptjs.genSalt(10);
        const hashedPwd = await bcryptjs.hash(req.body.password, salt)
        await SkillerModel.insertMany({
            _id: skillerId,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: hashedPwd,
            newMessage: false

        })

        const findUser2 = await SkillerModel.findOne({email: req.body.email})

        const token =  jwt.sign({_id: findUser2?._id}, process.env.SECRET_KEY, {expiresIn: '1m'})
        providerOrClientId = findUser2?._id
        res.json(token)

        
    
    }


}


 


                        
// export const handleSkillerSignIn = async (req, res) => {
//   try {
//     // Validate incoming request body
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     // Find skiller by email
//     const skiller = await SkillerModel.findOne({ email });

//     if (!skiller) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     skillerId = skiller._id;
//     // Compare provided password with hashed password
//     const isPasswordValid = await bcryptjs.compare(password, skiller.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Email or password is incorrect' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ _id: skiller._id }, process.env.SECRET_KEY, { expiresIn: '30m' });

//     // Return the token in a secure response
//     return res.status(200).json({ token });

//   } catch (error) {
//     // Log the error and return a generic server error message
//     console.error('Error in handleSkillerSignIn:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };












// export const handleSkillerSignIn = async(req, res) => {
//   try {
//     const { email, password } = req.body;
//     const skiller = await SkillerModel.findOne({ email });
    

//     if (skiller) {
//       const compare = await bcryptjs.compare(password, skiller.password);
//       if (!compare) {
//         return res.status(401).send('Email or password is incorrect');
//       }
//       const token = jwt.sign({ _id: skiller._id }, process.env.SECRET_KEY, { expiresIn: '30m' });
//       skillerId = skiller._id;
//       console.log('skiller sign in token =================================================================================>>> ',token)
//       console.log('skiller id ===========================================>>>> ', skillerId)
//       console.log('skiller ====================================>>>>> ',skiller)
//       return res.json({ token });
//     }

//     return res.status(404).json({ error: 'User not found' });
//   } catch (error) {
//     console.error('Error in handleProviderSignIn:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }

export const handleProviderSignUp = async(req, res) => {
  console.log(req.body)
   const findProviderUser = await SkillerModel.findOne({email: req.body.email})   
  //  const findClientUser = await SkillerModel.findOne({email: req.body.email})                                            
  if (findProviderUser ){
      res.send(false)
   }else{
     const salt = await bcryptjs.genSalt(10);
       const hashedPwd = await bcryptjs.hash(req.body.password, salt)
       providerOrClientId = req.body._id  
  
       await SkillerModel.insertMany({
            _id: providerOrClientId,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashedPwd,
        newMessage: false

    }) 
    const findUser2 = await SkillerModel.findOne({email: req.body.email})
    console.log('findUser2 => '+findUser2)
    const token = jwt.sign({_id: findUser2?._id}, process.env.SECRET_KEY, {expiresIn: '1m'})
    console.log(token)
    res.json({token})

   }
}




export const verify = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log('token ==========>================>================> ' + token);
  
  if (!token) {
    return res.status(403).send('Token not provided');
  }

  const bearerToken = token.split(' ')[1];

  jwt.verify(bearerToken, process.env.SECRET_KEY, (err, authData) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }
    req.authData = authData;
    res.json({ permission: 'true' });
    return; // Stop execution after sending response
  });
};



export const insertPost = async(req, res)=>{
  console.log('reqSkills ====> '+req.body.skills)
  await PostsModel.insertMany({
    postId: req.body._id,
    clientId: providerOrClientId,
    term: req.body.term,
    title: req.body.title,
    skills: req.body.skills,
    scope: req.body.scope,
    experience: req.body.experience,
    pudget: req.body.pudget,
    description: req.body.description,
    
  })
} 

// export const getPosts = async(req, res) => {
//   let relatedPosts = []
//   if (providerOrClientId){
//     const provider = await ProviderModel.findById(providerOrClientId)
//     const allPosts = await PostsModel.find()
//      allPosts?.map((post) => console.log('post category ===> '+post.skills))
//      allPosts?.map((post) => post.skills.map((postSkill) => provider?.categories.map((providerCategory)=> {
//       if(postSkill === providerCategory && !relatedPosts.includes(post))  {
//       relatedPosts.push(post)
//       }
  
//     })))
//      res.send(relatedPosts)
//   }

// }

handleSkillerSignUp






export const deleteLetter = async(req, res)=> {

try
{
  const skillerId = req.query.skillerId
  // Update the provider's letter
  await SkillerModel.findOneAndUpdate(
    { _id: skillerId },
    { $set: { letter: null } },
    { new: true }
  );
  res.status(200).message('letter deleted successfully')
}catch(error){
 
}
}

export const insertPicture = async(req, res)=>{
  console.log('req.body.name from insertPicture =================================== >>>>>>>>>>>> > > >  > > > >  ',req.body.name)
  console.log('req.file.buffer from insertPicture ==============================----------------------------------------------------=-=-=-=-  > >  > > >  ',req.file.buffer)
  console.log('req.file.mimeType from insertPicture =========================================-=-=-=-=--------------------=-=-=> > > > > >  > ',req.file.mimetype)
  try{
    await SkillerModel.findOneAndUpdate(
      {_id: skillerId},
      {$set: {picture: {
        name: req.body.name,
        picture: {
          data: req.file.buffer,
          contentType: req.file.mimetype
        }
       
      }}},
      {new: true}
    )
  }catch(error){

  }

}


export const insertPdfExperience = async(req, res) => {
 try
{  await SkillerModel.findOneAndUpdate(
    {_id: skillerId},
    {$push: {
      contentUrl: req.body.pdfUrl,
      _id: req.body.id
    }},
    {new: true}
  )}catch(error){
  
  }
}



// export const insertImageCertificate = async(req, res) => {

//   console.log('req.body from insertImage certification ========================-=-=====================================-=-=-=-=-=>>>>>> > > > > >   ',req.body)
//   await SkillerModel.findByIdAndUpdate(
//     skillerId,
//     {$push: {imageCertifications: {
//       contentUrl: req.body.imageUrl,
//       _id: req.body.id
     
//     }}},
//     {new: true}
//   )
// }

export const insertImageExperience = async(req, res) => {

  req.file.buffer && req.file.mimetype &&
  await SkillerModel.findByIdAndUpdate(
     skillerId,
    {$push: {imageExperiences: {
      name: req.body.name,
      imageExperience: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        id: req.body.id

      }
     
    }}},
    {new: true}
  )
}

export const addRate = async (req, res) => {
  try {
    const { ratePerHour } = req.body;

    // Convert ratePerHour to a number
    const rateValue = parseFloat(ratePerHour);

    // Validate the rateValue
    if (isNaN(rateValue)) {
      return res.status(400).json({ error: 'Invalid rate per hour value' });
    }

    const updatedProvider = await ProviderModel.findOneAndUpdate(
      { _id: providerOrClientId },
      { $set: { ratePerHour: rateValue } },
      { new: true }
    );

    res.status(200).json(updatedProvider);
  } catch (error) {

  }
};
insertPicture
export const addBlog = async(req, res) => {

  await ProviderModel.findByIdAndUpdate(
    providerOrClientId,
    {
      blog: {
        name: req.body.name,
        picture: {
          
          data: req.file.buffer,
          contentType: req.file.mimetype
        }
      }
    },
    {new: true}
  )
  const provider =await ProviderModel.findById(providerOrClientId)
  console.log('provider  ===> '+provider)
}
export const getBlog = async(req, res) => {
  const provider = await ProviderModel.findById(providerOrClientId)
  console.log(provider?.blog)
  res.set('Content-Type', provider?.blog.picture.contentType)
  res.send(provider?.blog.picture.data)
}


export const getProfileData = async(req, res) => {
 
    provider = await ProviderModel.findById(providerOrClientId);


  res.json(provider)

}

export const getProfilePicture = async (req, res) => {
  try {

    if (!providerOrClientId) {
      return res.status(400).send('Provider ID is required');
    }


      provider = await ProviderModel.findById(providerOrClientId);
    
    if (!provider || !provider.picture || !provider.picture.picture) {
      return res.status(404).send('Profile picture not found');
    }

    res.set('Content-Type', provider.picture.picture.contentType);
    res.send(provider.picture.picture.data);
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};
export const getProfileIMAGE = async (req, res) => {
  try {

    if (!providerOrClientId) {
      return res.status(400).send('Provider ID is required');
    }

    let provider;
    if (proposalId) {
      provider = await ProviderModel.findById(proposalId);
    } else {
      provider = await ProviderModel.findById(providerOrClientId);
    }

    if (!provider) {
      return res.status(404).send('Provider not found');
    }
    const providerImageCertifications = provider.imageCertifications;
    const providerImageCertificationsImageCertificateData = providerImageCertifications.map(imageCertificate => {
      return {
        data: imageCertificate.imageCertificate.data.toString('base64'), // Convert binary to base64 string
        contentType: imageCertificate.imageCertificate.contentType,
        imageCertificationId: imageCertificate.imageCertificate.imageCertificationId
      };
    });

    res.json(providerImageCertificationsImageCertificateData);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};


export const getProfilePDF = async(req, res) => {
  try {

    if (!providerOrClientId) {
      return res.status(400).send('Provider ID is required');
    }

    if (proposalId){
      provider = await ProviderModel.findById(proposalId);
    }else{
      provider = await ProviderModel.findById(providerOrClientId);
    }


    
    const providerPdfCertifications = provider?.pdfCertifications;
    const providerPdfCertificationsPdfCertificateData = providerPdfCertifications?.map(pdfCertificate => {
      return {
        data: pdfCertificate.pdfCertificate.data.toString('base64'), // Convert binary to base64 string
        contentType: pdfCertificate.pdfCertificate.contentType,
        id: pdfCertificate.pdfCertificate.id
      };
    });

    res.json(providerPdfCertificationsPdfCertificateData);
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
}

export const getPdfExperience = async(req, res) => {
  try {

    if (!providerOrClientId) {
      return res.status(400).send('Provider ID is required');
    }
    if (proposalId){
      provider = await ProviderModel.findById(proposalId);
    }else{
      provider = await ProviderModel.findById(providerOrClientId);
    }



    const providerPdfExperiences = provider?.pdfExperiences;
    const providerPdfExperiencesPdfExperienceData = providerPdfExperiences?.map(pdfExperience => {
      return {
        data: pdfExperience.pdfExperience.data.toString('base64'), // Convert binary to base64 string
        contentType: pdfExperience.pdfExperience.contentType,
        id: pdfExperience.pdfExperience.id
      };
    });

    res.json(providerPdfExperiencesPdfExperienceData);
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
}

export const getImageExperience = async(req, res) => {
  try {

    if (!providerOrClientId) {
      res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.set('Access-Control-Allow-Credentials', 'true');

    }


    if (proposalId){
      provider = await ProviderModel.findById(proposalId);
    }else{
      provider = await ProviderModel.findById(providerOrClientId);
    }


    const providerImageExperiences = provider.imageExperiences;
    const providerImageExperiencesImageExperienceData = providerImageExperiences?.map((imageExperience) => {
      return {
        data: imageExperience.imageExperience.data.toString('base64'), // Convert binary to base64 string
        contentType: imageExperience.imageExperience.contentType,
        id: imageExperience.imageExperience.id
      };
    });

    res.json(providerImageExperiencesImageExperienceData);
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
}

export const insertProviderToClient = async(req, res)=> {
   clientId =JSON.stringify(req.params.id) ;
    clientId = clientId.replace(/"/g,"")


      const provider = await ProviderModel.findById(providerOrClientId)
      // const checkClient = await ClientModel.findById(clientId)
      // console.log('check client => '+ checkClient)
      // console.log('provider => '+ provider.email)

    const client = await ClientModel.findById(clientId)

       await ClientModel.findOneAndUpdate(
         {_id: clientId},
         {
          $push:  {incomingProviders:
            {
              incomingProvider:      {
                _id: providerOrClientId,
                providerName: provider.name,
                providerEmail: provider.email,
   
     
          }
            }
       ,

          }
         },
      
         {new: true}
       )
       //the blow is just for checking


}

export const getProviderData = async(req, res) => {
    const client = await ClientModel.findById(providerOrClientId)

     res.send(client?.incomingProviders)
}

export const submitProposal = async(req, res) => {
  let exist = false;
  const proposal = JSON.stringify(req.body);
  const client = await ClientModel.findById(clientId)
  client.proposals.map((proposal) => proposal.proposalId === providerOrClientId ? exist=true : null)
  if (!exist){
    await ClientModel.findByIdAndUpdate(
       clientId,
      {$push: {
        proposals: {
          proposalId: providerOrClientId,
          proposal: proposal
        }, 
      },
    },
    {new: true}
    )
    await ClientModel.findByIdAndUpdate(
      
       clientId,
        {
          $set: {
            newProposal: true
          }
        },
        {new: true}
      
    )
  }

}

export const getProposals = async(req, res)=>{
  const client = await ClientModel.findById(providerOrClientId)
  const proposals = client.proposals
  
  res.send(proposals)
}

export const getProposalId = async(req, res)=>{
  proposalId = req.params.id

}




export const sendMessageFromClientToProvider = async (req, res) => {
  const { message } = req.body; // Extract the message object from req.body
  const  providerId  = req.params.id; // Extract the provider ID from req.params
  const client = await ClientModel.findById(providerOrClientId)
  const clientName = client.name
  let NameExist = false
  const provider = await ProviderModel.findById(providerId)
  provider?.messages?.map((message) => message.message.name === clientName ? NameExist = true : null)
  try {
    // Ensure the _id is correctly formatted as ObjectId if needed

    if (!NameExist) {
await ProviderModel.findByIdAndUpdate(
        providerId,
        { $push: { messages: { 
          message:
          {
            _id: message.messageId,
            providerId: providerId, 
            clientId: providerOrClientId,
            name: clientName,
            message: message.message,
            response: false
          }
        } } },
         // Push the message object into messages array directly
        { new: true } // Return the updated document
      );
      await ClientModel.findByIdAndUpdate(
        providerOrClientId,
        {
          $push: {
            messages: {
              message: {
                _id: message.messageId,
                providerId: providerId, 
                clientId: providerOrClientId,

                message: message.message,
                response: true
              }
            }
          }
        },
        {new: true}
        
      )
      await ProviderModel.findByIdAndUpdate(
        providerId,
        {
          $set: {
            newMessage : true
          }
        },
        {new: true}
      )
    }else{
  await ProviderModel.findByIdAndUpdate(  
        providerId,
        { $push: { messages: {
          message:
          {
            _id: message.messageId,
            providerId: providerId,
            clientId: providerOrClientId,
            name: null,
            message: message.message,
            response: false
          }
        } } }, // Push the message object into messages array directly
        { new: true } // Return the updated document
      );

      await ProviderModel.findByIdAndUpdate(
        providerId,
        { $push: { messages: { 
          message:
          {
            _id: message.messageId,
            providerId: providerId, 
            clientId: providerOrClientId,
            name: clientName,
            message: message.message,
            response: false
          }
        } } },
         // Push the message object into messages array directly
        { new: true } // Return the updated document
      );
      await ClientModel.findByIdAndUpdate(
        providerOrClientId,
        {
          $push: {
            messages: {
              message: {
                _id: message.messageId,
                providerId: providerId, 
                clientId: providerOrClientId,

                message: message.message,
                response: true
              }
            }
          }
        },
        {new: true}
        
      )

      await ProviderModel.findByIdAndUpdate(
        providerId,
        {
          $set: {
            newMessage : true
          }
        },
        {new: true}
      )
    }


    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    res.status(200).json(provider); // Send the updated provider document as response
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessagesFromClientIntoProvider = async(req, res) => {
    const provider = await ProviderModel.findById(providerOrClientId)

    res.send(provider?.messages)
}

export const sendProviderToClientMessage = async(req, res) => {
  let NameExist = false;
  let message = JSON.stringify(req.body.message)
  message = message.replace(/"/g, "")
  let id = JSON.stringify(req.body._id)
  id = id.replace(/"/g, "")

   clientId = JSON.stringify(req.params.id)
   clientId = clientId.replace(/"/g, "")
   providerId = providerOrClientId
  const provider = await ProviderModel.findById(providerOrClientId)
  const providerName = provider?.name
  const client = await ClientModel.findById(clientId)
  client?.messages?.map((message) => providerName === message.message.name ? NameExist = true : null)
  if(!NameExist){
    await ClientModel.findByIdAndUpdate(
      clientId,
      { $push: { messages: { 
        message:
        { 
          _id: id,
          providerId: providerOrClientId,
          clientId: clientId,
          name: providerName,
          message: message,
          response: false
          
        }
      } } }, // Push the message object into messages array directly
      { new: true } // Return the updated document
    );

    await ClientModel.findByIdAndUpdate(
      clientId,
      {
        $set: {
          newMessage: true
        }
      },
      {new: true}

    )


    await ProviderModel.findByIdAndUpdate(
      providerOrClientId,
      { $push: { messages: {
        message:
        {
          _id: id,
          providerId: providerOrClientId,
          clientId: clientId,
          name: null,
          message: message,
          response: true
        }
      } } }, // Push the message object into messages array directly
      { new: true } // Return the updated document
    );
  }else{
    let message = JSON.stringify(req.body.message)
    message = message.replace(/"/g, "")
    let id = JSON.stringify(req.body._id)
    id = id.replace(/"/g, "")
    clientId = JSON.stringify(req.params.id)
    clientId = clientId.replace(/"/g, "")
    await ClientModel.findByIdAndUpdate(
      clientId,
      { $push: { messages: {
        message:
        { 
          _id: id,
          providerId: providerOrClientId,
          clientId: clientId,
          name: null,
          message: message
        }
      } } }, // Push the message object into messages array directly
      { new: true } // Return the updated document
    );


    await ProviderModel.findByIdAndUpdate(
      providerId,
      { $push: { messages: {
        message:
        {
          providerOrClientId,
          providerId: providerOrClientId,

          name: null,
          message: message,
          response: true
        }
      } } }, // Push the message object into messages array directly
      { new: true } // Return the updated document
    );
    await ClientModel.findByIdAndUpdate(
      clientId,
      {
        $set: {
          newMessage: true
        }
      },
      {new: true}

    )
  }



}

export const getProviderToClientMessagesInClient = async(req, res) => {
  try{
    const client = await ClientModel.findById(providerOrClientId);
    const messages = client?.messages
    res.send(messages)
  }catch(error){

  }

}














// Replace 'client_id' and 'client_secret' with your actual client ID and secret.




export const deleteImageCertificate = async (req, res) => {
  try {
    let  imageCertificateId=  JSON.stringify(req.params.id).replace(/"/g, "")




    // Find the provider by ID
    const provider = await ProviderModel.findById(providerOrClientId);

    if (!provider) {
      return res.status(404).send('Provider not found');
    }

    // Filter out the image certificate that matches the given ID
    provider.imageCertifications = provider?.imageCertifications?.filter(
      (imageCertificate) => imageCertificate.imageCertificate.imageCertificationId !== imageCertificateId
    );
    
    // Save the updated provider document
    await provider.save();

    res.status(200).send('Image certificate deleted successfully');
  } catch (error) {
    console.error('Error deleting image certificate:', error);
    res.status(500).send('Internal server error');
  }
};







export const deletePdfCertificate = async (req, res) => {
  try {
    let  pdfCertificateId=  JSON.stringify(req.params.id).replace(/"/g, "")




    // Find the provider by ID
    const provider = await ProviderModel.findById(providerOrClientId);

    if (!provider) {
      return res.status(404).send('Provider not found');
    }

    // Filter out the image certificate that matches the given ID
    provider.pdfCertifications = provider.pdfCertifications.filter(
      (pdfCertificate) => pdfCertificate.pdfCertificate.id !== pdfCertificateId
    );

    // Save the updated provider document
    await provider.save();

    res.status(200).send('Image certificate deleted successfully');
  } catch (error) {
    console.error('Error deleting image certificate:', error);
    res.status(500).send('Internal server error');
  }
};



export const deleteImageExperience = async (req, res) => {
  try {
    let  imageExperienceId=  JSON.stringify(req.params.id).replace(/"/g, "")




    // Find the provider by ID
    const provider = await ProviderModel.findById(providerOrClientId);

    if (!provider) {
      return res.status(404).send('Provider not found');
    }

    // Filter out the image certificate that matches the given ID
    provider.imageExperiences = provider.imageExperiences.filter(
      (imageExperience) => imageExperience.imageExperience.id !== imageExperienceId
    );

    // Save the updated provider document
    await provider.save();

    res.status(200).send('Image certificate deleted successfully');
  } catch (error) {
    console.error('Error deleting image certificate:', error);
    res.status(500).send('Internal server error');
  }
};


export const deletePdfExperience = async (req, res) => {
  try {
    let  pdfExperienceId=  JSON.stringify(req.params.id).replace(/"/g, "")




    // Find the provider by ID
    const provider = await ProviderModel.findById(providerOrClientId);

    if (!provider) {
      return res.status(404).send('Provider not found');
    }

    // Filter out the image certificate that matches the given ID
    provider.pdfExperiences = provider.pdfExperiences.filter(
      (pdfExperience) => pdfExperience.pdfExperience.id !== pdfExperienceId
    );

    // Save the updated provider document
    await provider.save();

    res.status(200).send('Image certificate deleted successfully');
  } catch (error) {
    console.error('Error deleting image certificate:', error);
    res.status(500).send('Internal server error');
  }
};




export const showClientPosts = async (req, res) => {
  try {
    // Extract clientId from URL parameters
    const clientId = req.params.id;
    console.log('clientId at back ===> ' + clientId);

    if (!clientId) {
      return res.status(400).send({ error: 'clientId is required' });
    }

    // Find all posts where clientId matches
    const posts = await PostsModel.find({ clientId: providerOrClientId });

    // Send the posts back in the response
    res.send(posts);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    // Send an error response in case something goes wrong
    res.status(500).send({ error: 'Failed to retrieve posts' });
  }
};



export const deletePost = async(req, res) => {
  const postId = req.params.id

  await PostsModel.findByIdAndDelete(postId)
}

export const deleteProviderMessage = async(req, res) => {
  const messageId = req.params.id
  
  const provider = await ProviderModel.findById(providerOrClientId);

  provider.messages =  provider.messages.filter((message) => message.message._id !== messageId)
   await provider.save();

}

export const deleteClientMessage = async(req, res) => {
  const messageId = req.params.id

  const client = await ClientModel.findById(providerOrClientId)
  client.messages = client.messages.filter((message) => message.message._id !== messageId)
  await client.save()
}
  
export const sendInvite = async(req, res) => {
  let nameExist =false;
  const providerEmail = req.body.providerEmail
 
  const client = await ClientModel.findById(providerOrClientId)

  const provider = await ProviderModel.findOne({email: providerEmail})
  provider?.invitaions.map((invitation) => 
    invitation.invitorClientName === client.name ?
    
      nameExist =true
    : null
  )
  if (provider && !nameExist){
    provider.invitaions.push({
      invitaion: {
        clientId: providerOrClientId,
        invitorClientName: client.name,
        invitaionContent: req.body.message
      }
    })
    
    await provider.save();
    await ProviderModel.findByIdAndUpdate(
      provider._id,
      {
        $set: {
          newInvite: true
        }
  
      },
      {new: true}
  
    )
    console.log(provider)
    res.send (true)
  }else{
    
  }

}

export const getInvitations = async(req, res) => {
  const provider = await ProviderModel.findById(providerOrClientId)
  res.send(provider.invitaions)
}

export const getInvitationContent = async(req, res) => {

  
  const provider = await ProviderModel.findById(providerOrClientId)
   const choosenInvitation = await provider?.invitaions.map((invitation) => {
    if(JSON.stringify(invitation._id) === JSON.stringify(choosenInvitationId)){
      return invitation
    }
   })

   res.send(choosenInvitation)
}

export const sendChoosenInvitationId = async(req, res) => {
    choosenInvitationId = req.params.id


    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee==============================>  ', req.params, '  <=================================================eeeeeeeeeeeeeeeeeeeeeeeee')

}



export const insertReport = async (req, res) => {
  try {
    const provider = await ProviderModel.findOne({ email: req.body.providerEmail });
    


    const client = await ClientModel.findById(providerOrClientId);
    
if(provider){
  const providerId = provider._id;

  const updatedProvider = await ProviderModel.findByIdAndUpdate(
    providerId,
    {
      $push: {
        reports: {
          report: {
            clientName: client.name,
            clientEmail: client.email,
            report: req.body.report,
          },
        },
      },
      $set: {
        newReportNotification: true
      }
    },
    { new: true }
  );
  res.send(true)
}








  } catch (error) {

  }
};


export const getReport = async(req, res) => {
    providerId = providerOrClientId;
    const provider = await ProviderModel.findById(providerId)
    const reports = provider?.reports
    console.log(reports)
    res.send(reports)
}

insertPost
export const deleteBlog = async (req, res) => {
  await ProviderModel.findByIdAndUpdate(
    providerOrClientId,
    {
      blog: {
        name: '',
        picture: {
          
          data: '',

        }

      }
    },
    {new: true}
  )
};

export const checkClientNewMessages = async(req, res) => {
  const client = await ClientModel.findById(providerOrClientId)
   res.send(client?.newMessage)
}
export const cancelClientNewMessages = async(req, res) => {
  await ClientModel.findByIdAndUpdate(
    providerOrClientId,
    {
      $set: {
        newMessage: false
      }
    },
    {new: true}
  )
}

export const checkProviderNewMessages = async(req, res) => {

  const provider = await ProviderModel.findById(providerOrClientId)
  console.log('provider new message state====> '+provider.newMessage)
  res.send(provider.newMessage)
}

export const cancelProviderNewMessages = async(req, res) => {
  await ProviderModel.findByIdAndUpdate(
    providerOrClientId, 
    {
      $set: {
        newMessage: false
      }
    },
    {new: true}
  )
}



export const checkProviderNewInvites = async(req, res) => {

  const provider = await ProviderModel.findById(providerOrClientId)
  console.log('provider new message state====> '+provider.newInvite)
  res.send(provider.newInvite)
}

export const cancelProviderNewInvites = async(req, res) => {
  await ProviderModel.findByIdAndUpdate(
    providerOrClientId, 
    {
      $set: {
        newInvite: false
      }
    },
    {new: true}
  )
}


export const checkClientNewProposals = async(req, res) => {
  const client = await ClientModel.findById(providerOrClientId)
   res.send(client?.newProposal)
}
export const cancelClientNewProposals = async(req, res) => {
  await ClientModel.findByIdAndUpdate(
    providerOrClientId,
    {
      $set: {
        newProposal: false
      }
    },
    {new: true}
  )
}



export const getClientProfilePicture = async (req, res) => {
  try {

    if (!skillerId) {
      return res.status(400).send('Provider ID is required');
    }


      const client = await SkillerModel.findById(skillerId);


    res.set('Content-Type', client.picture.picture.contentType);
    console.log('client ============>>> > > > > > > > > >  > > >>>  ', client)
    res.send(client.picture.picture.data);
//     console.log('client.picture.picture.contentType ===> > > > > ==> > => > > > >  ',client.picture.picture.contentType);
// console.log('client.picture.picture.data ====================>> >> > > > > >>> ',client.picture.picture.data);

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};


export const getSkillerProfilePicture = async (req, res) => {
  try {
    console.log('req.quey from **************************##########################   getSkillerProfilePicture *******************########################## =========> > > > > > >  ',req.query)
    console.log('req.query.skillerId from #################################*******************************getSkillerProfilePicture ***************************##########################======================================-==-=-=-=-=--=-=-=-=-=-=-=--=-=-=-> >>  >>  > > > > > >>   ',req.query.skillerId)
    const skiller = await SkillerModel.findById(req.query.skillerId).select('picture'); // Fetch only the picture field
    if (!skiller || !skiller.picture || !skiller.picture.picture) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    res.set('Content-Type', skiller.picture.picture.contentType); // Set the content type
    res.send(skiller.picture.picture.data); // Send the binary data
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getSkillerCoverPicture = async (req, res) => {
  try {
    const skillerId = req.query.skillerId;
    const skiller = await SkillerModel.findById(skillerId).select('coverPicture'); // Fetch only the picture field
 

    res.set('Content-Type', skiller.coverPicture.picture.contentType); // Set the content type
    res.send(skiller.coverPicture.picture.data); // Send the binary data
  } catch (error) {
 
    res.status(500).json({ message: 'Server error' });
  }
};
sendProviderToClientMessage
export const getClientProfileData = async(req, res) => {
 
  const client = await ClientModel.findById(providerOrClientId);


res.json(client)

}
export const getSkillerProfileData = async(req, res) => {
 
  const client = await SkillerModel.findById(skillerId);


res.json(client)

}
export const insertClientCategory = async (req, res) => {
  const categoriesFromFront = req.body;

   // Assuming you get providerOrClientId from req.user


  try {
    for (const categoryFromFront of categoriesFromFront) {
      await ClientModel.findByIdAndUpdate(
         providerOrClientId ,
        { $push: { categories: categoryFromFront } },
        { new: true }
      );
    }
    res.status(200).send({ message: "Categories updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred while updating categories" });
  }
};

export const getRelatedProviders = async(req, res) => {
  let relatedProviders = [];
  const client = await ClientModel.findById(providerOrClientId)
  const allProviders = await ProviderModel.find()
 allProviders?.map((provider) => 
  provider?.categories?.map((providerCategory) => client?.categories?.map((clientCategory) => 
  
    clientCategory === providerCategory && !relatedProviders.includes(provider) &&
  
    relatedProviders.push(provider)
  
  ))
  )

  await res.send(relatedProviders)
}

export const insertPaypalEmail = async(req, res) => {
  const paypalEmail= req.body.paypalEmail

  await ProviderModel.findByIdAndUpdate(
    providerOrClientId,
    {
       $set: {
         paypal_email: paypalEmail
       }
     },
     {new: true}
   )
}


export const getProfileIMAGE4client = async(req,res) => {

  providerId = req.params.id
  console.log('providerId ===========================>   '+providerId)
  try {

    if (!providerId) {
      return res.status(400).send('Provider ID is required');
    }

    const provider = await ProviderModel.findById(providerId)

    if (!provider) {
      return res.status(404).send('Provider not found');
    }
    const providerImageCertifications = provider?.imageCertifications;
    const providerImageCertificationsImageCertificateData = providerImageCertifications?.map(imageCertificate => {
      return {
        data: imageCertificate.imageCertificate.data.toString('base64'), // Convert binary to base64 string
        contentType: imageCertificate.imageCertificate.contentType,
        imageCertificationId: imageCertificate.imageCertificate.imageCertificationId
      };
    });

    res.json(providerImageCertificationsImageCertificateData);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
}

export const getProfilePDF4Client = async(req, res) => {
 providerId = req.params.id
 
  const provider= await ProviderModel.findById(providerId)




    
    const providerPdfCertifications = provider.pdfCertifications;
    const providerPdfCertificationsPdfCertificateData = providerPdfCertifications.map(pdfCertificate => {
      return {
        data: pdfCertificate.pdfCertificate.data.toString('base64'), // Convert binary to base64 string
        contentType: pdfCertificate.pdfCertificate.contentType,
        id: pdfCertificate.pdfCertificate.id
      };
    });

    res.json(providerPdfCertificationsPdfCertificateData);
    

}


export const getExperiencePDF4Client = async(req, res) => {
   providerId = req.params.id
  const provider = await ProviderModel.findById(providerId)



  const providerPdfExperiences = provider.pdfExperiences;
  const providerPdfExperiencesPdfExperienceData = providerPdfExperiences.map(pdfExperience => {
    return {
      data: pdfExperience.pdfExperience.data.toString('base64'), // Convert binary to base64 string
      contentType: pdfExperience.pdfExperience.contentType,
      id: pdfExperience.pdfExperience.id
    };
  });

  res.json(providerPdfExperiencesPdfExperienceData);
}



export const getExperienceIMAGE4Client = async(req, res) => {
   providerId = req.params.id
  const provider = await ProviderModel.findById(providerId)

  const providerImageExperiences = provider?.imageExperiences;
  const providerImageExperiencesImageExperienceData = providerImageExperiences?.map((imageExperience) => {
    return {
      data: imageExperience.imageExperience.data.toString('base64'), // Convert binary to base64 string
      contentType: imageExperience.imageExperience.contentType,
      id: imageExperience.imageExperience.id
    };
  });

  res.json(providerImageExperiencesImageExperienceData);
  
}



export const getBlog4Client = async(req, res) => {
   providerId = req.params.id
  const provider = await ProviderModel.findById(providerId)

  res.set('Content-Type', provider.blog.picture.contentType)
  res.send(provider.blog.picture.data)
}



export const getProfileData4Client = async(req, res) => {
   providerId = req.params.id
  const provider = await ProviderModel.findById(providerId)



  res.json(provider)


}




export const getProfilePicture4Client = async(req, res) => {
   providerId = req.params.id
  const provider = await ProviderModel.findById(providerId)




  
  if (!provider || !provider.picture || !provider.picture.picture) {
    return res.status(404).send('Profile picture not found');
  }

  res.set('Content-Type', provider.picture.picture.contentType);
  res.send(provider.picture.picture.data);

}



export const getReport4Client = async(req, res) => {
   providerId = req.params.id
  const provider = await ProviderModel.findById(providerId)

  const reports = provider.reports
  console.log(reports)
  res.send(reports)

}
sendInvite

export const insertInviteAcceptance = async(req, res) =>{
  clientId = req.params.id


  console.log('clientId ===========================================>  ',clientId, 'clientId < ========================================================================clientId')
  const provider = await ProviderModel.findById(providerOrClientId)
  await ClientModel.findByIdAndUpdate(
    clientId,
    {
      $push: {

        invitationAcceptances: {
          invitationAcceptance: {
            clientId: clientId,
            providerId: providerOrClientId,
            providerName: provider.name,
            providerEmail: provider.email
          }
        }

      },
      $set: {
        newInvitationAcceptance: true
      }
    },

    {
      $set: {
        newInvitationAcceptance: true
      }
    },
    {new: true}
  )
}

export const getInvitationAcceptance = async(req, res) => {


  const client =await ClientModel.findById(providerOrClientId)

  res.send(client?.invitationAcceptances)

}

export const checkNewInvitationAcceptanceState = async(req, res) => {
  const client = await ClientModel.findById(providerOrClientId)
  res.send(client?.newInvitationAcceptance)
}

export const killNewInvitationAcceptanceNotification = async(req, res) => {
  providerOrClientId &&
  await ClientModel.findByIdAndUpdate(
    providerOrClientId,
    {
      $set: {
        newInvitationAcceptance: false
      }
    },
    {new: true}
  )
}


export const checkNewReportNotification = async(req, res) => {
  const provider = await ProviderModel.findById(providerOrClientId)
  res.send(provider.newReportNotification)
}

export const killNewReportNotification = async(req, res) => {
  await ProviderModel.findByIdAndUpdate(
    providerOrClientId,
    {
      $set: {
        newReportNotification: false
      }
    },
    {new: true}
  )
}

// controllers/controllers.js

export const getCoursesByProvider = async (req, res) => {
  try {
    const providerId = req.params.id;

    // Retrieve all courses for the provider
    const courses = await CourseModel.find({ providerId });

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error retrieving courses:', error);
    res.status(500).json({ error: 'Failed to retrieve courses' });
  }
};

// controllers/controllers.js

// controllers/controllers.js

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const clientId = req.clientId; // Assuming you have client ID from authentication middleware

    // Logic to handle course purchase
    // Example: Save the purchase to the database, process payment, etc.

    res.status(200).json({ message: "Course purchased successfully" });
  } catch (error) {
    console.error("Error purchasing course:", error);
    res.status(500).json({ error: "Failed to purchase course" });
  }
};



// Create a new course// Controller for creating a course

export const createCourse = async (req, res) => {
  try {
    const { title, description, price, providerId } = req.body;

    if (!title || !description || !price || !providerId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newCourse = new CourseModel({
      providerId,
      title,
      description,
      price,
    });

    const savedCourse = await newCourse.save();

    res.status(201).json({ message: 'Course created successfully', courseId: savedCourse._id });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// Upload thumbnail controller


export const paidCrypto = async (req, res) => {
  await ClientModel.findByIdAndUpdate(
    providerOrClientId,
    {
      $set: {
        paidCrypto: true
      }
    },
    {new: true}
  )
}

export const checkIfPaid = async(req, res) => {
  const client = await ClientModel.findById(providerOrClientId)
  console.log('client.paidCrypto ===============================>>>>>', client?.paidCrypto)
  res.json({isPaid: client?.paidCrypto})
}

export const paidFacebookAds = async (req, res) => {
  await ClientModel.findByIdAndUpdate(
    providerOrClientId,
    {
      $set: {
        paidFacebookAds: true
      }
    },
    {new: true}
  )
}

export const checkIfPaidFacebookAds = async(req, res) => {
  const client = await ClientModel.findById(providerOrClientId)
  res.json({isPaid: client?.paidFacebookAds})
}

export const checkIfPaidPSCourse = async(req, res) => {
  const client = await ClientModel.findById(providerOrClientId)
  res.json({isPaid: client?.paidPSCourse})
}


export const paidPSCourse = async (req, res) => {
  await ClientModel.findByIdAndUpdate(
    providerOrClientId,
    {
      $set: {
        paidPSCourse: true
      }
    },
    {new: true}
  )
}


export const checkIfPaidYTCourse = async(req, res) => {
  const client = await ClientModel.findById(providerOrClientId)
  res.json({isPaid: client?.paidYTCourse})
}


export const paidYTCourse = async (req, res) => {
  await ClientModel.findByIdAndUpdate(
    providerOrClientId,
    {
      $set: {
        paidYTCourse: true
      }
    },
    {new: true}
  )
}

export const sendCustomerEmail = async(req, res) => {
  console.log('name ===> ',req.body.Name)
  console.log('email ====================> ', req.body.Email)
  console.log('number ==============================> ', req.body.Number)

  await CustomerModel.insertMany({
    name: req.body.Name,
    email: req.body.Email,
    number: req.body.Number
  })
}

export const sendFAADCustomerEmail = async(req, res) => {
  console.log('name ===> ',req.body.Name)
  console.log('email ====================> ', req.body.Email)
  console.log('number ==============================> ', req.body.Number)
  console.log('formData ============================================>> ', req.body)
  await FAADCustomerModel.insertMany({
    name: req.body.name,
    email: req.body.email,
    number: req.body.phone
  })
}



export const checkIfPaidTRCourse = async(req, res) => {
  const client = await ClientModel.findById(providerOrClientId)
  res.json({isPaid: client?.paidTRCourse})
}


export const paidTRCourse = async (req, res) => {
  await ClientModel.findByIdAndUpdate(
    providerOrClientId,
    {
      $set: {
        paidTRCourse: true
      }
    },
    {new: true}
  )
}




export const CryptoW1V2Completion = async (req, res) => {

  try {
    const updatedClient = await ClientModel.findByIdAndUpdate(
      providerOrClientId,
      {
        $set: {
          CRW1V2Completion: true // Update only W1V2Completion, without overwriting the entire object
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(updatedClient); // Return the updated client info
  } catch (error) {
    res.status(500).json({ message: "Error updating client", error });
  }
};



export const CheckCryptoW1V2Completion = async (req, res) => {
  try {
    const client = await ClientModel.findById(providerOrClientId);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json({ complete: client.CRW1V2Completion });
    console.log('client.CRW1V2Completion ==============================>  ', client.CRW1V2Completion)

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
let cryptoProgressStatus;
export const cryptoProgress = async(req, res) => {
  console.log('  cryptoProgressStatus =================================>>>  ', CryptoProgressStatus)
  res.json({ progress: cryptoProgressStatus });

}

export const setCryptoCompleted = async (req, res) => {
  const client = await ClientModel.findById(providerOrClientId)
  if(client?.CRW1V2Completion){
    await ClientModel.findByIdAndUpdate(
      providerOrClientId,
      {
        $set: {
          CRCompleted: true
        }
      },
      {new: true}
    )
  }


}

export const getCryptoCompletion = async(req, res) => {
  const client = await ClientModel.findById(providerOrClientId)
  if (client && client.CRW1V2Completion){
    res.json({completed: client.CRCompleted})
  }
}












function generateCertificateNumber() {
  return `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export const generateCertificateForCrypto = async (req, res) => {

  
  try {
      // Fetch user and course details
      const user = await ClientModel.findById(providerOrClientId)


      // Check if user has completed the course
      if (!user.CRCompleted) {
          return res.status(403).json({ message: 'Course not completed yet' });
      }

      // Generate unique certificate number
      const certificateNumber = generateCertificateNumber();

      // Create the PDF
      const doc = new PDFDocument();
      const certificatePath = path.join(__dirname, `../certificates/${user.name}-Cryptocurrency trading level 1.pdf`);
      const imagePath = path.join(__dirname, `../certificates/${user.name}-Cryptocurrency trading level 1.png`);

      // Add the certificate template and user details
      doc.image('../certificates/certificate-template.png', 0, 0, { width: 612 });
      doc.fontSize(20).text(user.name, 150, 200);
      doc.fontSize(15).text('Cryptocurrency trading level 1', 150, 250);
      doc.fontSize(12).text(`Certificate Number: ${certificateNumber}`, 150, 300);

      // Save the certificate as a PDF
      doc.pipe(fs.createWriteStream(certificatePath));
      doc.end();

      // Convert the PDF to an image
      sharp(certificatePath)
          .png()
          .toFile(imagePath, (err, info) => {
              if (err) {
                  return res.status(500).json({ message: 'Error generating image', error: err });
              }

              // Send both the PDF and image paths
              res.json({
                  pdf: `/certificates/${user.name}-Cryptocurrency trading level 1.pdf`,
                  image: `/certificates/${user.name}-Cryptocurrency trading level 1.png`
              });
          });
  } catch (error) {
      return res.status(500).json({ message: 'Error generating certificate', error });
  }
};

export const getClientId = async (req, res) => {
  res.json({clientId: providerOrClientId })
}

getRelatedProviders












export const uploadCertificateWithName = async (req, res) => {
  try {
    // Validate skiller ID from request or session

    if (!skillerId) {
      return res.status(400).json({ error: 'Skiller ID is required' });
    }

    // Find the skiller by ID
    const skiller = await SkillerModel.findById(skillerId);
    if (!skiller) {
      return res.status(404).json({ error: 'Skiller not found' });
    }

    const userName = skiller.name;
    if (!userName) {
      return res.status(400).json({ error: 'Skiller name is missing' });
    }

    // Load the certificate template
    const templatePath = path.join(__dirname, '../certificates/certificate-template.png');
    const img = await loadImage(templatePath);

    // Create a canvas based on the template image
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    // Draw the template image
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Configure text properties
    ctx.fillStyle = 'black';
    ctx.font = '60px sans-serif'; // Adjust font size and style as needed

    // Center the text on the canvas
    const textWidth = ctx.measureText(userName).width;
    const xPos = (canvas.width - textWidth) / 2; // Center horizontally
    const yPos = canvas.height / 2; // Adjust this for vertical alignment
    ctx.fillText(userName, xPos, yPos);

    // Convert the canvas to a buffer
    const buffer = canvas.toBuffer('image/png');

    // Update the skiller's certifications
    await SkillerModel.findByIdAndUpdate(
      skillerId,
      {
        $push: {
          certifications: {
            _id: req.body.certificationId,
            examId: req.body.examId,
            worldId: req.body.worldId,
            levelId: req.body.levelId,
            name: `certificate-${skillerId}.png`,
            data: buffer,
            contentType: 'image/png',
          },
        },
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({ message: 'Certificate generated and uploaded successfully!' });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ error: 'An error occurred while generating the certificate.' });
  }
};





// export const uploadCertificateWithName = async (req, res) => {
//   const skiller = await SkillerModel.findById(skillerId);

//   if (!skiller) {
//     return res.status(404).json({ message: 'Client not found' });
//   }

//   const userName = skiller.name;

//   try {
//     const templatePath = path.join(__dirname, '../certificates/certificate-template.png');
    
//     // Load the certificate template
//     const img = await loadImage(templatePath);
    
//     // Create a canvas with the same size as the image
//     const canvas = createCanvas(img.width, img.height);
//     const ctx = canvas.getContext('2d');

//     // Draw the template image on the canvas
//     ctx.drawImage(img, 0, 0, img.width, img.height);

//     // Set font and color for text
//     ctx.fillStyle = 'black';
//     ctx.font = '60px sans-serif'; // You can adjust the font size and style

//     // Measure the text width to center it horizontally
//     const textWidth = ctx.measureText(userName).width;
//     const xPos = (canvas.width - textWidth) / 2; // Center horizontally
//     const yPos = canvas.height / 2; // Adjust this based on where you want the text

//     // Draw the text (the user's name)
//     ctx.fillText(userName, xPos, yPos);

//     // Save the image to a buffer
//     const buffer = canvas.toBuffer('image/png');
    

//     await SkillerModel.findByIdAndUpdate(
//       {
//         skillerId
//       },
//       {
//         $push: {
//           certifications: {
//             _id: req.body._id,
//             examId: req.body.examId,
//             worldId: req.body.worldId,
//             levelId: req.body.levelId,
//             name: `certificate-${providerOrClientId}.png`,
//             data: buffer,
//             contentType: 'image/png',
        
//           }
//         }
//       }
//     )

//     res.status(200).json({ message: 'Certificate generated and uploaded successfully!' });
//   } catch (error) {
//     console.error('Error generating certificate:', error);
//     res.status(500).json({ message: 'An error occurred while generating the certificate.' });
//   }
// };



export const getCryptoCertificate = async (req, res) => {
  try {

    if (!providerOrClientId) {
      return res.status(400).send('Client ID is required');
    }


      const client = await ClientModel.findById(providerOrClientId);
    
    if (!client || !client.certificate) {
      return res.status(404).send('Profile picture not found');
    }

    res.set('Content-Type', client.certificate.contentType);
    res.send(client.certificate.data);
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};


export const checkIfPaidNewMoney = async(req, res) => {
  const client = await ClientModel.findById(providerOrClientId)
  res.json({isPaid: client?.isPaidNewMoney})
}

export const paidNewMoney = async (req, res) => {
  await ClientModel.findByIdAndUpdate(
    providerOrClientId,
    {
      $set: {
        paidCrypto: true
      }
    },
    {new: true}
  )
}

export const sendCodingCustomerEmail = async(req, res) => {
  console.log('name ===> ',req.body.Name)
  console.log('email ====================> ', req.body.Email)
  console.log('number ==============================> ', req.body.Number)
  console.log('formData ============================================>> ', req.body)
  await CodingCustomerModel.insertMany({
    name: req.body.name,
    email: req.body.email,
    number: req.body.phone
  })
}


// Create new instructor
export const createInstructor = async (req, res) => {
    try {
        const {
            _id,
            name,
            surname,
            instructorDescription,
            allowedToUpload,
            instructorLevel,
            worlds
        } = req.body;

        // Validation
        if (!name || !surname || !instructorLevel || !Array.isArray(worlds)) {
            return res.status(400).json({ message: "Missing required fields or invalid format" });
        }

        // Create new instructor instance
        const newInstructor = new InstructorModel({
            _id,
            name,
            surname,
            instructorDescription,
            allowedToUpload,
            instructorLevel,
            worlds
        });

        // Save to MongoDB
        await newInstructor.save();

        res.status(201).json({ message: "Instructor created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



///////////////////////////////////////////////////////////


// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('thumbnail'); // Single file upload middleware for the thumbnail











export const uploadTrailer = async(req, res) => {
    //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
      //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
        //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
          //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
  const { elements } = req.body;


  if(req.query.worldId){
   worldId = req.query.worldId}
  try {
    // Initialize arrays for each type of content
    const photos = [];
    const videos = [];
    const texts = [];

    // Iterate over elements to separate them based on type
// Iterate over elements to separate them based on type
elements.forEach((el, index) => {
  if (el.type === 'photo') {
    photos.push({ contentUrl: el.content, order: index + 1 });  // Add order property
  } else if (el.type === 'video') {
    videos.push({ contentUrl: el.content, order: index + 1 });  // Add order property
  } else if (el.type === 'text') {
    texts.push({ text: el.content, order: index + 1 });         // Add order property for text
  } 
});

console.log('elements from uploadTrailer =======================================-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-> > >> >  > >>  > > > > >  ',elements)
const instructor = await SkillerModel.findById(skillerId)
const world = instructor.worlds.find(w => w.worldName === worldName);

    // Construct the lesson object with the separated arrays

    const trailer = {
      photos,      // Array of photos
      videos,      // Array of videos
      texts,       // Array of text content
    };
    // Update the course with the new lesson
     await SkillerModel.findOneAndUpdate(
      {
        _id: skillerId,
        "worlds._id": worldId, // Find the world by name within the instructor's worlds array

      },
      {
        $set: {
          "worlds.$[world].worldTrailer": { // Use array filters to target the correct world and level
            photos,      // Array of photos
            videos,      // Array of videos
            texts,       // Array of text content
          },
        },
      },
      {
      arrayFilters: [
        { "world._id": worldId }, // Filter to match the world
      ],
        new: true // Return the updated document
      }
    );

    await WorldsModel.findOneAndUpdate(
      {
        _id: worldId,

      },
      {
        $set: {
          worldTrailer: 
{          photos,      // Array of photos
            videos,      // Array of videos
            texts,       // Array of text content
}
          },
        },
      
      {
        new: true, // Return the updated document
      }
    );


    res.status(200).json({ message: "Lesson added successfully", trailer });
  } catch (error) {
    console.error("Error uploading course:", error);
    res.status(500).json({ message: "Error uploading course", error });
  }
}











  
  export const editLesson = async (req, res) => {
    if(req.body.levelId){
      levelId = req.body._id
    }
    if(req.body.worldId){
      worldId = req.body.worldId
    }
    if(req.body._id){
      lessonId = req.body._id
    }
 try
{      // Extract data from the request body

      console.log("Request body for editing level =======================================-=-=-=-=-=-=-=-=-=-- >> > > > >  >  ", req.body);
  const {lessonTitle, lessonDescription} = req.body;
      // Validate required fields

      // Update the level within the specified world for the instructor
      const updatedInstructor = await SkillerModel.updateMany(
        { "worlds._id": worldId, "worlds.levels._id": levelId, "worlds.levels.lessons._id": lessonId }, // Match level and world
        {
          $set: {
            "worlds.$[worldFilter].levels.$[levelFilter].lessons.$[lessonFilter].lessonTitle": lessonTitle,
            "worlds.$[worldFilter].levels.$[levelFilter].lessons.$[lessonFilter].lessonDescription": lessonDescription || "",

          },
        },
        {
          arrayFilters: [
            { "worldFilter._id": worldId },
            { "levelFilter._id": levelId },
            {"lessonFilter._id": lessonId}
          ],
          new: true, // Return the updated document
        }
      );

      if (!updatedInstructor) {
        return res.status(404).json({ message: "Instructor or world not found." });
      }

      console.log("Updated instructor document:", updatedInstructor);

      // Update the WorldsModel with the updated level details
      const updatedWorld = await WorldsModel.findOneAndUpdate(
        { _id: worldId, "levels._id": levelId , "levels.lessons._id": lessonId}, // Match world and level
        {
          $set: {
            "levels.$[levelFilter].lessons.$[lessonFilter].lessonTitle": lessonTitle,
            "levels.$[levelFilter].lessons.$[lessonFilter].lessonDescription": lessonDescription || "",

          },
        },
        {
          arrayFilters: [
            { "worldFilter._id": worldId },
            { "levelFilter._id": levelId },
            {"lessonFilter._id": lessonId}
          ],
          new: true, // Return the updated document
        }
      );


      console.log("Updated world document:", updatedWorld);

      res.status(200).json({ message: "Level updated successfully" });}
      catch(error){
        console.log(error.message)
      }
  };

    // export const addLevel = async (req, res) => {
    //     //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    // //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    // //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    //   //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    //     //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    //       //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    //       let toBeAnAdvisorLevel;
    //       let levelDescription;
    //   try {

    //     if(req.body.levelId){
    //       levelId = req.body.levelId
    //     }
    //     if(req.body.worldId){
    //       worldId = req.body.worldId
    //     }
    //     if(req.body.levelNumber){
    //       levelNumber = req.body.levelNumber
    //     }
    //     if(req.body.levelTitle){
    //       levelTitle = req.body.levelTitle
    //     }
    //     if(req.body.levelDescription){
    //       levelDescription = req.body.levelDescription
    //     }
    //     if(req.body.toBeAnAdvisorLevel){
    //       toBeAnAdvisorLevel = req.body.toBeAnAdvisorLevel
    //     }
    //     console.log('req.body =========================--------------------------------> > > > >>>> >>>  >>  ',req.body)
    //     console.log('worldId from addLevel =========----------=======----------=-->> >> > > > > > > ',worldId)
    //     // Replace with actual instructor ID or get it from the request if dynamic
    //     const instructorId = skillerId;

    //     // Find the instructor document and update the specific world
    //     const updatedInstructor = await SkillerModel.findOneAndUpdate(
    //       { _id: skillerId, "worlds._id": worldId 

            
    //       }, // Find the world by name within the instructor's worlds array
    //       {
    //         $push: {
    //           "worlds.$.levels": { // Use positional operator `$` to target the correct world
    //             _id: levelId, // Convert levelId to ObjectId
    //             levelNumber,
    //             levelTitle,
    //             levelDescription,
    //             toBeAnAdvisorLevel : toBeAnAdvisorLevel
    //           },
    //         },
    //       },
    //       { new: true } // Return the updated document
    //     );

    //     await WorldsModel.findByIdAndUpdate(
    //         worldId , // Correct filter format
    //       {
    //           $push: {
    //               levels: {
    //                   _id: levelId,
    //                   levelNumber,
    //                   levelTitle,
    //                   levelDescription,
    //                   toBeAnAdvisorLevel : toBeAnAdvisorLevel
    //               },
    //           },
    //       },
    //       { new: true }
    //    );
       

    //     if (!updatedInstructor) {
    //       return res.status(404).json({ message: 'World not found or Instructor not found' });
    //     }

    //     res.status(200).json({ message: 'Level added successfully' });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Error adding level', error });
    //   }
    // };


    
export const uploadLevelTrailer = async(req, res) => {
    //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
      //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
        //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
          //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
  const { elements, worldName } = req.body;
  if(req.body.levelId){
   levelId = req.body.levelId}
if(req.query.worldId){
   worldId = req.query.worldId}

  try {
    // Initialize arrays for each type of content
    const photos = [];
    const videos = [];
    const texts = [];

    // Iterate over elements to separate them based on type
// Iterate over elements to separate them based on type
elements.forEach((el, index) => {
  if (el.type === 'photo') {
    photos.push({ contentUrl: el.content, order: index + 1 });  // Add order property
  } else if (el.type === 'video') {
    videos.push({ contentUrl: el.content, order: index + 1 });  // Add order property
  } else if (el.type === 'text') {
    texts.push({ text: el.content, order: index + 1 });         // Add order property for text
  } 
});
const instructor = await SkillerModel.findById(skillerId)
const world = instructor.worlds.find(w => w.worldName === worldName);
const level = world.levels(l => l._id === levelId)

    // Construct the lesson object with the separated arrays

    const trailer = {
      photos,      // Array of photos
      videos,      // Array of videos
      texts,       // Array of text content
    };
    // Update the course with the new lesson
     await SkillerModel.findOneAndUpdate(
      {
        _id: skillerId,
        "worlds.worldName": worldName, // Find the world by name within the instructor's worlds array
        "worlds.levels.levelId": levelId,
      },
      {
        $push: {
          "worlds.$[world].levels.$[level].levelTrailer": { // Use array filters to target the correct world and level
            photos,      // Array of photos
            videos,      // Array of videos
            texts,       // Array of text content
          },
        },
      },
      {
        arrayFilters: [
          { "world.worldId": worldId }, // Filter to match the world
          {"level.levelId": levelId}
        ],
        new: true, // Return the updated document
      }
    );

    await WorldsModel.findOneAndUpdate(
      {
        _id: worldId,
        "levels.levelId": levelId, // Find the world by name within the instructor's worlds array
      },
      {
        $push: {
          "levels.$[level].levelTrailer": { // Use array filters to target the correct world and level

            photos,      // Array of photos
            videos,      // Array of videos
            texts,       // Array of text content

          },
        },
      },
      {
        arrayFilters: [
          { "level.levelId": levelId } // Filter to match the level
        ],
        new: true, // Return the updated document
      }
    );

    res.status(200).json({ message: "Lesson added successfully", trailer });
  } catch (error) {
    console.error("Error uploading course:", error);
    res.status(500).json({ message: "Error uploading course", error });
  }
}







    // export const uploadCourse = async (req, res) => {
    //     //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    // //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    // //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    //   //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    //     //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    //       //////check isgraduated  //////check isgraduated  //////check isgraduated  //////check isgraduated
    //       let lessonDescription;
    //   const {    
    //         _id,

    //     lessonNumber,
    //     lessonTitle, // Include lessonTitle


    //   } = req.body;

    //   if (req.body.worldId) {
    //     worldId = req.body.worldId
    //   }
    //   if(req.body.levelId){
    //     levelId = req.body.levelId
    //   }
    //   if (req.body.lessonDescription){
    //     lessonDescription = req.body.lessonDescription
    //   }
    //   if(req.body.elements){
    //     elements = req.body.elements
    //   }
    //   console.log('req.body from add lesson ===============-----------============-----------============-=--------->> > > > > > >  ',req.body)
    //   try {
    //     // Initialize arrays for each type of content
    //     const photos = [];
    //     const videos = [];
    //     const texts = [];
    //     const quizs = [];
    
    //     // Iterate over elements to separate them based on type
    // // Iterate over elements to separate them based on type
    // elements.forEach((el, index) => {
    //   if (el.type === 'photo') {
    //     photos.push({ contentUrl: el.content, order: index + 1 });  // Add order property
    //   } else if (el.type === 'video') {
    //     videos.push({ contentUrl: el.content, order: index + 1 });  // Add order property
    //   } else if (el.type === 'text') {
    //     texts.push({ text: el.content, order: index + 1 });         // Add order property for text
    //   } else if (el.type === 'quiz') {
    //     quizs.push({
    //       question: el.content,
    //       choices: el.choices,
    //       correctAnswer: el.correctAnswer,
    //       order: index + 1
    //     });  // Add order property for quiz
    //   }
    // });
    // const instructor = await SkillerModel.findById(skillerId)
    // const world = instructor.worlds.find(w => w._id === worldId);
    // const level = world.levels.find(l => l._id === levelId);
    // const lessonNumber = level?.lessons?.length ? level.lessons.length + 1 : 1;
    // console.log('lessonNumber ===========>>>>>>>>>>>>>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>',lessonNumber)
    // console.log('lessonNumber ===============>>>>>>> =====>>>>>> ==========>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',lessonNumber)
    
    //     // Construct the lesson object with the separated arrays
    //     const lesson = {
    //       _id: _id,
    //       lessonNumber,
    //       lessonDescription: 'Lesson ${lessonNumber}',
    //       photos,      // Array of photos
    //       videos,      // Array of videos
    //       texts,       // Array of text content
    //       quizs        // Array of quizzes
    //     };
    
    //     // Update the course with the new lesson
    //      await SkillerModel.findOneAndUpdate(
    //       {
    //         _id: skillerId,
    //         "worlds._id": worldId, // Find the world by name within the instructor's worlds array
    //         "worlds.levels._id": levelId // Find the level by id within the selected world
    //       },
    //       {
    //         $push: {
    //           "worlds.$[world].levels.$[level].lessons": { // Use array filters to target the correct world and level
    //             _id: _id,
    //             lessonNumber,
    //             lessonDescription: 'Lesson ${lessonNumber}',
    //             photos,      // Array of photos
    //             videos,      // Array of videos
    //             texts,       // Array of text content
    //             quizs        // Array of quizzes
    //           },
    //         },
    //       },
    //       {
    //         arrayFilters: [
    //           { "world._id": worldId }, // Filter to match the world
    //           { "level._id": levelId } // Filter to match the level
    //         ],
    //         new: true, // Return the updated document
    //       }
    //     );
    //     await WorldsModel.findOneAndUpdate(
    //       {
    //         _id:worldId,


    //         "levels._id": levelId // Find the level by id within the selected world
    //       },
    //       {
    //         $push: {
    //           "levels.$[level].lessons": { // Use array filters to target the correct world and level
    //             _id: _id,
    //             lessonNumber,
    //             lessonDescription: 'Lesson ${lessonNumber}',
    //             photos,      // Array of photos
    //             videos,      // Array of videos
    //             texts,       // Array of text content
    //             quizs        // Array of quizzes
    //           },
    //         },
    //       },
    //       {
    //         arrayFilters: [
    //           { "level._id": levelId } // Filter to match the level
    //         ],
    //         new: true, // Return the updated document
    //       }
    //     );
    
    
    //     res.status(200).json({ message: "Lesson added successfully", lesson });
    //   } catch (error) {
    //     console.error("Error uploading course:", error);
    //     res.status(500).json({ message: "Error uploading course", error });
    //   }
    // };

    getProviderToClientMessagesInClient









    export const getWorlds = async (req, res) => {
      try {

        if (!skillerId) {
          return res.status(400).json({ error: "Skiller ID is required" });
        }
    
        // Fetch the instructor with only the 'worlds' field
        const instructor = await SkillerModel.findById(skillerId, 'worlds');
        if (!instructor) {
          return res.status(404).json({ error: "Instructor not found" });
        }
    
        // Transform the 'worlds' data to include only relevant fields
        const worlds = instructor.worlds.map((world) => ({
          name: world.worldName,
          description: world.worldDescription,
          thumbnail: world.worldThumbnail
            ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
            : null,
        }));
    
        res.status(200).json({ worlds });
      } catch (error) {
        console.error("Error fetching worlds:", error);
        res.status(500).json({ error: "An error occurred while fetching worlds" });
      }
    };
    
// export const getWorlds = async (req, res) => {  

//   try {


//     const instructor = await SkillerModel.findById(skillerId, 'worlds');
//     if (!instructor) {
//       return res.status(404).json({ message: 'Instructor not found' });
//     }

//     // Extract only the necessary fields for each world
//     const worlds = instructor.worlds.map((world) => ({
//       name: world.worldName,
//       description: world.worldDescription,
//       thumbnail: world.worldThumbnail ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}` : null,
//     }));

//     res.status(200).json(worlds);
//   } catch (error) {
//     console.error("Error fetching worlds:", error);
//     res.status(500).json({ message: "Error fetching worlds", error });
//   }
// };

export const getWorldsForGetAllWorlds = async (req, res) => {

 

}


export const getAllWorlds = async (req, res) => {
 
    // Fetch published worlds directly
    //
    // if(worldsForGetAllWorlds.length === 0) {
       worldsForGetAllWorlds = await WorldsModel.find(
        { published: true }, // Filter published worlds in the query
        {
            _id: 1,
            worldName: 1,
             price: 1,
             published: 1,
             draft: 1,
             category: 1,
             worldDescription: 1,
             dateOfPublish: 1,
             isWorldAllowingAdvisors: 1,

            worldThumbnail: 1,

             publisher: 1,
             rates: {
              _id: 1,
              rate: 1,
             },

            // comments: 1,
            // students: 1,
            // advisors: 1, 

       
        }
    )//.limit(4).skip(nextStartPoint)
    //nextStartPoint = nextStartPoint + 4

 
    // Respond with the fetched worlds
 

//<-- to count if there are more worlds ---> ssss
    // const totalWorlds = await WorldsModel.countDocuments({ published: true });
    // const hasNextPage = nextStartPoint + PAGE_SIZE < totalWorlds;
//<-- to count if there are more worlds ---> eeee

      res.status(200).json(worldsForGetAllWorlds)

    

};

 export const getWorldComments = async(req, res) => {
 
  try
{  const world = await WorldsModel.findById(req.query.worldId).select('comments')
 
  res.status(200).json(world.comments)}
  catch(error){

  }
 }



 

// Controller
// // // // export const getAllWorlds = async (req, res) => {
// // // //   try {
// // // //       const skiller = await SkillerModel.findById(skillerId);
// // // //       const skWorlds = skiller.worlds;
// // // //       const skCart = skiller.myCart;

// // // //       const worlds = await WorldsModel.find({}, {
// // // //           _id: 1,
// // // //           worldName: 1,
// // // //           price: 1,
// // // //           published: 1,
// // // //           draft: 1,
// // // //           students: 1,
// // // //           advisors: 1,
// // // //           worldDescription: 1,
// // // //           dateOfPublish: 1,
// // // //           isWorldAllowingAdvisors: 1,
// // // //           "worldThumbnail.data": 1,
// // // //           "worldThumbnail.contentType": 1,
// // // //           publisher: 1,
// // // //           comments: 1,
// // // //           rates: 1
// // // //       });

// // // //       const formattedWorlds = worlds.map((world) => ({
// // // //           _id: world._id,
// // // //           worldName: world.worldName,
// // // //           price: world.price,
// // // //           published: Boolean(world.published),
// // // //           numberOfStudents: world.students?.length || 0,
// // // //           numberOfAdvisors: world.advisors?.length || 0,
// // // //           worldDescription: world.worldDescription,
// // // //           dateOfPublish: world.dateOfPublish,
// // // //           isWorldAllowingAdvisors: world.isWorldAllowingAdvisors,
// // // //           worldThumbnail: world.worldThumbnail?.data && world.worldThumbnail.contentType
// // // //               ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
// // // //               : null,
// // // //           publisher: world.publisher ? {
// // // //               _id: world.publisher._id,
// // // //               name: world.publisher.name,
// // // //               rate: world.publisher.rate,
// // // //               picture: world.publisher.picture?.data && world.publisher.picture.contentType
// // // //                   ? `data:${world.publisher.picture.contentType};base64,${world.publisher.picture.data.toString('base64')}`
// // // //                   : null,
// // // //           } : null,
// // // //           allowedCard: (skWorlds ? !skWorlds.some(w => w._id.toString() === world._id.toString()) : true) &&
// // // //                       (skCart ? !skCart.some(cr => cr._id.toString() === world._id.toString()) : true),
// // // //           rates: world.rates || []
// // // //       }));

// // // //       const filteredFormattedWorlds = formattedWorlds.filter(world => world.published);
// // // //       res.status(200).json(filteredFormattedWorlds);
// // // //   } catch (error) {
// // // //       console.error('Error fetching worlds:', error);
// // // //       res.status(500).json({ error: 'Failed to fetch worlds' });
// // // //   }
// // // // };



// export const getAllWorlds = async (req, res) => {
//   try {
//     // Query the database for the required fields
//     const worlds = await WorldsModel.find();
//     console.log('all worlds ==========>>', worlds);

//     // Safely format the data
//     const formattedWorlds = worlds.map((world) => ({
//       _id: world._id,
//       worldName: world.worldName,
//       worldDescription: world.worldDescription,
//       worldThumbnail: world.worldThumbnail &&
//         world.worldThumbnail.data &&
//         world.worldThumbnail.contentType
//         ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
//         : null,
//     }
    
//   ));


//   worlds.map((world) => 
  
//     console.log('worldName===========>>> ',world.worldName)

  

  
// );

// worlds.map((world) => 
  
//   console.log('worldDescription ===========>>> ',world.worldDescription)




// );

// worlds.map((world) => 
// console.log('world id ==============>>>    ... >>>>>>>>>>>>>>>>>> > > > > > > > ------->   >>>>>>>  ',world._id))
//     console.log('Formatted Worlds:', formattedWorlds);

//     res.status(200).json(formattedWorlds);
//   } catch (error) {
//     console.error("Error fetching worlds:", error);
//     res.status(500).json({ message: "Error fetching worlds" });
//   }
// };



 
 
// export const getWorlds = async (req, res) => {
//   try {
//     const skiller = await SkillerModel.findById(skillerId, 'worlds.worldName worlds.worldThumbnail'); // Get only name and image data

//     // Map the worlds to only send the required data
//     const worlds = skiller.worlds.map(world => ({
//       name: world.worldName,
//       thumbnail: world.worldThumbnail ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}` : null
//     }));

//     res.send(worlds);
//   } catch (error) {
//     console.error("Error fetching worlds:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };


 


export const getLevelsForgetOnlyPublishedLevels = async(req, res) => {
  try{

  // change i have made is to return skLevels rather than mergedLevels
 
    } catch (error) {
      console.error('Error fetching levels:', error);

    }
}
export const getOnlyPublishedLevels = async (req, res) => {
 
  try
{

    if (req.query.worldId && req.query.worldId.trim().length > 3) {
      worldId = req.query.worldId;
      console.log('ifififififiifififififififif=-=-=-=-=-=-=---------------=-=-=-=-=-=-=-=-=-=-=-=-if condition has been iterated =-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-')
  }
  
    console.log('world id coming from the front ========>>>>>  ', req.query.worldId);
    console.log('worldId in the back ========================================================-=-=-==-=-=-=-=-> > > > > > >  ',worldId)
  
      // Retrieve the instructor and ensure they exist

      const world = await WorldsModel.findById(worldId).select({
        publisherId: 1,
        levels: {
          _id: 1,
          published: 1
        }
      })
      const publisherId = world.publisherId
      const instructor = await SkillerModel.findById(publisherId).select('worlds');
 
 
      // Find the personal world and its levels   for the skiller
      const skWorld = instructor?.worlds?.find((w) => w._id === worldId);
  
      const skLevels = skWorld?.levels?.filter(lv => lv.published);
 
      // Retrieve the world details from the Worlds collection
      const skiller = await SkillerModel?.findById(skillerId).select('exams')
       levelsForGetOnlyPublishedLevels = skLevels?.map((level) => ({
        ...level,
        preventExamButton: Boolean(skiller?.exams?.find(ex => ex.levelId === level._id && !ex.examLink)),
      }));
      // Map through the levels in the Worlds collection and merge with personal completion state
 
     res.status(200).json(levelsForGetOnlyPublishedLevels)
console.log('levels for get onlyPublishedLevels =============================-----=========================-----============-=-=-=-=-=-=-----------=-=-=-> >  > >  > > >>  >>  >  ', levelsForGetOnlyPublishedLevels)
} catch(error){
  console.log(error.message)
}

  };

 export const getAdvisorsAndExamersLength = async (req, res) => {
  const worldId = req.query.worldId
  const world = await WorldsModel.findById(worldId).select({
    advisors: {
      _id : 1
    },
    examers: {
      _id : 1
    }
  })
  res.status(200).json({advisorsLength : world.advisors.length, examersLength: world.examers.length})
 }

 
  
export const getLevelTrailer = async(req, res) => {
try{
  if(req.query.worldName){
    worldName = req.query.worldName
  }

  if(req.body.levelId){
    levelId = req.body.levelId
  }
  console.log('worldName from get resources controller ===> ',worldName, 'levelNumber from get resources controller =========> ', levelNumber, 'lessonNumber from get resources controller ==========>>> ', lessonNumber )

    const instructor = await SkillerModel.findById(skillerId, 'worlds');
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Find the specified world using the worldName
    const world = instructor.worlds.find(w => w.worldName === worldName);
    const level = world.levels.find(l => l._id === levelId)
    const levelTrailer = level.levelTrailer
    if (!world) {
      return res.status(404).json({ message: 'World not found' });
    }

    // Find the specified level within the world using the levelNumber


    // Combine resources with their order and type
    const resources = [
      ...levelTrailer.photos.map(photo => ({ type: 'image', url: photo.contentUrl, order: photo.order })),
      ...levelTrailer.videos.map(video => ({ type: 'video', url: video.contentUrl, order: video.order })),
      ...levelTrailer.texts.map(text => ({ type: 'text', content: text.text, order: text.order })),

    ];

    // Sort resources by order
    resources.sort((a, b) => a.order - b.order);
    console.log('resources which will be sen to inside lesson ===============>>>> ===========>>>> ====> ==> ==> ======> =======>>>>>>>=====>>>',resources)
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ message: "Error fetching lessons", error });
  }
}



export const getLessonsForGetOnlyPublishedLessons = async (req, res) => {
  try{

    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Error fetching lessons", error });
    }
  };

// export const getOnlyPublishedLessons = async (req, res) => {
//   try{
  
    
//     const  worldId = req.query.worldId
 
 
//     const  levelId = req.query.levelId

//     const skillerId = req.query.skillerId
   
  
//     console.log('world name coming from the lesson front ========>>>>>  ', worldId);
//     console.log('level number coming from the lesson front ========>>>>>  ', levelId);
  
  
//       const instructor = await SkillerModel.findById(skillerId);
 
  
//       // Find the specified world using the worldName
//       const world = instructor.worlds.find(w => w._id === worldId);
//       if (!world) {
//         return res.status(404).json({ message: 'World not found' });
//       }
//       console.log('world from getLessons ============>> ', world);
  
//       // Find the specified level within the world using the levelNumber
  
//       const level = world.levels.find(l => l._id === levelId);
//       console.log('level ==========>> --------------->> >>>> ',level)
//       if (!level) {
//         return res.status(404).json({ message: 'Level not found' });
//       }
  
//       // Sort lessons by lessonNumber and map to response format
//       const lessons = level.lessons
//         .sort((a, b) => a.lessonNumber - b.lessonNumber) // Sort by lessonNumber
//         .map((lesson) => ({
//           _id: lesson._id,
//           name: lesson.lessonNumber,
//           title: lesson.lessonTitle,
//           description: lesson.lessonDescription,
//           published: lesson.published,
//           draft: lesson.draft
//         }));
//         console.log('lessons from get lessons ==================----------------->> =======>>>>>',lessons)
//          lessonsForGetOnlyPublishedLessons = lessons.filter(ls => ls.published)
 
//         res.status(200).json(lessonsForGetOnlyPublishedLessons)
       
//     } catch (error) {
//       console.error("Error fetching lessons:", error);
//       res.status(500).json({ message: "Error fetching lessons", error });
//     }
//   };





export const getOnlyPublishedLessons = async (req, res) => {
  try{
  
    
    const  worldId = req.query.worldId
 
 
    const  levelId = req.query.levelId

    const skillerId = req.query.skillerId
   
  
    console.log('world name coming from the lesson front ========>>>>>  ', worldId);
    console.log('level number coming from the lesson front ========>>>>>  ', levelId);
  
  
 
  
      // Find the specified world using the worldName
      const world = await WorldsModel.findById(worldId).select({
        _id: 1,
        levels: {
          _id: 1,
          lessons: {
            _id: 1,
            lessonNumber: 1,
            lessonTitle: 1,
            lessonDescription: 1,
            published: 1,
            draft: 1
          }
        }
      })
 
 
      // Find the specified level within the world using the levelNumber
  
      const level = world.levels.find(l => l._id === levelId);
 
  
      // Sort lessons by lessonNumber and map to response format
      const lessons = level.lessons
        .sort((a, b) => a.lessonNumber - b.lessonNumber) // Sort by lessonNumber
        .map((lesson) => ({
          _id: lesson._id,
          name: lesson.lessonNumber,
          title: lesson.lessonTitle,
          description: lesson.lessonDescription,
          published: lesson.published,
          draft: lesson.draft
        }));
        console.log('lessons from get lessons ==================----------------->> =======>>>>>',lessons)
         lessonsForGetOnlyPublishedLessons = lessons.filter(ls => ls.published)
 
        res.status(200).json(lessonsForGetOnlyPublishedLessons)
       
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Error fetching lessons", error });
    }
  };



 
////////public profile

export const getPublicProfile = async(req, res) => {

}
///////get my profile
export const getMyProfile = async(req, res) => {

}


///checkIfPaid
export const isPaid = async(req, res) => {
  try
{  const skiller = await SkillerModel.findById(skillerId);

  if(req.body.worldId){
    worldId = req.body.worldId
  }
  const world = skiller.subscribedIn.map(SN => SN.worldId === worldId)
  if(world){
    res.status(200).json(true)
  }
} catch (error) {
  console.log(error.message);

}
}

export const payWorld = async(req, res) => {
try
{  if( req.body.worldId){
    worldId =  req.body.worldId
  }

  if(req.body.worldName) {
    worldName = req.body.worldName
  }
  await SkillerModel.findOneAndUpdate(
    {_id: skillerId},
    {
      $push: {
        worldId: worldId,
        worldName: worldName,
        atWorldLevel: 0
      }
    },
    {new: true}
  )} catch (error) {
    console.log(error.message);

  }
}

export const getAdvisors = async (req, res) => {
  try {

  
    const  worldId = req.query.worldId
    
    console.log('worldId ===============================-------------------------------> > >  >  ',worldId)
    const world = await WorldsModel.findById(worldId).select({
      publisherId: 1,
      advisors: {
        _id: 1,
        isAvailable: 1,




       
        title: 1,
        description: 1,
        
        price: 1,
   
   
         
        acceptedRequest: 1,
       
        invitedAccept: 1
      }
    });
    
    let advisors = await Promise.all(
      (world?.advisors?.filter(ad => ad.isAvailable === true && (ad.acceptedRequest || ad.invitedAccept)) || []).map(async (advisor) => {
          // Find the corresponding advisor in SkillerModel
          const skiller = await SkillerModel.findById( advisor._id).select('name surname picture rate totalCash'); // Assuming `find` is async
  
          // If skiller is found, map the required fields
          return skiller
              ? {
                    _id: advisor._id, // keep the original advisor id (if necessary)
                    name: skiller.name,
                    surname: skiller.surname,
                    picture: skiller.picture,
                    rate: skiller.rate,
                    totalCash: skiller.totalCash,
                    title: advisor.title,
                    description: advisor.description,
                    price: advisor.price
                }
              : null; // Handle the case where the skiller is not found
      })
  );

  console.log('advisors form getAdvisors check for advisor price ####################################******************************** ================================-=-=-=-=--=-=-=-=-=-> >  > > > > > > > +++++++++++++++--==-=-=-=-=-=-> > > >   ',advisors)
  
  // Remove any null values from the resulting array
  advisors = advisors.filter(advisor => advisor !== null);
    if (advisors.length === 0) {
      // No advisors, fetch the publisher
      const publisher = await SkillerModel.findById(world.publisherId);
 
      if (publisher) {
        advisors.push(
 publisher
        );
      }
    }
         

    const formattedSkillers = advisors?.map((filteredSkiller) => ({
      _id: filteredSkiller._id,
      name: filteredSkiller.name,
      title: filteredSkiller.title,
      description: filteredSkiller.description,

      surname: filteredSkiller.surname,
      price: filteredSkiller.price,
      picture: filteredSkiller.picture,
      rate: filteredSkiller.rate || 0, // Default to 0 if rate is not available
      totalCash: filteredSkiller.totalCash || 0, // Default to 0 if no totalCash
      // // // // sharedWorlds: filteredSkiller?.worlds?.filter((world) => worldIds.includes(world._id))?.map((world) => ({
      // // // //     _id: world._id,
      // // // //     name: world.worldName,
      // // // //     thumbnail: world.worldThumbnail?.data
      // // // //       ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
      // // // //       : null, // Fallback to default thumbnail
      // // // //   })),
    }));
 
    res.status(200).json(formattedSkillers);
  } catch (error) {
    console.error('Error fetching advisors:', error);
    res.status(500).json({ error: 'Failed to fetch advisors' });
  }
};





export const getExamers = async (req, res) => {
  try {

   
    const  worldId = req.query.worldId
    
    console.log('worldId ===============================-------------------------------> > >  >  ',worldId)
    const world = await WorldsModel.findById(worldId).select({
      publisherId: 1,
      examers: {
        _id: 1,
        isAvailable: 1,

      }
    });
    
    let advisors = await Promise.all(
      (world?.examers?.filter(ad => ad.isAvailable === true) || []).map(async (advisor) => {
          // Find the corresponding advisor in SkillerModel
          const skiller = await SkillerModel.findById( advisor._id).select('name surname picture rate totalCash'); // Assuming `find` is async
  
          // If skiller is found, map the required fields
          return skiller
              ? {
                    _id: advisor._id, // keep the original advisor id (if necessary)
                    name: skiller.name,
                    surname: skiller.surname,
                    picture: skiller.picture,
                    rate: skiller.rate,
                    totalCash: skiller.totalCash,
                    price: advisor.price
                }
              : null; // Handle the case where the skiller is not found
      })
  );
  
  // Remove any null values from the resulting array
  advisors = advisors.filter(advisor => advisor !== null);
    if (advisors.length === 0) {
      // No advisors, fetch the publisher
      const publisher = await SkillerModel.findById(world.publisherId).select('name surname picture rate totalCash');
      console.log('publisher =========================---------------------------->>>>>>  ',publisher)
      if (publisher) {
        advisors.push(
 publisher
        );
      }
    }
         

    const formattedSkillers = advisors?.map((filteredSkiller) => ({
      _id: filteredSkiller._id,
      name: filteredSkiller.name,
      surname: filteredSkiller.surname,
      price: filteredSkiller.price,
      picture: filteredSkiller.picture, // Fallback to default profile picture
      rate: filteredSkiller.rate || 0, // Default to 0 if rate is not available
      totalCash: filteredSkiller.totalCash || 0, // Default to 0 if no totalCash
      // // // // sharedWorlds: filteredSkiller?.worlds?.filter((world) => worldIds.includes(world._id))?.map((world) => ({
      // // // //     _id: world._id,
      // // // //     name: world.worldName,
      // // // //     thumbnail: world.worldThumbnail?.data
      // // // //       ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
      // // // //       : null, // Fallback to default thumbnail
      // // // //   })),
    }));
    console.log('Advisors for world===========================--------------------------------------------==================------------------=-=-=-=-=->>>>>>>>> > > >  > > > >  >  ', advisors);
    res.status(200).json(formattedSkillers);
  } catch (error) {
    console.error('Error fetching advisors:', error);
    res.status(500).json({ error: 'Failed to fetch advisors' });
  }
};




// export const getAdvisors = async (req, res) => {
//   try {

//     if(req.query.worldId){
//       worldId = req.query.worldId
//     }
//     console.log('worldId ===============================-------------------------------> > >  >  ',worldId)
//     const world = await WorldsModel.findById(worldId);
    
//     let advisors = world?.advisors || [];

//     if (advisors.length === 0) {
//       // No advisors, fetch the publisher
//       const publisher = await SkillerModel.findById(world.publisherId);
//       console.log('publisher =========================---------------------------->>>>>>  ',publisher)
//       if (publisher) {
//         advisors.push({
//           advisorId: publisher._id,
//           advisorName: `${publisher.name} ${publisher.surname}`,
//           advisorLevel: publisher.instructorLevel,
//           description: publisher.instructorDescription,
//         });
//       }
//     }

//     console.log('Advisors for world:', advisors);
//     res.status(200).json(advisors);
//   } catch (error) {
//     console.error('Error fetching advisors:', error);
//     res.status(500).json({ error: 'Failed to fetch advisors' });
//   }
// };







export const sendExamRequestFromStudent = async(req, res) =>{
  //need advisorId from front
  try
{
  if(req.query.worlrId){
    worldId = req.query.worlrId
  }
  const skiller = await SkillerModel.findById(skillerId)
  const world = skiller.worlds.find(w => w._id === worldId)
  if( world.myAdvisorId){
   advisorId = world.myAdvisorId}
  const time = req.query.time//////////////////////////////////////from front
  if(req.query.examId ){
   examId = req.query.examId}/////////////////////////////////////from front}
await SkillerModel.findByIdAndUpdate(
  {
    advisorId,
    "worlds._id": worldId,
    "worlds.levels._id": levelId,
    "worlds.levels.exams._id": examId
  },
  {
    $push: {
   exams: {
        _id: examId, //coming from the front through uuid
        studentId: skillerId,
        instructorId : advisorId,

      }
    }, 
    
  },
  {
    arrayFilters: [
      {
        "worlds._id": worldId,
        "worlds.levels._id": levelId,
        "worlds.levels.exams._id": examId
      }
    ],
    new: true, // Return the updated document
  }
)  

await SkillerModel.findByIdAndUpdate(
  {
    skillerId,
    "worlds._id": worldId,
    "worlds.levels._id": levelId,
    "worlds.levels.exams._id": examId
  },
  {
    $push: {
   exams: {
        _id: examId, //coming from the front through uuid
        studentId: skillerId,

        instructorId : advisorId,

      }
    }, 
    
  },
  {
    arrayFilters: [
      {
        "worlds._id": worldId,
        "worlds.levels._id": levelId,
        "worlds.levels.exams._id": examId
      }
    ],
    new: true, // Return the updated document
  }
)  } catch (error) {
  console.log(error.message);

}
}

export const getExamForStudent = async(req, res) => {
  //needed worldId, levelId, examId
  //also to show grade
  //also to show exams that the intstuctor has made

}





export const skipStudyAndTakeExamDirectly = async(req, res) =>{
  //need advisorId from front and try number
  try
{  if(req.query.worlrId){
   worldId = req.query.worlrId}
  const skiller = await SkillerModel.findById(skillerId)
  const world = skiller.worlds.find(w => w._id === worldId)
  if(world.myAdvisorId){
   advisorId = world.myAdvisorId}
  const time = req.query.time//////////////////////////////////////from front
  if( req.query.examId){
   examId = req.query.examId}/////////////////////////////////////from front
    

  const skillerWorlds= skiller.worlds
  const level = skillerWorlds.levels.map(L => L._id === levelId)
  const exams = level.exams
  const tryNumber = exams?.tryNumber ? exams.tryNumber + 1 : 1;
await SkillerModel.findByIdAndUpdate(
  {
    advisorId,
  },
  {
    $push: {
   exams: {
        _id: examId, //coming from the front through uuid
        studentId: skillerId,
        instructorId : 'awabId',
        tryNumber: tryNumber

      }
    }, 
    
  },
  {
    arrayFilters: [
      {
        "worlds._id": worldId,
        "worlds.levels._id": levelId,
        "worlds.levels.exams._id": examId
      }
    ],
    new: true, // Return the updated document
  }
)  

await SkillerModel.findByIdAndUpdate(
  {
    skillerId,
    "worlds._id": worldId,
    "worlds.levels._id": levelId,
    "worlds.levels.exams._id": examId
  },
  {
    $push: {
   exams: {
        _id: examId, //coming from the front through uuid
        studentId: skillerId,

        instructorId : 'awabId',
        tryNumber: tryNumber

      }
    }, 
    
  },
  {
    arrayFilters: [
      {
        "worlds._id": worldId,
        "worlds.levels._id": levelId,
        "worlds.levels.exams._id": examId
      }
    ],
    new: true, // Return the updated document
  }
)  } catch (error) {
  console.log(error.message);

}
}




export const getAllTheExamRequests = async(req, res) => {
  //need worldId, levelId, examId
  try
{  const skiller =  await SkillerModel.findById(skillerId);
  const skillerWorlds= skiller.worlds
  const level = skillerWorlds.levels.map(L => L._id === levelId)
  const exams = level.exams
  res.status(200).json(exams)} catch (error) {
    console.log(error.message);

  }
}



export const setExamTimeFromTeacher = async(req, res) => {
  //need worldId, levelId, examId
  try
{  if(req.query.studentId){
   studentId = req.query.studentId}
  const studentName = req.query.studentName
  const worldName= req.query.worldName;
  const levelNumber = req.query.levelNumber
  const skiller = await SkillerModel.findById(skillerId)
  const skillerName = skiller.name
  if(req.body.time){
   time = req.body.time}
  if(req.query.examId){
   examId = req.query.examId} ////////////////////////////////needed from the front
  //find the exam id and set approved to true


  await SkillerModel.findByIdAndUpdate(
    {
      skillerId,
      "worlds._id": worldId,
      "worlds.levels._id": levelId,
      "worlds.levels.exams._id": examId
    },

    {
      $push: {
        exams: {
        
          examTime: time,
          isApproved: true,
        },
      }
    },
    {
      arrayFilters: [
        {
          "worlds._id": worldId,
          "worlds.levels._id": levelId,
          "worlds.levels.exams._id": examId
        }
      ],
      new: true, // Return the updated document
    }
  )} catch (error) {
    console.log(error.message);

  }
}

export const showApprovedExamsForTeacher = async(req, res) => {
  //when click on one of them from the front size then he will generate a link and send it through the below controller
  try
{  const skiller =  await SkillerModel.findById(skillerId);
  const skillerWorlds= skiller.worlds
  const level = skillerWorlds.levels.map(L => L._id === levelId)
  const exams = level.exams
  const approvedExams = exams.map(ex => ex.isApproved === true)
  res.status(200).json(approvedExams)} catch (error) {
    console.log(error.message);

  }

}


export const setExamLinkToBoth = async(req, res) => {
  //need examId
  try
{  if(req.query.studentId){
   studentId = req.query.studentId}
   if(examId){
   examId = req.query.examId}
   if(req.query.examLink){
   examLink = req.query.examLink}
  await SkillerModel.findByIdAndUpdate(
    {
      skillerId,
      "worlds._id": worldId,
      "worlds.levels._id": levelId,
      "worlds.levels.exams._id": examId
    },
    {
      $set: {
     exams: {
          examLink: examLink
  
        }
      }, 
      
    },
    {
      arrayFilters: [
        {
          "worlds._id": worldId,
          "worlds.levels._id": levelId,
          "worlds.levels.exams._id": examId
        }
      ],
      new: true, // Return the updated document
    }
  )
  await SkillerModel.findByIdAndUpdate(
    {
      studentId,
      "worlds._id": worldId,
      "worlds.levels._id": levelId,
      "worlds.levels.exams._id": examId
    },
    {
      $set: {
     exams: {
          examLink: examLink
  
        }
      }, 
      
    },
    {
      arrayFilters: [
        {
          "worlds._id": worldId,
          "worlds.levels._id": levelId,
          "worlds.levels.exams._id": examId
        }
      ],
      new: true, // Return the updated document
    }
  )} catch (error) {
    console.log(error.message);

  }
}

getClientProfilePicture
export const getExamLink = async(req, res) => {
  //need examId, worldId, levelId
try{  if( req.query.examId){
   examId = req.query.examId}
  const skiller = await SkillerModel.findById(skillerId)
  const world = skiller.worlds.map(w => w._id === worldId)
  const level = world.levels.map(l => l._id === levelId)
  const exam = level.exams.map(ex => ex._id === examId)
  if(exam.examLink){
   examLink = exam.examLink}
  res.status(200).json(examLink)} catch (error) {
    console.log(error.message);

  }
}

// export const myavailableTimeForExam = async (req, res) => {
//   const { availableTimesForExam } = req.body;

//   try {
//     const updatedSkiller = await SkillerModel.findByIdAndUpdate(
//       skillerId,
//       { $set: { availableTimesForExam } },
//       { new: true }
//     );
//     res.status(200).json({ success: true, data: updatedSkiller });
//   } catch (error) {
//     console.error("Error updating available times for exam:", error);
//     res.status(500).json({ success: false, message: "Failed to update available times" });
//   }
// };

// export const getAdvisorAvailableTimes = async(req, res) => {
//   const worldId = req.query.worlrId
//   const skiller = await SkillerModel.findById(skillerId)
//   const world = skiller.worlds.find(w => w._id === worldId)
//   const advisorId = world.myAdvisorId

//   const advisor = await SkillerModel.findByIdAndUpdate(advisorId)
//   const advisorAvailableTimes = advisor.availableTimesForExam
//   res.status(200).json(advisorAvailableTimes)
// }




// export const sendNotification = async (req, res) => {
//   const { token, title, body } = req.body;

//   const message = {
//     notification: {
//       title,
//       body,
//     },
//     token,
//   };

//   try {
//     await admin.messaging().send(message);
//     res.status(200).send("Notification sent successfully!");
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     res.status(500).send("Failed to send notification.");
//   }
// };


uploadCertificateWithName
uploadCertificateWithName


export const uploadSkillerCertificate = async (req, res) => {
  const client = await SkillerModel.findById(skillerId);

  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  const userName = client.name;

  try {
    const templatePath = path.join(__dirname, '../certificates/certificate-template.png');
    
    // Load the certificate template
    const img = await loadImage(templatePath);
    
    // Create a canvas with the same size as the image
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    // Draw the template image on the canvas
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Set font and color for text
    ctx.fillStyle = 'black';
    ctx.font = '60px sans-serif'; // You can adjust the font size and style

    // Measure the text width to center it horizontally
    const textWidth = ctx.measureText(userName).width;
    const xPos = (canvas.width - textWidth) / 2; // Center horizontally
    const yPos = canvas.height / 2; // Adjust this based on where you want the text

    // Draw the text (the user's name)
    ctx.fillText(userName, xPos, yPos);

    // Save the image to a buffer
    const buffer = canvas.toBuffer('image/png');
    
    // Update the client's certificate with the generated image
    client.certificate = {
      name: `certificate-${skillerId}.png`,
      data: buffer,
      contentType: 'image/png',
    };

    // Save the updated client document
    await client.save();

    res.status(200).json({ message: 'Certificate generated and uploaded successfully!' });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'An error occurred while generating the certificate.' });
  }
};




export const getSkillerCertificate = async (req, res) => {
  try {

    if (!skillerId) {
      return res.status(400).send('Client ID is required');
    }


      const client = await SkillerModel.findById(skillerId);
    
    if (!client || !client.certificate) {
      return res.status(404).send('Profile picture not found');
    }

    res.set('Content-Type', skiller.level.certificate.contentType);
    res.send(client.certificate.data);
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

export const setStudentPassedLevel= async(req, res) => {
try{  ////check if it is graduation level, if yes then set graduated to true
    ////check if it is graduation level, if yes then set graduated to true
      ////check if it is graduation level, if yes then set graduated to true
        ////check if it is graduation level, if yes then set graduated to true
          ////check if it is graduation level, if yes then set graduated to true
            ////check if it is graduation level, if yes then set graduated to true
              ////check if it is graduation level, if yes then set graduated to true
                ////check if it is graduation level, if yes then set graduated to true
                  ////check if it is graduation level, if yes then set graduated to true
  //if he wants to teach && he is graduated, then add him to world advisors
    //if he wants to teach && he is graduated, then add him to world advisors
      //if he wants to teach && he is graduated, then add him to world advisors
        //if he wants to teach && he is graduated, then add him to world advisors
          //if he wants to teach && he is graduated, then add him to world advisors
            //if he wants to teach && he is graduated, then add him to world advisors
              //if he wants to teach && he is graduated, then add him to world advisors
                //if he wants to teach && he is graduated, then add him to world advisors
                  //if he wants to teach && he is graduated, then add him to world advisors
                    //if he wants to teach && he is graduated, then add him to world advisors

  //call upload certification
    //call upload certification
      //call upload certification
        //call upload certification
          //call upload certification
            //call upload certification
              //call upload certification
                //call upload certification
                  //call upload certification
    //add money to the advisor cash
        //add money to the advisor cash
            //add money to the advisor cash
                //add money to the advisor cash
                    //add money to the advisor cash
                        //add money to the advisor cash
                            //add money to the advisor cash
                                //add money to the advisor cash
                                    //add money to the advisor cash
    //acording to the rate level up the advisor
        //acording to the rate level up the advisor
            //acording to the rate level up the advisor
                //acording to the rate level up the advisor
                    //acording to the rate level up the advisor
                        //acording to the rate level up the advisor
                            //acording to the rate level up the advisor
                                //acording to the rate level up the advisor
                                    //acording to the rate level up the advisor
  
  await SkillerModel.findOneAndUpdate(
    {
      skillerId,
      "worlds.worldId": worldId,
      "worlds.levels.levelNumber" : levelNumber
    },
    {
      $set: {
        "worlds.$[world].levels.$[level]": { // Use array filters to target the correct world and level
 // Array of quizzes
            isPassedExam: true,
        },
      },
    },
    {
      arrayFilters: [
        { "world.worldName": worldName }, // Filter to match the world
        { "level.levelNumber": levelNumber } // Filter to match the level
      ],
      new: true
    }
  )} catch (error) {
    console.log(error.message);

  }
}


export const showAvailableAdvisors = async(req, res) => {
  //need worldId, adivosrId
try{  if(req.query.instructorId){
   advisorId  = req.query.instructorId}
   if(req.query.worldId){
   worldId = req.query.worldId}
  const instructor = await SkillerModel.findById(advisorId)
  const instructorWorlds = instructor.worlds
  const thisWorld = instructorWorlds.map(iw => iw._id === worldId)
  const worldAdvisors = thisWorld.advisors
  res.status(200).json(worldAdvisors)} catch (error) {
    console.log(error.message);

  }
}

export const mySubscriptions = async (req, res) => {
  try {
    const skillerId = req.query.skillerId;
    // Find worlds where the current skillerId exists in the students array

    const skiller = await SkillerModel.findById(skillerId).select({
      worlds: {
        _id:1,
        worldName: 1,
        price: 1,
        published: 1,
        student: 1,
        draft:1,
        numberOfStudents: 1,
        numberOfAdvisors: 1,
        worldDescription: 1,
        dateOfPublish: 1,
        isWorldAllowingAdvisors: 1,
        worldThumbnail:1,
        publisher: 1,
        publisherr:1,
        comments: 1,
        rates: 1
    }});
    const worlds = skiller.worlds
    const subscribedInWorlds = worlds.filter (w => w.student === true && w.publisher === false)


    console.log('subscribedInWorlds from mySubscribtions ============================-=-=-=-=-=-=-=--------------=-=--=-=-=-> > > > > > > > > > > > > > > >> > > > > > > >   ',subscribedInWorlds)
    const formattedWorlds = subscribedInWorlds.map((world) => (    { 
      _id: world._id,
      worldName: world?.worldName,
      price: world?.price,
      published: Boolean(world.published),
      draft: Boolean(world.draft),
      numberOfStudents: world?.students?.length,
      numberOfAdvisors: world?.advisors?.length,
      worldDescription: world.worldDescription,
      dateOfPublish: world.dateOfPublish,
      isWorldAllowingAdvisors: world.isWorldAllowingAdvisors,
      worldThumbnail: world.worldThumbnail,
      publisher: world.publisher,
      publisherr: world.publisherr,
      comments: world?.comments?.map((comment) => ({
        _id: comment._id,
        comment: comment.comment,
        commenters: comment.commenter.map((commenter) => ({
          _id: commenter._id,
          name: commenter.name,
          picture: commenter.picture.picture?.data && commenter.picture.picture.contentType
            ? `data:${commenter.picture.picture.contentType};base64,${commenter.picture.picture.data.toString('base64')}`
            : null,
        })),
      })),
      rates: world?.rates?.map((rate) => ({
        _id: rate._id,
        rate: rate.rate,
        rater: rate.rater
          ? {
              _id: rate.rater._id,
              name: rate.rater.name,
              picture: rate.rater.picture.picture?.data && rate.rater.picture.picture.contentType
                ? `data:${rate.rater.picture.picture.contentType};base64,${rate.rater.picture.picture.data.toString('base64')}`
                : null,
            }
          : null,
      })),
    }
    
  ));
    // Send the subscribed worlds as the response
    res.status(200).json(formattedWorlds);
  } catch (error) {
 
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
};



export const getWorldPrice = async(req, res) => {
try{  if( req.query.worldId){
   worldId  = req.query.worldId}
  const world = await WorldsModel.findById(worldId).select('price')
  const price = parseInt(world.price, 10);
  console.log ('world for price ======================================-=-=-=-> > >  ', world)
  console.log('price =================-=-=-=-=-=-=-> > >  > >>  ', price)
  res.status(200).json(price)} catch (error) {
    console.log(error.message);

  }
}

export const paidWorld = async (req, res) => {
try
{    // Check if the request body exists and contains a `worldId`
    const {  purchaseId, skillerId, worldId } = req.body 
 
 
    // Find the skiller
    const skiller = await SkillerModel.findById(skillerId).select('name picture rate');


    const studentName = skiller.name;
 
    if (worldId) {
      // Find the world
      const world = await WorldsModel.findById(worldId).select({
        levels: {
          levelNumber: 1,
    

        },
        price: 1,
        publisherId:1,
         worldName:1,
         advisorAmount:1,
         isWorldAllowingAdvisors:1,
         worldThumbnail:1,
         publisher:1,



      });
      const publisher = await SkillerModel.findById(world.publisherId).select('name totalCash')
 
      const level = world?.levels?.find(l => l.levelNumber === 1);

      const levelId = level?._id || ''
      console.log('levelId =======================================---------------------::::::::>>>> > >  > > >>  ',levelId)
      // Update the WorldsModel

      await SkillerModel.findByIdAndUpdate(
        skillerId,
        {
          $push: {
            worlds: {
              _id: worldId, // Auto-generated unique identifier for each world
              skillerId: skillerId,
              worldName: world.worldName,
              price: world.price,
              advisorAmount: world.advisorAmount,
              isWorldAllowingAdvisors: world.isWorldAllowingAdvisors,
              student: true,
              publisher: false,
              worldThumbnail: world.worldThumbnail,
              publisherr: world.publisher,
              iAmA: "student", // publisher, student, or advisor
              levels: world.levels,
              publisherId: world.publisherId
            },
          },
        },
        { new: true }
      );
      await WorldsModel.findByIdAndUpdate(
        worldId,
        {
          $push: {
            students: {
              _id: skillerId,
              studentName: studentName,
              picture: skiller.picture,
              rate: skiller.rate,
              levelId: levelId

            },
          },
        },
        { new: true }
      );

      // Update the SkillerModel


      await SkillerModel.findByIdAndUpdate(
        skillerId,
        {
          $push:{ cash: {
            _id: purchaseId,
            date:  new Date().toISOString().split('T')[0],
            amount: world.price ,
            buyer: true,
            seller: false,
            advisor: false,
            sender: {
              _id: skillerId,
              name: skiller.name
            },
            receiver: {
              _id: world.publisherId,
              name: publisher.name
            },
            world: {
              _id: worldId,
              name: world.name
            }
          }}
        },
        {
          new: true
        }
      )


      
      await SkillerModel.findByIdAndUpdate(
        world.publisherId,
        {
          $push:{ cash: {
            _id: purchaseId,
            totalCash: publisher.totalCash + (world.price * 0.8),
            date:  new Date().toISOString().split('T')[0],
            amount: world.price * 0.8,

            buyer: false,
            seller: true,
            advisor: false,
            sender: {
              _id: world.publisherId,
              name: publisher.name
            },
            receiver: {
              _id: skillerId,
              name: skiller.name
            },
            world: {
              _id: worldId,
              name: world.worldName
            }
          }}
        },
        {
          new: true
        }
      )
 

        res.status(200).json({ message: "World updated successfully." });
    } 
}catch(error) {
  console.log(error.message)
}
};


export const isPaidWorld = async (req, res) => {
try{  if( req.query.worldId){
  const worldId = req.query.worldId}
  const world = WorldsModel.findById(worldId);
  if(skillerId){
   studentId = skillerId;}
  const isHeThere = world.students.map(st => st.studentId === studentId)
  if (isHeThere){
    res.json('true')
  }
  else{
    res.json('false')
  }} catch (error) {
    console.log(error.message);

  }
}

export const sendWorldMessage = async(req, res)=> {
  //need worldId, advisorId, message content
  try
{  await SkillerModel.findOneAndUpdate(
    {
      skillerId, 
      "worlds._id": worldId
    },
    {
      $push:    { messages: {
        senderId: skillerId,
        receiverId: advisorId,
        messageContent: messageContent
      }}
    },
    {
      arrayFilters: [
        { "world.worldId": worldId }, // Filter to match the world
   
      ],
      new: true
    }
  )

  await SkillerModel.findOneAndUpdate(
    {
      advisorId, 
      "worlds._id": worldId
    },
    {
      $push:    { messages: {
        senderId: skillerId,
        receiverId: advisorId,
        messageContent: messageContent
      }}
    },
    {
      arrayFilters: [
        { "world.worldId": worldId }, // Filter to match the world
   
      ],
      new: true
    }
  )} catch (error) {
    console.log(error.message);

  }
}
export const getWorldMessage = async(req, res) => {
  //needed worldId
try{  const skiller = await SkillerModel.findById(skillerId);
  const world = skiller.worlds.map(w => w._id === worldId);
  const worldMessages = world.messages
  res.josn(worldMessages)} catch (error) {
    console.log(error.message);

  }
}

getExamLink
sendExamRequestFromStudent
uploadCertificateWithName

export const insertLevelCertificate = async(req, res) => {
  //call uploadCertificateWithName and insert the certificate in the exam db if and only if he passed
}

export const isGraduated = async(req, res) => {
  //set him graduated if he passed that certain level
}

export const addAdvisor = async(req, res) => {
  //add the user to the world advisors
}

export const calcualteAdnAddCash = async(req, res) => {
  //caculate and add cash
}

export const addCash = async(req, res) => {
  //calculate the cash and add it to his cash
}
export const substractCash = async(req, res) => {
  //take the requested cash from the front, substracted it from the total, and hasbo in the front
}

export const calculateRateAndLevelUp = async(req, res) => {
  //calculate the rate and patch the user level
}


dotenv.config();

const PAYPAL_API =
  process.env.REACT_APP_PAYPAL_MODE === 'live'
    ? 'https://api.paypal.com'
    : 'https://api.sandbox.paypal.com';
const CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_PAYPAL_SECRET;

export const sendPayment = async (req, res) => {
  const { recipientEmail, amount , withdrawId} = req.body;
  const skiller = await SkillerModel.findById(skillerId)

  if(amount <= skiller.totalCash){
  try {    
    // Step 1: Get Access Token
    const tokenResponse = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;

    // Step 2: Create Payout
    const payoutResponse = await axios.post(
      `${PAYPAL_API}/v1/payments/payouts`,
      {
        sender_batch_header: {
          email_subject: 'You have received a payment!',
          email_message: 'You have received $10 from our system!',
        },
        items: [
          {
            recipient_type: 'EMAIL',
            receiver: recipientEmail,
            amount: {
              value: amount,
              currency: 'USD',
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    await SkillerModel.findByIdAndUpdate(
      skillerId,
      {
        $push: { withdrawHistory: 
         { _id: withdrawId,
          amount: amount,
          date: new Date().toISOString().split('T')[0],}
        }
      },
      {
        new: true
      }
    )

    res.status(200).json({
      success: true,
      data: payoutResponse.data,
    });
  } catch (error) {
    console.error('Error sending payment:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Payment failed. Please try again later.',
    });
  }}
};


skipStudyAndTakeExamDirectly
getAllWorlds
insertCategory
insertClientPicture
paidWorld
addWorld
mySubscriptions
getAllWorlds
getProviderToClientMessagesInClient
sendMessageFromClientToProvider





export const sendMessages = async (req, res) => {
  try{
  const { _id, withId, content, document, skillerId } = req.body;

  console.log('req.body from send messages ==============================-=-=-=-=-=-=-=-=--> > > > > > >  > ',req.body)
  const skiller = await SkillerModel.findById(skillerId).select('name');
  const senderName = skiller.name;
  const withSkiller = await SkillerModel.findById(withId).select('FcmToken')
  console.log('**************************************withSkiller****************** =========================================================-=-=-=-=-=-=-=-> > > > > >> >  >  ',withSkiller)

  const FcmToken = withSkiller?.FcmToken
  console.log('*********************************************************FcmToken from controller**********************************************************************************************************************FcmToken from controller**********************************************************************************************************************FcmToken from controller**********************************************************************************************************************FcmToken from controller**********************************************************************************************************************FcmToken from controller************************************************************* =================================================================-=-=-=-=-=-=-=-=-=-=-=-=->> > >  > > > > > > >   ',FcmToken)
       await sendNotification(FcmToken, senderName, content);
    // Insert the message into the receiver's schema
    await SkillerModel.findByIdAndUpdate(
      withId,
      {
        $push: {
          messages: {
            _id,
            withId: skillerId,
            senderId: skillerId,
            senderName,
            readed: false,
            response: false,
            content,
            document, // Store file/document URL
          },
        },

        
      },
      { new: true }
    );

    // Insert the message into the sender's schema
    await SkillerModel.findByIdAndUpdate(
      skillerId,
      {
        $push: {
          messages: {
            _id,
            withId,
            senderId: skillerId,
            response: true,
            content,
            document, // Store file/document URL
          },
        },
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
};


// export const sendMessages   = async (req, res) => {
//   const{
//     _id,
//     withId,
//     content,
//   } = req.body;
//   console.log('req.body from sendMessages ====================================-------------------------------->>> ',req.body)
//   const skiller = await SkillerModel.findById(skillerId);
//   const senderName = skiller.name



//   try {
//     // Insert the message in the receiver's schema
//     await SkillerModel.findByIdAndUpdate(
//       withId,
//       { $push: { messages: {
//         _id: _id,
//         withId: skillerId,
//         senderName:senderName,
//         response: false,
//         content:content,
//         documnet
//       }  } },
//       { new: true }
//     );



//     // Insert the message in the sender's schema
//     await SkillerModel.findByIdAndUpdate(
//       skillerId,
//       { $push: { messages: {
//         _id: _id,
//         withId: withId,

//         response: true,
//         content: content,
//         document
//       }  } },
//       { new: true }
//     );

//     return res.status(200).json({ success: true, message: 'Message sent successfully!' });
//   } catch (error) {
//     console.error('Error sending message:', error);
//     return res.status(500).json({ success: false, message: 'An error occurred.' });
//   }
// };




export const getStudentsChats1 = async (req, res) => {

  const skillerId = req.query.skillerId;

  try {
    if (skillerId) {
      const skiller = await SkillerModel.findById(skillerId).select('messages');
      //get all students ids 
      //fiter only messages includes senderid as one from students ids
      const filteredMessages = skiller?.messages || [];

      const uniqueSenderIds = new Set();
      const uniqueMessages = [];

      for (const message of filteredMessages) {
        if (!uniqueSenderIds.has(message.senderId  )&& message.senderId !== skillerId) {
          uniqueSenderIds.add(message.senderId);

          // Fetch the skiller's details using senderId
          const senderSkiller = await SkillerModel.findById(message.senderId).select('picture');
          const lengthOfUnreadedMessages = skiller?.messages?.filter(ms => ms.senderId === message.senderId  && !ms.readed)?.length || 0;
          // Attach the picture to the message
          uniqueMessages.push({
            ...message.toObject(), // Convert Mongoose document to plain object
            senderPicture: senderSkiller?.picture || null,
            lengthOfUnreadedMessages: lengthOfUnreadedMessages
          });
        }
      }

      res.status(200).json(uniqueMessages);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const getMessages1 = async (req, res) => {



  try {
    const skillerId = req.query.skillerId;
    if (skillerId) {
      const skiller = await SkillerModel.findById(skillerId).select('messages');
      //get all students ids 
      //fiter only messages includes senderid as one from students ids
      const filteredMessages = skiller?.messages || [];

      const uniqueSenderIds = new Set();
      const uniqueMessages = [];

      for (const message of filteredMessages) {
        if (!uniqueSenderIds.has(message.senderId  )&& message.senderId !== skillerId) {
          uniqueSenderIds.add(message.senderId);

          // Fetch the skiller's details using senderId
          const senderSkiller = await SkillerModel.findById(message.senderId).select('picture');
          const lengthOfUnreadedMessages = skiller?.messages?.filter(ms => ms.senderId === message.senderId  && !ms.readed)?.length || 0;
          // Attach the picture to the message
          uniqueMessages.push({
            ...message.toObject(), // Convert Mongoose document to plain object
            senderPicture: senderSkiller?.picture || null,
            lengthOfUnreadedMessages: lengthOfUnreadedMessages
          });
        }
      }

      res.status(200).json(uniqueMessages);
    }
  } catch (error) {
     
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// export const getMessages1 = async(req, res) => {
//   const skillerId = req.query.skillerId
// try{  
//   if(skillerId)
// {
//     const skiller = await SkillerModel.findById(skillerId).select('messages');
//     const filteredMessages = skiller?.messages

//       // Use a Set to track unique senderId values
//       const uniqueSenderIds = new Set();
//       const uniqueMessages = [];
  
//       // Loop through all messages and add to uniqueMessages if senderId is not in the Set
//       for (const message of filteredMessages) {
//         if (!uniqueSenderIds.has(message.senderId)) {
//           uniqueSenderIds.add(message.senderId);
//           uniqueMessages.push(message);
//         }
//       }
  
//       res.status(200).json(uniqueMessages);}}
//       catch (error) {
//         console.log(error.message);
    
//       }


// }



export const getMessages2 = async(req, res) => {

  //get senderId from the front
try{   
  const skillerId = req.query.skillerId;
  const withId = req.query.withId;
  
  const skiller = await SkillerModel.findById(skillerId).select('messages');
  const messages = skiller?.messages
  const withIdMessages = messages?.filter(ms => ms.withId === withId);
 
  res.status(200).json(withIdMessages)
  } catch (error) {
    console.log(error.message);

  }
}


export const getWithNameAndPicture = async (req, res) => {
  const skillerWith = await SkillerModel.findById(req.query.withId).select('name picture');
  res.status(200).json(skillerWith)
}
 
 

export const sendNotification1 = async (req, res) => {
  try {
    const { _id, title, content } = req.body; // Extract data from the request body
    console.log('req.body for notifications =================>> > > > > > > --------> > > > > ------->>>> >> ',req.body)
    if (!skillerId || !title || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedSkiller = await SkillerModel.findByIdAndUpdate(
      skillerId, // Use skillerId to find the document
      {
        $push: {
          notifications: { _id, title, content }, // Push the notification to the notifications array
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedSkiller) {
      return res.status(404).json({ error: "Skiller not found" });
    }

    res.status(200).json(updatedSkiller); // Send the updated Skiller document
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};


export const getNotification1 = async (req, res) => {
  const skillerId = req.query.skillerId
  try {
    
    const skiller = await SkillerModel.findById(skillerId).select('notificationsss');
    if (!skiller) {
      return res.status(404).json({ message: 'Skiller not found' });
    }
    const notifications = skiller.notificationsss
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const getNotification2 = async (req, res) => {
  const skillerId =req.query.skillerId;
  const notificationId = req.query.notificationId;
  try {
 // Receive skillerId and notificationId from frontend
  
  
    const skiller = await SkillerModel.findById(skillerId).select('notificationsss');
 
    const notification = skiller.notificationsss.find(
      (n) => n._id === notificationId
    );
    console.log('notification ===========>> > >> > > > > > > >> > > >> ',notification)
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({
      _id: notification._id,
      title: notification.title,
      content: notification.content,
      typeee: notification.typeee,
      requestId: notification?.requestId,
      worldId: notification?.worldId
    });
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const setNotificationReaded = async (req,res) => {
  const skillerId =  req.body.skillerId;
  const notificationId = req.body.notificationId;


  await SkillerModel.findOneAndUpdate(
    {
      _id : skillerId,
      'notificationsss._id' : notificationId
    },
    {
      $set : {
        'notificationsss.$.readed' : true
      }
    },
    {
   
      new : true
    }
  )
}


export const getNumberOfUnreadedNotifications = async (req, res) => {

 
  try
{ 
  const skillerId = req.query.skillerId;
  const skiller = await SkillerModel.findById(skillerId).select('notificationsss')
  const lengthOfUnreadedNotifications = skiller.notificationsss.filter(nf => nf.readed === false).length
  res.status(200).json(lengthOfUnreadedNotifications)}
  catch(error) {
 
  }
}

export const startExam = async(req, res) => {
 try{ //req => advisor id, level id, world id, examId as uuid
  // const {advisorId, levelId, worldId, examId} = req.body
 
  const {  skillerId, worldId, levelId, examId } = req.body;
  console.log('req.body from start exam =============---------------------->>>>  ',req.body)
  console.log('levelId from start exam =============---------------------->>>>  ',levelId)
  console.log('worldId from start exam =============---------------------->>>>  ',worldId)
  console.log('examId from start exam =============---------------------->>>>  ',examId)
  const skiller = await  SkillerModel.findById(skillerId).select({
    _id: 1,
    name: 1,
    worlds: {
      _id: 1,
      worldName: 1
      
    },
    exams: {
      _id: 1,

    }
  });
  const worldd = await WorldsModel.findById(worldId).select({
    _id: 1,
    examers: {
      _id: 1,
      price: 1
    }
  })
  const advisorW = worldd.examers.find(exr => exr._id === advisorId)
  console.log('skillerId ==============================-----------------------------------==>> > > >  > > >  > >  ',skillerId)
  console.log('skiller ==========================-----------------------=====---------==>>>>>>>>> > > >  ',skiller)
  const worlds = skiller.worlds
  console.log('worlds from start exam ===========-----------------=>>>>>>> ',worlds)
  const world = worlds?.find(w => w._id === worldId)
  console.log('world from start exam ===========-----------------=>>>>>>> ',world)
  const advisorId = world?.myCurrentAdvisorId
  const advisor = await SkillerModel.findById(advisorId).select('name')

  const advisorName = advisor?.name
  console.log('advisorId start exam ===========-----------------=>>>>>>> ',advisorId)


  // console.logs('req.body from exams ===============> > > > > >> -----------> > > > > > >> ---->>>  ',req.body)
  // const skiller = await SkillerModel.findById(skillerId);


  
   const worldName = world?.worldName;
   const isWorldAllowingAdvisors = world.isWorldAllowingAdvisors;
   const level = world?.levels?.find((level) => level._id === levelId);
   const levelNumber = level?.levelNumber;
   const exam = skiller?.exams?.find(ex => ex._id === examId) 
   const tryNumber = exam?.tryNumber + 1 || 1;
//   if ( || !worldId || !levelId || !examId) {
//     return res.status(400).json({ error: 'Missing required fields' });
// }
const studentUpdate = await SkillerModel.findByIdAndUpdate(
  skillerId,
  {
      $push: {
          exams: {  
              _id: examId,
              instructorName: advisorName,
              title: worldName + ' level : '+ levelNumber+ ' exam',
              worldName: worldName,
              levelNumber: levelNumber, // Example level number
              worldId,
              levelId: levelId,
              isWorldAllowingAdvisors: isWorldAllowingAdvisors,
              isEnded: false,
              isGraded: false,
              isPassed: false,
              iamInstructor: false,
              studentId: skillerId,
              instructorId: advisorId,
              studentName: skiller.name,
              examTitle: 'worldName + levelName',
              isApproved: false,
              tryNumber: tryNumber, // Example try number
          },
      },
  },
  { new: true }
);

// Update advisor
const advisorUpdate = await SkillerModel.findByIdAndUpdate(
  advisorId,
  {
      $push: {
          exams: {
              _id: examId,
              worldId,
              levelId: levelId, 
              instructorName: advisorName,
              isWorldAllowingAdvisors: isWorldAllowingAdvisors,
              title: worldName + ' level : '+levelNumber+ ' exam',
              worldName: worldName,
              levelNumber: levelNumber, // Example level number
              iamInstructor: true,
              studentId: skillerId,
              instructorId: advisorId,
              studentName: skiller.name,
              isApproved: false,
              tryNumber: tryNumber, // Example try number
          },
      },
  },
  { new: true }

);


await SkillerModel.findByIdAndUpdate(
  advisorId,
  {
    $push:{ cash: {
      _id: purchaseId,
      totalCash: advisor.totalCash + (advisorW.price * 0.8),
      date:  new Date().toISOString().split('T')[0],
      amount: advisorW.price * 0.8,

      buyer: false,
      seller: true,
      advisor: true,
      sender: {
        _id: advisor._id,
        name: advisor.name
      },
      receiver: {
        _id: skillerId,
        name: skiller.name
      },
      world: {
        _id: worldId,
        name: world.worldName
      }
    }}
  },
  {
    new: true
  }
)




const title = `Congratulations been choosen as a examer`
const content = `${skiller.name} have choose you as his examer on ${world.worldName}, you can find him on my exams management, please contact with him to discuss the upcoming skills he want to exam , you can collect your payment whenever you want from your payments management`
const FcmToken = studentToBeAdvisor.FcmToken
await sendNotification(FcmToken, title, content);

} catch (error) {
  console.log(error.message);

}
}

//set exam time

export const setExamTime = async(req, res) => {
  //req =>  exam id, student id, examTime
try{  if(req.body.examId){
   examId = req.body.examId;}
   if(req.body.studentId){
   studentId = req.body.studentId;}
  if( req.body.examTime){
   time = req.body.examTime}
  await SkillerModel.findOneAndUpdate({
    _id: skillerId,
    'exams._id': examId
  },
{
  $set: {
    "exams.$.examTime"
      : req.body.examTime
    
  }
},
{
  new:true
}
)

await SkillerModel.findOneAndUpdate({
  _id: studentId,
  'exams._id': examId
},
{
$set: {
  "exams.$.examTime"
    : req.body.examTime
  
}
},
{
new:true
}
)} catch (error) {
  console.log(error.message);

}
}


//send link and set to approved
export const setExamLink = async(req, res)=>{
  //req => exam id, student id, examLink
try{  if(req.body.examId){
   examId = req.body.examId;}
   if(req.body.studentId){
   studentId = req.body.studentId;}
   if(req.body.examLink){
   examLink = req.body.examLink}
  await SkillerModel.findOneAndUpdate({
    _id: skillerId,
    'exams._id': examId
  },
{
  $set: {
    "exams.$.examLink" : req.body.examLink,
    "exams.$.isStarted": true
    
  }
},
{
  new:true
}
)

await SkillerModel.findOneAndUpdate({
  _id: studentId,
  'exams._id': examId
},
{
$set:  {
  "exams.$.examLink" : req.body.examLink,
  "exams.$.isStarted": true
  
}
},
{
new:true
}
)} catch (error) {
  console.log(error.message);

}
}
//put grade and set passed
export const gradeAndDetermine = async (req, res) => {
  //req => exam id, student id, grade, isPassed
  //call certification process
try{  const examId = req.body.examId;
  const studentId = req.body.studentId;
  const grade = req.body.grade;
  const isPassed = req.body.isPassed

  await SkillerModel.findOneAndUpdate(
    {
      _id: studentId,
      'exams._id' : examId
  },
{
  grade: grade,
  isPassed: isPassed,
  "exams.$.isEnded": true
},
{
  new:true
}
)

await SkillerModel.findOneAndUpdate(
  {
   _id: skillerId,
    'exams._id' : examId
},
{
grade: grade,
isPassed: isPassed
},
{
new:true
}
)

if (isPassed){
  uploadCertificateWithName();
}} catch (error) {
  console.log(error.message);

}
}
export const getAllExam1 = async(req, res) => {
try{  const skiller  = await SkillerModel.findById(skillerId);
  res.json(skiller.exams)} catch (error) {
    console.log(error.message);

  }
}

export const getWorldExam1 = async(req, res) => {
  //get world id from front
try{  const worldId = req.body
  const skiller = await SkillerModel.findById(skillerId);
  const exams = skiller.exams
  const worldExams = exams.map((exam) => exam.worldId === worldId)}
  catch (error) {
    console.log(error.message);

  }
}



export const getExams = async(req, res) => {

try{
const skiller = await SkillerModel.findById(skillerId)
const exams = skiller.exams;
const exam = exams.map((exam) => exam._id === examId )
res.json(exam)} catch (error) {
  console.log(error.message);

}
}


export const getAllCertifications1 = async(req, res) => {
try{  const skiller = await SkillerModel.findById(skillerId);
  res.json(skiller.certifications)} catch (error) {
    console.log(error.message);

  }
}

export const getWorldCertifications1 = async(req, res) => {
try{  const worldId = req.body;
  const skiller = await SkillerModel.findById(skillerId);
  const certifications = skiller.certifications
  const worldCertification = certifications.map((certification) => certification.worldId === worldId)
  res.json(worldCertification)} catch (error) {
    console.log(error.message);

  }
}

export const getCertification2 = async(req, res) => {
try{  const certificationId = req.body
  const skiller = await SkillerModel.findById(skillerId);
  const certifications = skiller.certifications
  const certification = certifications.map((certification) => certification._id === certificationId)
  res.json(certification)} catch (error) {
    console.log(error.message);

  }
}


export const getAdvisorId = async(req, res) => {
try{  if(req.query){
   worldId = req.query;}
  const skiller = await SkillerModel.findById(skillerId);
  const worlds = skiller.worlds;
  const world = worlds.map((world) => world._id === worldId);
  const advisorId = world.instructorId;
  res.json(advisorId)
} catch (error) {
  console.log(error.message);

}
}

export const insertAdvisor = async (req, res) => {

try{  if(req.body.worldId){
    worldId = req.body.worldId
  }
  if(req.body.advisorId){
    advisorId = req.body.advisorId
  }
  await SkillerModel.findByIdAndUpdate(
    {
      skillerId,
      'worlds._id': worldId
    },
    {
      $set: {
        world: {
          instructorId: advisorId
        }
      }
    },
    {
      new: true
    }
  )} catch (error) {
    console.log(error.message);

  }
}


export const skWInsertAdvisorToStudentAndStudentToAdvisor = async(req,res) => {
//req => world id, advisor id
try{await SkillerModel.findOneAndUpdate(

)

await SkillerModel.findOneAndUpdate(

)} catch (error) {
  console.log(error.message);

}
}


handleSkillerSignUp
uploadCertificateWithName
sendNotification1
paidWorld
addWorld
getLevels
getLessons



export const setLessonCompleted = async(req, res) => {
try{
 const skillerId = req.body.skillerId
   const worldId = req.body.worldId
 
  const  levelId = req.body.levelId
 
 
  const  lessonId = req.body.lessonId
 
const instructor = await SkillerModel.findById(skillerId).select({
  worlds: {
    _id: 1,
    levels: {
      _id: 1,
      lessons: {
        _id: 1,

      }
    }
  }
})
const world = instructor.worlds.find(w => w._id === worldId);
console.log('world from setLessonCompleted =======================-------------------------------->>>>>>>>  ',world)
const level = world.levels.find(l => l._id === levelId);
console.log('level from setLessonCompleted =======================-------------------------------->>>>>>>>  ',level)
const lesson = level.lessons.find(ls => ls._id === lessonId)
console.log('lesson from setLessonCompleted =======================-------------------------------->>>>>>>>  ',lesson)
await SkillerModel.findOneAndUpdate(
  {
    _id: skillerId,
    "worlds._id": worldId, // Find the world by name within the instructor's worlds array
    "worlds.levels._id": levelId, // Find the level by id within the selected world
    "worlds.levels.lessons._id": lessonId
  },
  {
    $set: {
      "worlds.$[world].levels.$[level].lessons.$[lesson].isLessonCompleted":  // Use array filters to target the correct world and level
           true
      
    },
  },
  {
    arrayFilters: [
      { "world._id": worldId }, // Filter to match the world
      { "level._id": levelId }, // Filter to match the level
      {"lesson._id": lessonId}
    ],
    new: true, // Return the updated document
  }
);

    res.status(200).json({ message: "Lesson added successfully", lesson });
  } catch (error) {
    console.error("Error uploading course:", error);
    res.status(500).json({ message: "Error uploading course", error });
  }
}

export const getLessonCompleted = async(req, res) => {
  try{
 
    const skillerId = req.body.skillerId;
    const  worldId = req.body.worldId;
  
     
    const  levelId = req.body.levelId;
    
 
    const  lessonId = req.body.lessonId;
  
 
  
  const instructor = await SkillerModel.findById(skillerId).select({
    worlds: {
      _id: 1,
      levels: {
        _id: 1,
        lessons: {
          _id: 1,
          isLessonCompleted: 1
        }
      }
    }
  })
  const world = instructor.worlds.find(w => w._id === worldId);
 
  const level = world.levels.find(l => l._id === levelId);
 
  const lesson = level.lessons.find(ls => ls._id === lessonId)
 
    const isLessonCompleted = lesson.isLessonCompleted
      res.status(200).json(isLessonCompleted);
    } catch (error) {
      console.error("Error uploading course:", error);
      res.status(500).json({ message: "Error uploading course", error });
    }
  }
  

export const setLevelCompleted = async(req, res) => {
try{  let nextLevelNumber = null;
  const skillerId =req.query.skillerId;

  const  worldId  = req.query.worldId;

const skiller  = await SkillerModel.findById(skillerId).select({
  worlds: {
    _id: 1,
    levels: {
      _id: 1,
      lessons: {
        isLessonCompleted: 1,

      }
    }
  }
});
const worlds = skiller?.worlds;
const world = worlds?.find(w => w._id === worldId)
  world?.levels?.map(async(level) => {
    const notAllCompleted = Boolean (level.lessons.find(ls => ls.isLessonCompleted !== true))

    const notCompletedLesson = level.lessons.find(ls => ls.isLessonCompleted !== true)
    console.log('notCompletedLesson ======================----------------------->>> > > > > >> >>> ', notCompletedLesson)
    console.log('notAllCompleted ====================---------------->>>>>> > > > > >  ',notAllCompleted)
        // Construct the lesson object with the separated arrays
    
        // Update the course with the new lesson
      if(!notAllCompleted) 
        {  await SkillerModel.findOneAndUpdate(
            {
              _id: skillerId,
              "worlds._id": worldId, // Find the world by name within the instructor's worlds array
              "worlds.levels._id": level._id // Find the level by id within the selected world
            },
            {
              $set: {
                "worlds.$[world].levels.$[level].isLevelCompleted": // Use array filters to target the correct world and level
         // Array of quizzes
        true
           
              },
            },
            {
              arrayFilters: [
                { "world._id": worldId }, // Filter to match the world
                { "level._id": level._id } // Filter to match the level
              ],
              new: true, // Return the updated document
            }
          );


          
    }
  })}

  catch (error) {
    console.log(error.message);

  }
}
 



export const chooseAdvisor = async (req, res) => {
  try { 
    const { worldId, advisorId , levelId, skillerId} = req.body;
 

    const world = await WorldsModel.findById(worldId).select({
      _id: 1,
      worldName: 1,

      advisors: {
        _id: 1,
        price: 1,
        name: 1

      }
    })
    const advisor = world.advisors.find(ad => ad._id  === advisorId)
    const advisorSK = await SkillerModel.findById(advisorId).select('totalCash FcmToken')
    const skiller = await SkillerModel.findById(skillerId).select('name')
    console.log('req.body.worldId ============---------------->>> ', worldId);
    console.log('req.body.advisorId ============---------------->>> ', advisorId);

    // Update the `myAdvisorId` field in the matched world
       await SkillerModel.findOneAndUpdate(
      { _id: skillerId, 'worlds._id': worldId },
      { $set: { 'worlds.$.myCurrentAdvisorId':  advisorId } },
      { new: true }
    );


    await SkillerModel.findOneAndUpdate(
      { _id: skillerId, 'worlds._id': worldId , "worlds.levels._id": levelId},
      { $set: { 'worlds.$[world].levels.$[level].myCurrentAdvisorId':  advisorId } },
      {
        arrayFilters: [
          {"world._id": worldId},
          {"level._id": levelId}
        ],
        new: true }
    );

    const updatedSkiller = await SkillerModel.findOneAndUpdate(
      { _id: skillerId},
      { $push: { 'myAdvisors': {_id: advisorId,
        worldId: worldId,
        levelId: levelId
       }} },
      { new: true }
    );


    if (!updatedSkiller) {
      return res.status(404).json({ error: "World not found or invalid skillerId" });
    }

    // Push the student info into the advisor's world
    const updatedAdvisor = await SkillerModel.findOneAndUpdate(
      { _id: advisorId },
      {
        $push: {
         myStudents : {
            _id: skillerId,
            studentName: updatedSkiller.name, // Assuming `name` exists in SkillerModel
            worldId: worldId,
            levelId: levelId,
            current: true
          },
        },
      },
      { new: true }
    );

    if (!updatedAdvisor) {
      return res.status(404).json({ error: "Advisor not found or invalid worldId" });
    }

    await SkillerModel.findByIdAndUpdate(
      advisorId,
      {
        $push:{ cash: {
          _id: purchaseId,
          totalCash: advisorSK.totalCash + (advisor.price * 0.8),
          date:  new Date().toISOString().split('T')[0],
          amount: advisor.price * 0.8,

          buyer: false,
          seller: true,
          advisor: true,
          sender: {
            _id: advisor._id,
            name: advisor.name
          },
          receiver: {
            _id: skillerId,
            name: skiller.name
          },
          world: {
            _id: worldId,
            name: world.worldName
          }
        }}
      },
      {
        new: true
      }
    )


if( advisorSK?.FcmToken)
{    
    const title = `Congratulations been choosen as a provider`
    const content = `${advisorSK.name} have choose you as his provider on ${world.worldName}, you can find him on my advisors and students management, please contact with him to discuss the upcoming skills he want to learn and such so..., you can collect your payment whenever you want from your payments management`
    const FcmToken = advisorSK?.FcmToken
    await sendNotification(FcmToken, title, content);
    }
    res.status(200).json({ message: "Advisor successfully chosen" });
  } catch (error) {
    console.error('Error in chooseAdvisor:', error);
    res.status(500).json({ error: "Internal server error" });
  }
  };




getAdvisors


export const sendMessagesToAdvisor   = async (req, res) => {
  //req => worldId
  try{
  const { messageData, worldId } = req.body;
  const skiller = await SkillerModel.findById(skillerId);
  const worlds = skiller.worlds
  const world = worlds.map(w => w._id === worldId)
  const advisorId= world.myAdvisorId 
  const senderName = skiller.name
  if ( !receiverId || !messageData) {
    return res.status(400).json({ success: false, message: 'Invalid input data' });
  }

  console.log('messageData content ================>>>> > > >  > > > >>>> ',messageData.content)


    // Insert the message in the receiver's schema
    await SkillerModel.findByIdAndUpdate(
      advisorId,
      { $push: { messages: {message: {
        _id: messageData._id,
        withId: messageData.withId,
        senderName:senderName,
        response: false,
        content:messageData.content,
      } } } },
      { new: true }
    );



    // Insert the message in the sender's schema
    await SkillerModel.findByIdAndUpdate(
      skillerId,
      { $push: { messages: { message: {
        _id: messageData._id,
        withId: messageData.withId,

        response: true,
        content: messageData.content,
      } } } },
      { new: true }
    );

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ success: false, message: 'An error occurred.' });
  }
};



export const WSTAsendMessages = async (req, res) => {
  //req => worldId, levelId
  try{
  const { receiverId, messageData } = req.body;
  const skiller = await SkillerModel.findById(skillerId);
  const senderName = skiller.name
  if ( !receiverId || !messageData) {
    return res.status(400).json({ success: false, message: 'Invalid input data' });
  }

  console.log('messageData content ================>>>> > > >  > > > >>>> ',messageData.content)


    // Insert the message in the advisor's schema
    await SkillerModel.findByIdAndUpdate(
      receiverId,
      { $push: { messages: {message: {
        _id: messageData._id,
        withId: messageData.withId,
        student: true,
        senderName:senderName,
        response: false,
        content:messageData.content,
      } } } },
      { new: true }
    );



    // Insert the message in the sender's schema
    await SkillerModel.findByIdAndUpdate(
      skillerId,
      { $push: { messages: { message: {
        _id: messageData._id,
        withId: messageData.withId,
        advisor: true,
        response: true,
        content: messageData.content,
      } } } },
      { new: true }
    );

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ success: false, message: 'An error occurred.' });
  }
};




export const WATSsendMessages = async (req, res) => {
  //req => worldId, levelId
  try{
  const { receiverId, messageData } = req.body;
  const skiller = await SkillerModel.findById(skillerId);
  const senderName = skiller.name
  if ( !receiverId || !messageData) {
    return res.status(400).json({ success: false, message: 'Invalid input data' });
  }

  console.log('messageData content ================>>>> > > >  > > > >>>> ',messageData.content)


    // Insert the message in the advisor's schema
    await SkillerModel.findByIdAndUpdate(
      receiverId,
      { $push: { messages: {message: {
        _id: messageData._id,
        withId: messageData.withId,
        advisor: true,
        senderName:senderName,
        response: false,
        content:messageData.content,
      } } } },
      { new: true }
    );



    // Insert the message in the sender's schema
    await SkillerModel.findByIdAndUpdate(
      skillerId,
      { $push: { messages: { message: {
        _id: messageData._id,
        withId: messageData.withId,
        student: true,
        response: true,
        content: messageData.content,
      } } } },
      { new: true }
    );

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ success: false, message: 'An error occurred.' });
  }
};

export const WATSgetMessages1 = async(req, res) => {

try{  const skiller = await SkillerModel.findById(skillerId);
  const messages = skiller?.messages
  res.status(200).json(messages)  
}
catch (error) {
  console.log(error.message);

}
}


export const WATSgetMessages2 = async(req, res) => {
  //get senderId from the front
try{  const withId = req.query.withId;
  const skiller = await SkillerModel.findById(skillerId);
  const messages = skiller?.messages
  const withIdMessages = messages.find(ms => ms.withId === withId);
  res.status(200).json(withIdMessages)}
  catch (error) {
    console.log(error.message);

  }
}

export const WSTAgetMessages1 = async(req, res) => {
try{
  const skiller = await SkillerModel.findById(skillerId);
  const messages = skiller?.messages
  res.status(200).json(messages)
  
}
catch (error) {
  console.log(error.message);

}
}


export const WSTAgetMessages2 = async(req, res) => {
  //get senderId from the front
try{  const withId = req.query.withId;
  const skiller = await SkillerModel.findById(skillerId);
  const messages = skiller?.messages
  const withIdMessages = messages.find(ms => ms.withId === withId);
  res.status(200).json(withIdMessages)}
  catch (error) {
    console.log(error.message);

  }
}


























export const AGetS = async (req, res) => {
  try {
    if(req.query){
      worldId  = req.query.worldId}
    console.log('req.query ====================--------------------> > > > > >  ', req.query)
    console.log('worldId from AGetS ====================--------------------> > > > > >  ', worldId)
    if (!worldId) {
      return res.status(400).json({ success: false, message: "Missing worldId." });
    }

    const skiller = await SkillerModel.findById(skillerId);
    if (!skiller) {
      return res.status(404).json({ success: false, message: "Skiller not found." });
    }

    const world = skiller.worlds?.find((w) => w._id === worldId);
    if (!world) {
      console.log(`World not found for worldId: ${worldId}`);
      return res.status(404).json({ success: false, message: "World not found." });
    }

    
    const myAdvisorId = world.myCurrentAdvisorId

    console.log('myAdvisorId from AGetS ==========---------------------> > > > ',myAdvisorId)


    const messages = skiller.messages.filter(
      (message) => message.withId === myAdvisorId
    );
    console.log('messages from AGetS================---------------------->>>>>>>> >> ',messages)
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const ASendSA = async (req, res) => {
  let myAdvisorId;
  try {
    const { _id, content, document, worldId } = req.body;

    // Validate inputs
    if (!skillerId) {
      return res.status(400).json({ success: false, message: "Missing skillerId in request body." });
    }
    if (!worldId) {
      return res.status(400).json({ success: false, message: "Missing worldId in request body." });
    }

    console.log('req.body from ASendSA:', req.body);

    const skiller = await SkillerModel.findById(skillerId);
    const senderName = skiller.name;
    if (!skiller) {
      return res.status(404).json({ success: false, message: "Skiller not found." });
    }

    const world = skiller.worlds?.find((w) => w._id === worldId);
    if (!world) {
      return res.status(404).json({ success: false, message: "World not found for the given worldId." });
    }

    console.log('world from ASendSA:', world);

    // Validate and ensure myAdvisors is an array



    // Find current advisor

    myAdvisorId = world.myCurrentAdvisorId;

    console.log('myAdvisorId from ASendSA:', myAdvisorId);

    // Update the advisor's messages
    await SkillerModel.findByIdAndUpdate(myAdvisorId, {
      $push: {
        messages: {
          _id,
          withId: skillerId,
          senderName,
          senderId: skillerId,
          worldId,
          content,
          document,
          response: false,
          student: true,
        },
      },
    });

    // Update the sender's messages
    await SkillerModel.findByIdAndUpdate(skillerId, {
      $push: {
        messages: {
          _id,
          senderName,
          senderId: skillerId,
          worldId,
          withId: myAdvisorId,
          content,
          document,
          response: true,
        },
      },
    });

    res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


//MyStudentsChats1.js
export const AGetA1 = async(req, res) => {
try{  //=>req worldId
  if(req.query.worldId){
   worldId = req.query.worldId;}
  const skiller = await SkillerModel.findById(skillerId);
  const messages = skiller?.messages
  const filteredMessages = messages?.filter(ms => ms.student === true);
      // Use a Set to track unique senderId values
      const uniqueSenderIds = new Set();
      const uniqueMessages = [];
  
      // Loop through all messages and add to uniqueMessages if senderId is not in the Set
      for (const message of filteredMessages) {
        if (!uniqueSenderIds.has(message.senderId)) {
          uniqueSenderIds.add(message.senderId);
          uniqueMessages.push(message);
        }
      }
  
      res.status(200).json(uniqueMessages);} catch (error) {
        console.log(error.message);
    
      }

}
//MyStudentsChats2.js
export const AGetA2 = async(req, res) => {
  //req => withId
try{  if(req.query.worldId){
    worldId = req.query.worldId;}
    console.log('req.query     ============ --------------- ==========-     ----- >> ',req.query)
    if(req.query.withId){
      withId = req.query.withId;}
  const skiller = await SkillerModel.findById(skillerId);
  console.log('skillerId ==========---------->>>> ', skillerId)
  const messages = skiller?.messages
  console.log('messages ===========----------------------->>> > > > >  ',messages)
  const withIdMessages = messages?.filter(ms =>  ms.student === true && ms.withId === withId);
  console.log('withIdMessages =====================-----------------------> > >> > > >  ',withIdMessages)
  res.status(200).json(withIdMessages)} catch (error) {
    console.log(error.message);

  }
}  
 

export const AsendAS = async(req, res) => {
  try{
  const { _id, withId, content, document, worldId } = req.body;
  console.log('req.body ===========--------------------->> > > >',req.body)
  const skiller = await SkillerModel.findById(skillerId);
  const worlds = skiller.worlds

  const senderName = skiller.name;

  
    // Insert the message into the receiver's schema
    await SkillerModel.findByIdAndUpdate(
      withId,
      {
        $push: {
          messages: {
            _id,
            withId: skillerId,
            senderId: skillerId,
            worldId, 
            senderName,
            response: false,
            advisor: true,
            content,
            document, // Store file/document URL
          },
        },
      },
      { new: true }
    );

    // Insert the message into the sender's schema
    await SkillerModel.findByIdAndUpdate(
      skillerId,
      {
        $push: {
          messages: {
            _id,
            worldId, 
            senderId: skillerId,
            withId: withId,
            response: true,
            content,
            document, // Store file/document URL
          },
        },
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
}

//hello there i am awab hassan ahmed and i am sell-skill ceo founder hope everythin will go well with facebook ads and with find real content in this site inshalla


//WorldChats1.js


export const wGet1 = async (req, res) => {
  try {
    const { worldId } = req.query;

    if (!worldId) {
      return res.status(400).json({ error: "worldId is required" });
    }

    const skiller = await SkillerModel.findById(skillerId);
    if (!skiller) {
      return res.status(404).json({ error: "Skiller not found" });
    }

    const messages = skiller?.messages;
    if (!messages) {
      return res.status(200).json([]);
    }

    // Filter messages by worldId and response flag
    const filteredMessages = messages.filter(
      (ms) => ms.worldId === worldId && ms.response === false
    );

    // Use a Set to track unique senderId values
    const uniqueSenderIds = new Set();
    const uniqueMessages = [];

    // Loop through all messages and add to uniqueMessages if senderId is not in the Set
    for (const message of filteredMessages) {
      if (!uniqueSenderIds.has(message.senderId)) {
        uniqueSenderIds.add(message.senderId);
        uniqueMessages.push(message);
      }
    }

    res.status(200).json(uniqueMessages);
  } catch (error) {
    res.status(500).json({ error: "An error occurred", details: error.message });
  }
};


// export const wGet1 = async(req, res) => {

//   if(req.query.worldId){
//    worldId = req.query.worldId}
//   const skiller = await SkillerModel.findById(skillerId);
//   const messages = skiller?.messages
//   const withIdMessages = messages?.filter(ms => ms.worldId === worldId && ms.response === false);
//   res.status(200).json(withIdMessages)
// }




//WorldChats2.js
export const wGet2 = async(req, res) => {
  //req worldId, withId
try{  if(req.query.worldId){
    worldId = req.query.worldId}
    if(req.query.withId){
      withId = req.query.withId  }
  const skiller = await SkillerModel.findById(skillerId);
  const messages = skiller?.messages
  const withIdMessages = messages?.filter(ms => ms.worldId === worldId && ms.withId === withId );
  res.status(200).json(withIdMessages)} catch (error) {
    console.log(error.message);

  }
}

export const wSend = async(req, res) => {
 //=> req worldId
 const { _id,withId,worldId,   content, document } = req.body;
 const skiller = await SkillerModel.findById(skillerId);

 const senderName = skiller.name;

 try {
   // Insert the message into the receiver's schema
   await SkillerModel.findByIdAndUpdate(
     withId,
     {
       $push: {
         messages: {
           _id,
           withId: skillerId,
           worldId,
           senderName,
           senderId: skillerId,
           response: false,
           student: true,
           content,
           document, // Store file/document URL
         },
       },
     },
     { new: true }
   );

   // Insert the message into the sender's schema
   await SkillerModel.findByIdAndUpdate(
     skillerId,
     {
       $push: {
         messages: {
           _id,
           withId,
           senderId: skillerId,
           worldId,
           response: true,
           content,
           document, // Store file/document URL
         },
       },
     },
     { new: true }
   );

   res.status(200).json({ success: true, message: "Message sent successfully!" });
 } catch (error) {
   console.error("Error sending message:", error);
   res.status(500).json({ success: false, message: "An error occurred." });
 }
}

export const WAGetA1 = async(req, res) => {
  //=>req worldId, levelId
try{  const skiller = await SkillerModel.findById(skillerId);
  const messages = skiller?.messages
  const withIdMessages = messages?.filter(ms => ms.worldId === worldId && ms.student === true);
  res.status(200).json(withIdMessages)} catch (error) {
    console.log(error.message);

  }
}


export const WAGetA2 = async(req, res) => {
  //req => withId
try{  const skiller = await SkillerModel.findById(skillerId);
  const messages = skiller?.messages
  const withIdMessages = messages?.filter(ms =>  ms.worldId === worldId && ms.student === true && ms.withId === withId);
  res.status(200).json(withIdMessages)} catch (error) {
    console.log(error.message);

  }
}


export const LAGetA1 = async(req, res) => {
  //=>req worldId, levelId
try{  const skiller = await SkillerModel.findById(skillerId);
  const messages = skiller?.messages
  const withIdMessages = messages?.filter(ms => ms.worldId === worldId && ms.levelId === levelId && ms.student === true);
  res.status(200).json(withIdMessages)} catch (error) {
    console.log(error.message);

  }
} 


export const LAGetA2 = async(req, res) => {
  //req => withId
try{  const skiller = await SkillerModel.findById(skillerId);
  const messages = skiller?.messages
  const withIdMessages = messages?.filter(ms =>  ms.worldId === worldId && ms.levelId === levelId && ms.student === true && ms.withId === withId);
  res.status(200).json(withIdMessages)} catch (error) {
    console.log(error.message);

  }
}
AGetA1
setLevelCompleted
getResources
uploadCourse
setLessonCompleted
insertAdvisor
getAdvisors
getLevels
addWorld
addLevel
getMessages2
startExam
sendMessages
uploadCourse
paidWorld
paidWorld
chooseAdvisor
ASendSA
AsendAS
wGet1
AGetA2
getExams
setExamLink
































insertAdvisor














 export const getExams4Advisor = async(req, res) => {
try{   const skiller = await SkillerModel.findById(skillerId);
   const exams = skiller?.exams;
   const exams4Advisor = exams?.filter(ex => ex.iamInstructor === true);
   res.json(exams4Advisor)} catch (error) {
    console.log(error.message);

  }
 }

 export const getExams4Student = async(req, res) => {
try{   const skiller = await SkillerModel.findById(skillerId);
   const exams = skiller?.exams;
   const exams4Student = exams?.filter(ex => ex.iamInstructor === false);
      res.json(exams4Student)} catch (error) {
        console.log(error.message);
    
      }
 }

// export const setExamPassed = async(req, res) => {
//   if(exam.isEnded && exam.isPassed){
//     uploadCertificateWithName()
//   }
// }
// export const setExamGrade = async(req, res) => {

//   if(exam.isEnded && exam.isPassed){
//     uploadCertificateWithName()
//   }

// }

// export const setAdvisorRate = async(req, res) => {
//   if(exam.isStarted){

//   }
// }

// export const addToWorldAdvisors = async(req, res) => {
//   //req => want to be advisor from front
//   if(exam.isEnded && exam.isPassed && isGraduationLevel && allowAdvisors && wantToBeFromFront){
    
//   }
// }




// Set exam grade
export const setExamGrade = async (req, res) => {
try{  const { examId, grade, studentId } = req.body;
  console.log('req.body from setExamGrade --------------------------------------------------==>',req.body)

     await SkillerModel.findOneAndUpdate(
      { 
        _id: skillerId,
        "exams._id": examId },
      { $set: { "exams.$.grade": grade, "exams.$.isGraded": true, "exams.isEnded": true } },
      { new: true }
    );
 




    await SkillerModel.findOneAndUpdate(
     { 
       _id: studentId,
       "exams._id": examId },
     { $set: { "exams.$.grade": grade, "exams.$.isGraded": true, "exams.isEnded": true } },
     { new: true }
   );}
   catch (error) {
    console.log(error.message);

  }

  //is ended to true
};



startExam



export const insertAdvisorToWorld = async(req, res) => {
  //req => student id, worldId
try{  const advisor = await SkillerModel.findById(skillerId);
  const advisorName = advisor.name
  const studentToBeAdvisor = await SkillerModel.findById(req.body.studentId)
  const studentToBeAdvisorName = studentToBeAdvisor?.name
  const world = await WorldsModel.findById(worldId)
  if(world.allowAdvisors) {
  await WorldsModel.findByIdAndUpdate(
    worldId,
    {
      $push: {
        advisors: {
          //EX

          _id: req.body.studentId,
          originAdvisorId: skillerId,
          originaAdvisorName: advisorName,
          studentToBeAdvisorName: studentToBeAdvisorName, //which the advisor in this case
          isAvailable: false
        }
      }
    },
    {
      new : true
    }
  )}}
  catch (error) {
    console.log(error.message);

  }
}


// Set exam as passed
export const setExamPassed = async (req, res) => {
try{  const { examId, studentId } = req.body;
  const skiller = await SkillerModel.findById(skillerId)
  const exam = skiller.exams.find ( ex => ex._id === examId)
  const worldId = exam.worldId
  const levelId = exam.levelId
  const worldsk = skiller.worlds.find(w => w._id === worldId);
  const level = worldsk.levels.find(l => l._id === levelId)
  const nextLevelNumber = level.levelNumber + 1;
  try {
    const skiller = await SkillerModel.findOneAndUpdate(
      { 
        _id: skillerId,
        "exams._id": examId },
      { $set: { "exams.$.isPassed": true } },
      { new: true }
    );

  } catch (error) {
    res.status(500).json({ error: "Failed to set exam as passed." });
  }


  await SkillerModel.findOneAndUpdate(
    { 
      _id: studentId,
      "exams._id": examId },
    { $set: { "exams.$.isPassed": true } },
    { new: true }
  );


  //set level passed
  await SkillerModel.findOneAndUpdate(
    {
      _id: studentId, 
      "worlds._id": worldId,
      "levels._id": levelId
    },
    {
      $set: {
        "worlds.$[world].levels.$[level].isPassedLevelExam": true
      }
    },
    {
      arrayFilters: [
        {
          "world._id":worldId,
          "level._id": levelId,

        }
      ],
      new: true
    }
  )
  //set next level to open
  await SkillerModel.findOneAndUpdate(
    {
      _id: studentId,
      "worlds._id": worldId,
      "levels.levelNumber": nextLevelNumber
    },
    {
      $set: {
        "worlds.$[world].levels.$[level].isOpen": true
      }
    },
    {
      arrayFilters: [
       { 
        "world._id": worldId},
        {"level.levelNumber": nextLevelNumber}
      ],
      new : true
    }
  )
  //insert advisor


  const advisor = await SkillerModel.findById(skillerId);
  const advisorName = advisor.name
  const studentToBeAdvisor = await SkillerModel.findById(studentId)
  const studentToBeAdvisorName = studentToBeAdvisor?.name
  const world = await WorldsModel.findById(worldId)
  if(world.allowAdvisors) {
  await WorldsModel.findByIdAndUpdate(
    worldId,
    {
      $push: {
        advisors: {
          //EX

          _id: studentId,
          originAdvisorId: skillerId,
          originaAdvisorName: advisorName,
          studentToBeAdvisorName: studentToBeAdvisorName, //which the advisor in this case
          isAvailable: false
        }
      }
    },
    {
      new : true
    }
  )}} catch (error) {
    console.log(error.message);

  }
};


// Set exam as passed
export const setExamNotPassed = async (req, res) => {
try{  const { examId, studentId } = req.body;

  await SkillerModel.findOneAndUpdate(
      { 
        _id: skillerId,
        "exams._id": examId },
      { $set: { "exams.$.isPassed": false } },
      { new: true }
    );




  
    await SkillerModel.findOneAndUpdate(
        { 
          _id: studentId,
          "exams._id": examId },
        { $set: { "exams.$.isPassed": false } },
        { new: true }
      );
}
catch (error) {
  console.log(error.message);

}
  //insert advisor


};

export const allowAdvisorsForWorld = async(req, res) => {
  //req worldId
try{  await WorldsModel.findByIdAndUpdate(
    worldId,
    {
      $set: {allowAdvisors: true}
    },
    {
      new: true
    }
  )} catch (error) {
    console.log(error.message);

  }
}

export const dontAllowAdvisorsForWorld = async(req, res) => {
  //req worldId
try{  await WorldsModel.findByIdAndUpdate(
    worldId,
    {
      $set: {allowAdvisors: false}
    },
    {
      new: true
    }
  )} catch (error) {
    console.log(error.message);

  }
}
// Send comment
export const sendComment = async (req, res) => {
  const { examId, comment, studentId } = req.body;
  try {
    const skiller = await SkillerModel.findOneAndUpdate(
      {
        _id: skillerId,
        "exams._id": examId },
      { $set: { "exams.$.comment": comment } },
      { new: true }
    );
    res.json(skiller);
  } catch (error) {
    res.status(500).json({ error: "Failed to send comment." });
  }


  try {
    const skiller = await SkillerModel.findOneAndUpdate(
      {
        _id: studentId,
        "exams._id": examId },
      { $set: { "exams.$.comment": comment } },
      { new: true }
    );
    res.json(skiller);
  } catch (error) {
    res.status(500).json({ error: "Failed to send comment." });
  }
};

// View certification
export const viewCertification = async (req, res) => {
  const { examId } = req.params;
  try {
    const skiller = await SkillerModel.findOne({
      "certifications.examId": examId,
    });
    const certification = skiller.certifications.find(
      (cert) => cert.examId === examId
    );
    res.set("Content-Type", certification.contentType);
    res.send(certification.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch certification." });
  }
};

export const rateAdvisor = async (req, res) => {
  const {  studentId, worldId, levelId, rate } = req.body;
  const skiller = await SkillerModel.findById(skillerId)
  const world = skiller.worlds.find(w => w._id === worldId);
  const advisorId = world.myCurrentAdvisorId;

  try {
    const skiller = await SkillerModel.findOneAndUpdate(
      {
        _id: advisorId,
        "myStudents._id" :studentId
      },
      {
        $set: { "myStudents.$[student].rate": rate }, // Update the rate
      },
      {
        arrayFilters: [
          {
            "student._id": studentId,
            "student.worldId": worldId,
            "student.levelId": levelId,
          }, // Combine conditions in one filter
        ],
        new: true, // Return the updated document
      }
    );

    if (!skiller) {
      return res.status(404).json({ error: "Student or advisor not found." });
    }

    res.json({ success: true, updatedAdvisor: skiller });
  } catch (error) {
    console.error("Error updating student rate:", error);
    res.status(500).json({ error: "Failed to update the student's rate." });
  }
};


export const getAdvsiorsFromAWorld = async(req, res) => {
  //req => worldId
try{  const world = await WorldsModel.findById(worldId);
  const advisors = world.advisors
  const availableAdvisors = advisors.filter(ad => ad.isAvailable === true)
  res.json(availableAdvisors)} catch (error) {
    console.log(error.message);

  }
}


setExamPassed


 export const setAdvisorToAvailable = async(req, res) => {
try{ 
  const skillerId = req.body.skillerId
  await WorldsModel.findOneAndUpdate(
    {
      _id: worldId, 
      "advisors._id": skillerId
    },
    {
      $set: {
        "advisors.$.isAvailable": true
      }
    },
    {
      new: true
    }
  )} catch (error) {
    console.log(error.message);

  }
 }


 export const setAdvisorToUnAvailable = async(req, res) => {
  try{  
    const skillerId= req.body.skillerId
    await WorldsModel.findOneAndUpdate(
      {
        _id: worldId, 
        "advisors._id": skillerId
      },
      {
        $set: {
          "advisors.$.isAvailable": false
        }
      },
      {
        new: true
      }
    )} catch (error) {
      console.log(error.message);
  
    }
   }
  
 rateAdvisor
 uploadCourse
 setExamGrade
 setExamLink


getExams4Student

setExamGrade


export const setTimeLinkPassingGExamType = async(req, res) => {
try{  console.log('req.body from setLinkTimePassingType ==============-----------------------===============-------==>',req.body)
  const {examId, studentId, examTime, passingGrade, examWillBeAs, worldId} = req.body
  await SkillerModel.findOneAndUpdate(
    {
      _id: skillerId,
      "exams._id": examId
    },
    {
      $set: 
    { "exams.$.examTime": examTime,
      "exams.$.passingGrade": passingGrade,
      "exams.$.examWillBeAs": examWillBeAs,
      "exams.$.examLink":  `https://meet.jit.si/${examId}`,}
    },
    {
      new : true
    }
  )

  await SkillerModel.findOneAndUpdate(
    {
      _id: studentId,
      "exams._id": examId
    },
    {
      $set: 
    { "exams.$.examTime": examTime,
      "exams.$.passingGrade": passingGrade,
      "exams.$.examWillBeAs": examWillBeAs,
      "exams.$.examLink":  `https://meet.jit.si/${examId}`,}
    },
    {
      new : true
    }
  )}
  catch (error) {
    console.log(error.message);

  }
}


export const sendGradeComment = async(req, res) => {
try{
 
  const { certificationId, examId, studentId, grade, comment, purchaseId, skillerId} = req.body;
  
  const skiller = await SkillerModel.findById(studentId).select('exams name surname');

  if (!skiller) {
    return res.status(404).json({ message: 'Client not found' });
  }


  const exam = skiller?.exams?.find(ex => ex._id === examId)
        console.log('exam ==============================-=-=-=-=-=-=-> ',exam)
  worldId = exam?.worldId
  console.log('exam.worldId ===========================-=-=-=-=-=-=- >> ',exam.worldId)
  levelId = exam?.levelId
  console.log('exam.levelId ==================================-=-=-=-=-=-=-> > > >   ', exam.levelId)
  const world = await WorldsModel.findById(worldId).select('levels advisorAmount worldName price isWorldAllowingAdvisors');
  const level = world.levels.find(l => l._id === levelId)
  const isToBeAnAdvisorLevel = level.toBeAnAdvisorLevel
 
  console.log('level from sendGradeComment ====================---------------->>>',level)
  const nextLevelNumber = level.levelNumber + 1;
  console.log('nextLevelNumber ===========================::::---------------->>> ===>>>> ',nextLevelNumber)
  console.log('exam from sendGradeComment ============-----------------------==> ',exam)
  await SkillerModel.findOneAndUpdate(


    {
      _id: skillerId,
      "exams._id": examId
    },
    {
      $set: {
        "exams.$.grade": grade,
        "exams.$.comment":comment
      }
    },
    {
      new: true
    }
  )

  await SkillerModel.findOneAndUpdate(
    {
      _id: studentId,
      "exams._id": examId
    },
    {
      $set: {
        "exams.$.grade": grade,
        "exams.$.comment":comment
      }
    },
    {
      new: true
    }
  )

//////////////////////if passed
  if(grade >= exam.passingGrade){
    await SkillerModel.findOneAndUpdate(


      {
        _id: skillerId,
        "exams._id": examId
      },
      {
        $set: {
          "exams.$.isPassed": true,

        }
      },
      {
        new: true
      }
    )
  
    await SkillerModel.findOneAndUpdate(
      {
        _id: studentId,
        "exams._id": examId
      },
      {
        $set: {
          "exams.$.isPassed": true,
  
        }
      },
      {
        new: true
      }
    )

    await SkillerModel.findOneAndUpdate(
      {
        _id: studentId,
        "worlds._id": worldId
      },
      {
        $set:{ "worlds.$.myCurrentAdvisorId": skillerId}
      },
      {
        new : true
      }
    )

    await SkillerModel.findOneAndUpdate(
      {
        _id: studentId,
        "worlds._id": worldId,
        "worlds.levels.levelNumber": nextLevelNumber
      },
      {
        $set: { "worlds.$[world].levels.$[level].isOpen": true }
      },
      {
        arrayFilters: [
          { "world._id": worldId },
          { "level.levelNumber": nextLevelNumber }
        ],
        new: true
      }
    );   

    await WorldsModel.findOneAndUpdate(
      {
        _id: worldId, 
        "students._id": skillerId, 
      }, 
      {
        $set: {
          "students.$.levelId": levelId
        }
      },
      {
        new: true
      }
    )
    

  
    const userName = skiller.name;
  
     try {
       const templatePath = path.join(__dirname, '../certificates/certificate-template.png');
      
       // Load the certificate template
       const img = await loadImage(templatePath);
      
       // Create a canvas with the same size as the image
       const canvas = createCanvas(img.width, img.height);
       const ctx = canvas.getContext('2d');
  
       // Draw the template image on the canvas
       ctx.drawImage(img, 0, 0, img.width, img.height);
  
    //   // Set font and color for text
       ctx.fillStyle = 'black';
     ctx.font = '60px sans-serif'; // You can adjust the font size and style
  
    //   // Measure the text width to center it horizontally
       const textWidth = ctx.measureText(userName).width;
       const xPos = (canvas.width - textWidth) / 2; // Center horizontally
       const yPos = canvas.height / 2; // Adjust this based on where you want the text
  
       // Draw the text (the user's name)
       ctx.fillText(userName, xPos, yPos);
  
       // Save the image to a buffer
       const buffer = canvas.toBuffer('image/png');
      
  
       await SkillerModel.findByIdAndUpdate(
         
           studentId
         ,
         {
           $push: {
             certifications: {
               _id: req.body.certificationId,
               examId: req.body.examId,
               worldId: req.body.worldId,
               levelId: req.body.levelId,
               name: `certificate-${skillerId}.png`,
               data: buffer,
               contentType: 'image/png',
          
             }
           }
         }
       )
       
  

       const title = `Congratulations now you are an advisor at ${world.worldName}`
const content = `Please go to your profile settings and put your price and availabilty status there`
const FcmToken = studentToBeAdvisor.FcmToken
await sendNotification(FcmToken, title, content);

await SkillerModel.findByIdAndUpdate(
  studentId,
  {
    $push: {
      notifications : {
        title: title,
        content: content,
        readed: false,
        type: 'advisor'
      }
    }
  },
  {
    new : true
  }
)


const advisor = await SkillerModel.findById(skillerId).select('name totalCash');
console.log('advisors from problem side ============================-=-=-=-=-=-=-=-=-> > > > > > >  ', advisor)
const advisorName = advisor.name
const studentToBeAdvisor = await SkillerModel.findById(req.body.studentId).select('name FcmToken')
console.log('studentToBeAdvisor from problem side ====================-=-=-=-=-=> > > >  > > >  ',studentToBeAdvisor)
const studentToBeAdvisorName = studentToBeAdvisor?.name
console.log('world?.isWorldAllowingAdvisors  ====================-=-=-=-=-=- > >>  ', world?.isWorldAllowingAdvisors )
console.log('isToBeAnAdvisorLevel ===============================-=-=-=-=-=-=-=-> > >  > > > >  ', isToBeAnAdvisorLevel)
console.log('worldId =================================-=-=-=-=-=-=-=-=-> > > >>  ', worldId)
if(world?.isWorldAllowingAdvisors && isToBeAnAdvisorLevel) {
await WorldsModel.findByIdAndUpdate(
  worldId,
  {
    $push: {
      advisors: {
        //EX

        _id: req.body.studentId,
        price: 5,
        originAdvisorId: skillerId,
        originaAdvisorName: advisorName,
        studentToBeAdvisorName: studentToBeAdvisorName, //which the advisor in this case
        isAvailable: false
      }
    }
  },
  {
    new : true
  }
)

await WorldsModel.findByIdAndUpdate(
  worldId,
  {
    $push: {
      examers: {
        //EX

        _id: req.body.studentId,
        price: 5,
        name: skiller.name,
        surname: skiller.surname,
        isAvailable: false
      }
    }
  },
  {
    new : true
  }
)

await SkillerModel.findByIdAndUpdate(
skillerId, 
{
  $push: {
    cash:{
      _id: purchaseId,
      date: new Date().toISOString().split('T')[0],
      amount: world.advisorAmount,
      buyer: false,
      seller: false,
      advisor: true,
      sender: {
        _id: studentId,
        name: skiller.name
      },
      receiver: {
        _id: skillerId,
        name: advisor.name
      },
      world: {
        _id: worldId,
        name: world.worldName
      }
    }
  }
},
{
  new: true
}
)

await SkillerModel.findById(
skillerId, 
{
  $set: {
    totalCash: advisor.totalCash + world.advisorAmount
  }
},
{
  new: true
}
)



}
       res.status(200).json({ message: 'Certificate generated and uploaded successfully!' });



     } catch (error) {
       console.error('Error generating certificate:', error);
       res.status(500).json({ message: 'An error occurred while generating the certificate.' });
     }
  
  }


} catch (error) {
    console.log(error.message);

  }
  //if passed insert and certificate and ask
}
 

export const getProfile = async (req, res) => {
  try {
    //change skiller id to that from front
    let haveSameWorld = false;
    let areMates = false;
    const {id} = req.query
    console.log('certainSkillerId from getProfile ==============================================-=-=-=-=-=-=-=-=-=-=-=-=-=-> > > > > > > > > > > >  ',id)
    const skiller = await SkillerModel.findById(id).select(    {
      coverPicture : 1,
      picture : 1,
      name : 1,
      surname : 1,
      letter : 1,
      totalCash : 1,
      definingVideo : 1,
      facebook : 1,
      twitter: 1,
       linkedin:1,
        instagram:1,
        worlds: {
          _id: 1,
          worldName: 1
        }
    })

  //   const skWorlds = skiller.worlds.filter(w => w.publisher)
  //   const skCart = skiller.myCart
  //   console.log ( ' skCart =---------------------------==> ',skCart)
  //  console.log ( ' skWorld =---------------------------==> ',skWorlds)

 
    if (!skiller) {
      return res.status(404).json({ error: "User not found" });
    }

if(skillerId)
{    
  const skiller2 = await SkillerModel.findById(skillerId).select({
    worlds:{
      _id : 1,
      worldName: 1
    }
  })
  const skiller1Worlds = skiller?.worlds
  const skiller2Worlds = skiller2?.worlds

  skiller1Worlds?.forEach(sk1w => {
    if (skiller2Worlds.some(sk2w => sk1w._id === sk2w._id )) {
      haveSameWorld = true;
    }
  });


  areMates = Boolean(skiller?.mates?.find(mt => mt._id === skillerId))
}
    const formattedSkiller = {
      _id: skiller._id,
      coverPicture: skiller.coverPicture,
      picture: skiller.picture,
      name: skiller.name ,
      surname: skiller.surname ,
      letter: skiller.letter || "",
      rate: skiller.rate || 0,
      followers: skiller.followers || [],
      following: skiller.following || [],
      joinedAt: skiller.joinedAt || null,
      definingVideo: skiller.definingVideo || null,
      cash: skiller.totalCash || 0,

      // imageCertifications: skiller.imageCertifications || [],
      // pdfCertifications: skiller.pdfCertifications || [],
      // certifications: skiller.certifications || [],
      // realWorldResults: skiller.realWorldResults || [],
      // instructorDescription: skiller.instructorDescription || "No description available",

      areMates: areMates,
      haveSameWorld: haveSameWorld
    };

    res.status(200).json(formattedSkiller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
 



export const getMProfile = async (req, res) => {
  try {
    //change skiller id to that from front
    let haveSameWorld = false;
    let areMates = false;
    const {id, skillerId} = req.query
 
    const skiller = await SkillerModel.findById(id).select(    {
      coverPicture : 1,
      picture : 1,
      name : 1,
      surname : 1,
      letter : 1,
      totalCash : 1,
      definingVideo : 1,
      facebook : 1,
      twitter: 1,
       linkedin:1,
        instagram:1,
        worlds: {
          _id: 1,
          worldName: 1
        }
    })
  //   const skWorlds = skiller.worlds.filter(w => w.publisher)
  //   const skCart = skiller.myCart
  //   console.log ( ' skCart =---------------------------==> ',skCart)
  //  console.log ( ' skWorld =---------------------------==> ',skWorlds)

 
    

if(skillerId)
{    
  const skiller2 = await SkillerModel.findById(skillerId).select({
    worlds:{
      _id : 1
    }
  })
  const skiller1Worlds = skiller.worlds
  const skiller2Worlds = skiller2.worlds

  skiller1Worlds.forEach(sk1w => {
    if (skiller2Worlds.some(sk2w => sk1w._id === sk2w._id )) {
      haveSameWorld = true;
    }
  });


  areMates = Boolean(skiller?.mates?.find(mt => mt._id === skillerId))
}
    const formattedSkiller = {
      _id: skiller._id,
      coverPicture: skiller.coverPicture
        ? `data:${skiller?.coverPicture?.picture?.contentType};base64,${skiller?.coverPicture?.picture?.data?.toString('base64')}`
        : null,
      picture: skiller.picture
        ? `data:${skiller?.picture?.picture?.contentType};base64,${skiller?.picture?.picture?.data?.toString('base64')}`
        : null,
      name: skiller.name ,
      surname: skiller.surname ,
      letter: skiller.letter || "",
      rate: skiller.rate || 0,
      followers: skiller.followers || [],
      following: skiller.following || [],
      joinedAt: skiller.joinedAt || null,
      definingVideo: skiller.definingVideo || null,
      cash: skiller.totalCash || 0,

      // imageCertifications: skiller.imageCertifications || [],
      // pdfCertifications: skiller.pdfCertifications || [],
      // certifications: skiller.certifications || [],
      // realWorldResults: skiller.realWorldResults || [],
      // instructorDescription: skiller.instructorDescription || "No description available",

      areMates: areMates,
      haveSameWorld: haveSameWorld
    };

    res.status(200).json(formattedSkiller);
  } catch (error) {
 
    res.status(500).json({ error: "Server error" });
  }
};


export const getWorldsForProfile = async(req, res) => {
  try
{
  const {id, skillerId} = req.query;
  const skiller = await SkillerModel.findById(id).select({
    worlds: {
    _id: 1,
      publisher : 1,
      worldName: 1,
      price: 1,
      published: 1,
   
      worldDescription: 1,
   
   
      worldThumbnail: 1,
   
   
    }
  })
 console.log('worlds from ###########################################$$$$$$$$$$$$$$$$ getWorldsForProfile################################$$$$$$$$$$$$$$$$$$$$$$$$ ======================================-=-=-=-=-=-=-=-> >  > > >>   ',skiller.worlds)
  const worlds = skiller.worlds.map((world) => ({

    _id: world._id,
    worldName: world.worldName,
    price: world.price,
    publisher: world.publisher,
    worldDescription: world?.worldDescription,
    published: world.published,
 
    worldThumbnail: world.worldThumbnail,
 
 

  }))

  res.status(200).json(worlds)}catch(error){

  }
}



export const getCertifications = async(req, res) => {
try
{  const {id, skillerId} = req.query;
  const skiller = await SkillerModel.findById(id).select('certifications')
 


  res.status(200).json(skiller?.certifications)}
  catch(error) {
 
  }
}



export const getPdfCertifications = async(req, res) => {
try
{  const {id} = req.query;
  const skiller = await SkillerModel.findById(id).select('pdfCertifications')
 
  console.log('skiller.pdfCertifications############################################## ===============-=-=-=-=-=-=-=-=>>> > > > > > ',skiller.pdfCertifications)

  res.status(200).json(skiller?.pdfCertifications)}catch(error){
    console.log(error.message)
  }
}


export const getImageCertifications = async(req, res) => {
  try
{
  const {id} = req.query;
  const skiller = await SkillerModel.findById(id).select('imageCertifications')
 
  console.log('skiller.imageCertifications############################################## ===============-=-=-=-=-=-=-=-=>>> > > > > > ',skiller.imageCertifications)

  res.status(200).json(skiller.imageCertifications)}catch(error){
    console.log(error.message)
  }
}

export const SgetProfile = async (req, res) => {
  try {
    //change skiller id to that from front

    const skiller = await SkillerModel.findById(skillerId)
    const skWorlds = skiller.worlds
    const skCart = skiller.myCart
    console.log ( ' skCart =---------------------------==> ',skCart)
   console.log ( ' skWorld =---------------------------==> ',skWorlds)

    const worlds = await WorldsModel.find();
    if (!skiller) {
      return res.status(404).json({ error: "User not found" });
    }

    const formattedSkiller = {
      _id: skiller._id,
      coverPicture: skiller.coverPicture
        ? `data:${skiller?.coverPicture?.picture?.contentType};base64,${skiller?.coverPicture?.picture?.data?.toString('base64')}`
        : null,
      picture: skiller.picture
        ? `data:${skiller?.picture?.picture?.contentType};base64,${skiller?.picture?.picture?.data?.toString('base64')}`
        : null,
      name: skiller.name || "N/A",
      surname: skiller.surname || "N/A",
      letter: skiller.letter || "",
      rate: skiller.rate || 0,
      followers: skiller.followers || [],
      following: skiller.following || [],
      worlds: skWorlds.map((world) => ({

        _id: world._id,
        worldName: world.worldName,
        price: world.price,
        numberOfStudents: world?.students?.length || 0,
        numberOfAdvisors: world?.advisors?.length || 0,
        worldDescription: world?.worldDescription,
        dateOfPublish: world.dateOfPublish,
        isWorldAllowingAdvisors: world.isWorldAllowingAdvisors,
        worldThumbnail: world.worldThumbnail?.data && world.worldThumbnail.contentType
          ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
          : null,
        publisher: world.publisher
          ? {
              _id: world.publisher._id,
              name: world.publisher.name,
              rate: world.publisher.rate,
              picture: world.publisher.picture?.picture?.data && world.publisher.picture?.picture.contentType
              ? `data:${world.publisher.picture?.picture?.contentType};base64,${world.publisher.picture?.picture?.data.toString('base64')}`
              : null,
            
            }
          : null,
        comments: world?.comments?.map((comment) => ({
          _id: comment._id,
          comment: comment.comment,
          commenters: comment.commenter.map((commenter) => ({
            _id: commenter._id,
            name: commenter.name,
            picture: commenter.picture.picture?.data && commenter.picture.picture.contentType
              ? `data:${commenter.picture.picture.contentType};base64,${commenter.picture.picture.data.toString('base64')}`
              : null,
          })),
        })),
        allowedCard: (skWorlds ? !Boolean(skWorlds.find(w => w._id === world._id)  ) : true )         &&         ( skCart ? !Boolean ( skCart.find(cr => cr._id === world._id)) : true),
        rates: world?.rates?.map((rate) => ({
          _id: rate._id,
          rate: rate.rate,
          rater: rate.rater
            ? {
                _id: rate.rater._id,
                name: rate.rater.name,
                picture: rate.rater.picture.picture?.data && rate.rater.picture.picture.contentType
                  ? `data:${rate.rater.picture.picture.contentType};base64,${rate.rater.picture.picture.data.toString('base64')}`
                  : null,
              }
            : null,
        })),
      })),
      certifications: skiller.certifications || [],
      realWorldResults: skiller.realWorldResults || [],
      instructorDescription: skiller.instructorDescription || "No description available",
      joinedAt: skiller.joinedAt || null,
      definingVideo: skiller.definingVideo || null,
      cash: skiller.totalCash || 0,
    };

    res.status(200).json(formattedSkiller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


getProfile





export const addLike = async(req, res) => {

}

export const removeLike = async (req, res) => {

}

export const addComment = async(req, res) => {

}

export const removeComment = async (req, res) => {

}



export const getPosts = async(req, res) => {
try{
  if(req.query.worldId){
    worldId = req.query.worldId
  }
  console.log('worldId fromm getResources ==================>>> -------->>> ',worldId)

  const world = await WorldsModel.findById(worldId)

  const posts = world.posts

    res.status(200).json(posts);
} catch (error) {
  console.log(error.message);

}
};


export const getAttachments = async(req, res) => {
  //req => postId, worldId
}


addWorld
uploadCourse
getResources
getWorlds
addWorld

export const rateWorld = async (req, res) => {
  //req => worldId rate, rateId
try{  if (req.body.worldId){
    worldId = req.body.worldId


  }
  console.log('req.body from rateWorld =========================================------------==:::>>>>>>> > > >>  ',req.body)
  const skiller = await SkillerModel.findById(skillerId).select('name picture')
  const world = await WorldsModel.findById(worldId).select('rates')
  const rates = world.rates
  const raterAlreadyExist = Boolean(rates.find(rt => rt.rater._id === skillerId))
  console.log('rater already exist from rateWorld =========-=-=-=-=-=-=-=-=>>>>>>>>>> > > >  > > > >',raterAlreadyExist)
  if(!raterAlreadyExist){
    await WorldsModel.findByIdAndUpdate(
      worldId, 
      {
        $push: {
          rates: {
            _id: req.body.rateId,
            rate: req.body.rate,
            //rater
            rater: {
              _id: skillerId,
              name: skiller.name,
              picture: skiller.picture,
            }
          }
        }
      },
      {
        new: true
      }
    )
  }
} catch (error) {
    console.log(error.message);

  }
}




export const ratePublisher = async (req, res) => {
  //req => worldId rate, rateId
try{  if (req.body.worldId){
    worldId = req.body.worldId


  }

  console.log('req.body from rateWorld =========================================------------==:::>>>>>>> > > >>  ',req.body)
  const skiller = await SkillerModel.findById(skillerId).select('name picture')
  const world = await WorldsModel.findById(worldId)
  const publisherId = world.publisherId
  const publisher = await SkillerModel.findById(publisherId)
  const rates = publisher.rates
  const raterAlreadyExist = Boolean(rates?.find(rt => rt.rater._id === skillerId))
  console.log('rater already exist from rateWorld =========-=-=-=-=-=-=-=-=>>>>>>>>>> > > >  > > > >',raterAlreadyExist)

    await SkillerModel.findByIdAndUpdate(
      publisherId, 
      {
        $push: {
          rates: {
            _id: req.body.rateId,
            rate:  req.body.rateP,
            //rater
            rater: {
              _id: skillerId,
              name: skiller.name,
              picture: skiller.picture,
            }
          }
        }
      },
      {
        new: true
      }
    )

    const averageRate =
    rates.length > 0
      ? rates.reduce((sum, rateObj) => sum + rateObj.rate, 0) / rates.length
      : 0;
    await SkillerModel.findByIdAndUpdate(
      publisherId, 
      {    
        $set: {
          rate: parseInt(averageRate)
        }
      },
      {    
        new: true
      }
    )
  }
  

      
 catch (error) {
    console.log(error.message);

  }
}
export const commentWorld = async (req,res) => {
  //req => worldId, comment , commentId
 try{
    const {worldId, skillerId} = req.body 
 
 
  console.log('req.body from commentWorld =================================--------------------:::::: >>> ', req.body)
  const skiller = await SkillerModel.findById(skillerId).select('name picture')
  await WorldsModel.findByIdAndUpdate(
    worldId,
    {
      $push: {
        comments: {
          _id: req.body.commentId,
          comment: req.body.comment,
          //commenter
          commenter: [{
            _id: skillerId,
            
            name: skiller.name,
            picture: skiller.picture,
          }],
  
        }
      }
    },
    {
      new: true
    }
  )
} catch (error) {
  console.log(error.message);

}
}        



export const commentPost = async (req,res) => {
  //req => worldId, comment , commentId
  try{
const {worldId, postId, skillerId} = req.body
  console.log('req.body from commentWorld =================================--------------------:::::: >>> ', req.body)
  const skiller = await SkillerModel.findById(skillerId).select('name picture')
  await WorldsModel.findByOneAndUpdate(
   {_id: worldId,

    "posts._id":postId
   },

    {
      $push: {
        "posts.$.comments": {
          _id: req.body.commentId,
          comment: req.body.comment,
          //commenter
          commenter: [{
            _id: skillerId,
            
            name: skiller.name,
            picture: skiller.picture,
          }],
  
        }
      }
    },
    {
      new: true
    }
  )
} catch (error) {
  console.log(error.message);

}
}     

getAllWorlds
addWorld
getAllWorlds

getSkillerProfileData
getSkillerProfilePicture
paidWorld
addLevel
setLevelCompleted
getLevels
uploadCourse
startExam
addLevel
setExamPassed
insertAdvisor

getLevels
sendGradeComment
chooseAdvisor
getLevels
sendGradeComment


export const getMates = async(req, res) => {
  //req => worldId
try{  if(req.query.worldId){
    worldId = req.query.worldId
    console.log('-=- =- =- = -= -= -=-==-=-=-=-=-=-=-= - =- =-  problem is with getMates if condition =-= - =- =- = -= -= - =- =-=-=-=-=-=-=-=-')
    console.log('req.query from getMates ========================----------------------->>>> ',req.query)
    console.log('req.query.worldId from getMates ==========================------------------>> > > > > ',req.query.worldId)
    console.log('worldId from getMates-----------------================------------------------> >  >>  ',worldId)
    const world = await WorldsModel.findById(worldId);
    const allStudents = world?.students
    console.log('allStudents from getMates ================================------------------------> > > > > > > ',allStudents)
    const thisStudent = allStudents?.find(s => s._id === skillerId)
    console.log('thisStudent from getMates-==========================================-=-=-=-=-=-=-=-=----------> > > > > > ',thisStudent)
    const levelId = thisStudent?.levelId
    console.log('levelId from levelId ===============---------------------->>>>> ',levelId)
    const mates = allStudents?.filter(s => s.levelId === levelId && s._id !== skillerId)
    console.log('mates from getMates==========-------------------->>>>',mates)
    res.status(200).json(mates)
  }}
  catch (error) {
    console.log(error.message);

  }
}

paidWorld
getMates


export const getCertification = async (req, res) => {
    try {
        const { certificationId } = req.query;

        if (!certificationId) {
            return res.status(400).json({ error: 'Certification ID is required' });
        }

        // Assuming `SkillerModel` is the Mongoose model with a `certifications` field
        const skiller = await SkillerModel.findOne({ 'certifications._id': certificationId });

        if (!skiller) {
            return res.status(404).json({ error: 'Skiller not found' });
        }

        const certification = skiller.certifications.find((cf) => cf._id.toString() === certificationId);

        if (!certification) {
            return res.status(404).json({ error: 'Certification not found' });
        }

        // Send the image as a binary response with the appropriate content type
        res.set('Content-Type', certification.contentType);
        return res.status(200).send(Buffer.from(certification.data.buffer, 'base64'));
    } catch (error) {
        console.error('Error fetching the certification:', error);
        return res.status(500).json({ error: 'An error occurred while fetching the certification' });
    }
};


getSkillerProfilePicture
export const myEarning = async(req, res) => {
try{  if(skillerId){
  const skiller  = await SkillerModel.findById(skillerId);
  res.status(200).json(skiller.totalCash  )
}} catch (error) {
  console.log(error.message);

}}

export const myRate = async(req, res) => {
try{  if(skillerId){
  const skiller  = await SkillerModel.findById(skillerId);
  res.status(200).json(skiller.rate)
}}

catch (error) {
  console.log(error.message);

}}


mySubscriptions
addWorld
paidWorld

export const addToCart = async(req, res) => {
  //req => worldId
try{ 
   const worldId = req.body.worldId;
 
  const skiller = await SkillerModel.findById(skillerId).select({
    myCart: {
      _id: 1
    }
  })
  const worldIsAlreadyInTheCart = Boolean(skiller.myCart.find(cr => cr._id === worldId))
  if(!worldIsAlreadyInTheCart)
  {await SkillerModel.findByIdAndUpdate(
    skillerId, 
    {
      $push: {
        myCart: {
          _id: worldId
        }
      }
      
    },
    {
      new: true
    }
  )}}
  catch (error) {
  

  }
  
}

export const getCart = async(req, res) => {
try{
  const skiller = await SkillerModel.findById(skillerId);
  res.status(200).json(skiller.myCart)}

  catch (error) {
    console.log(error.message);

  }
}

paidWorld
getAllWorlds
addWorld
addToCart

export const deleteWorldFromCart = async (req, res) => {

  const {worldId} = req.query; // The world ID to remove
  console.log('req.query from deleteWorldFromCart =================-----------------------====-------===> >  > > >>   ',req.query)
  console.log('worldId from deleteWorldFromCart =======---======================----========> >  > >>  >  ',worldId)
  try {
    const result = await SkillerModel.findOneAndUpdate(
      { _id: skillerId },
      { $pull: { myCart: { _id: worldId } } }, // Remove the worldId from myCart
      { new: true } // Optionally return the updated document
    );

    if (result) {
      res.status(200).json({ message: 'World removed from cart successfully', cart: result.myCart });
    } else {
      res.status(404).json({ message: 'Skiller not found or world not in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error removing world from cart', error: error.message });
  }
};
verify
verify
getAllWorlds


//make sure to manage add it when someone purchased his course ==> paid world
export const getMoneyInHistory = async(req, res) => {
  try
{  const skiller = await SkillerModel.findById(skillerId)
  const moneyInHistory = skiller.cash.filter(m => m.seller === true || m.advisor === true)
  res.status(200).json(moneyInHistory)}
  
  catch (error) {
    console.log(error.message);

  }
}

//make sure to add it when he purchased someone course ==> paidworld
export const getMoneyOutHistory = async(req, res) => {
  try
{  const skiller = await SkillerModel.findById(skillerId)
  const moneyOutHistory = skiller.cash.filter(m => m.buyer === true)
  res.status(200).json(moneyOutHistory)}
  catch (error) {
    console.log(error.message);

  }
}

//add it when he withdraw cash
export const getWithdrawMoneyHistory = async(req, res) => {
try
{  const skiller = await SkillerModel.findById(skillerId)
  res.status(200).json(skiller.withdrawHistory)}
  catch (error) {
    console.log(error.message);

  }
}

sendGradeComment   
sendPayment
paidWorld
sendPayment
export const getTotalCash = async(req, res) => {
  try
{  const skiller = await SkillerModel.findById(skillerId)
  res.status(200).json(skiller.totalCash)}

  catch (error) {
    console.log(error.message);

  }
}


getLevels

export const getWorld = async (req, res) => {
  try {
    const world = await WorldsModel.findById(req.query.worldId);

    if (!world) {
      return res.status(404).json({ message: 'World not found' });
    }

    // Create a plain object to modify and send
    const formattedWorld = {
      ...world.toObject(),
      worldThumbnail: world.worldThumbnail?.data && world.worldThumbnail.contentType
        ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
        : null,
    };

    res.status(200).json(formattedWorld);
  } catch (error) {
    console.error('Error fetching world:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const getLevel = async(req, res) => {
  try
{  const world = await WorldsModel.findById(req.query.worldId)
  const level = world.levels.find(l => l._id === req.query.levelId)
  res.status(200).json(level)}

  catch (error) {
    console.log(error.message);

  }
}

export const getLesson = async(req, res) => {
  try
{  const world = await WorldsModel.findById(req.query.worldId)
  const level = world.levels.find(l => l._id === req.query.levelId)
  const lesson = level.lessons.find(ls => ls._id === req.query.lessonId)
  res.status(200).json(lesson)}

  catch (error) {
    console.log(error.message);

  }
}

export const getMyWorlds = async (req, res) => {
  try {

    if (!skillerId) {
      return res.status(400).json({ message: "Skiller ID is required" });
    }

    const skiller = await SkillerModel.findById(skillerId)//Populate the worlds field

    if (!skiller) {
      return res.status(404).json({ message: "Skiller not found" });
    }

    // Filter the populated worlds where the user is the publisher
    const myWorlds = skiller.worlds.filter(world => world.publisher === true);

    // Format the worlds for the response
    const formattedWorlds = myWorlds.map(world => ({
      _id: world._id,
      worldName: world.worldName,
      price: world.price,
      published: world.published,
      draft: world.draft,
      numberOfStudents: world?.students?.length || 0,
      numberOfAdvisors: world?.advisors?.length || 0,
      worldDescription: world.worldDescription,
      dateOfPublish: world.dateOfPublish,
      isWorldAllowingAdvisors: world.isWorldAllowingAdvisors,
      worldThumbnail: world.worldThumbnail?.data && world.worldThumbnail.contentType
        ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
        : null,
    }));

    res.status(200).json(formattedWorlds);
  } catch (error) {
    console.error("Error fetching my worlds:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const getMyDrafts = async (req, res) => {
  try {

    if (!skillerId) {
      return res.status(400).json({ message: "Skiller ID is required" });
    }

    const skiller = await SkillerModel.findById(skillerId)//Populate the worlds field

    if (!skiller) {
      return res.status(404).json({ message: "Skiller not found" });
    }

    // Filter the populated worlds where the user is the publisher
    const myWorlds = skiller.worlds.filter(world => world.publisher === true && world.draft === true);

    // Format the worlds for the response
    const formattedWorlds = myWorlds.map(world => ({
      _id: world._id,
      worldName: world.worldName,
      price: world.price,
      published: world.published,
      draft: world.draft,
      numberOfStudents: world?.students?.length || 0,
      numberOfAdvisors: world?.advisors?.length || 0,
      worldDescription: world.worldDescription,
      dateOfPublish: world.dateOfPublish,
      isWorldAllowingAdvisors: world.isWorldAllowingAdvisors,
      worldThumbnail: world.worldThumbnail?.data && world.worldThumbnail.contentType
        ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
        : null,
    }));

    res.status(200).json(formattedWorlds);
  } catch (error) {
    console.error("Error fetching my worlds:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

addLevel

getProfile

export const updateName = async(req, res) => {
  const {firstName, surname} = req.query
  await SkillerModel.findByIdAndUpdate(
    skillerId,
    {

      name: firstName,
      surname: surname
    },
    {
      new: true
    }
  )
}




 
export const changeLevelTitle = async (req, res) => {
  try
{  const { worldId, levelId, levelTitle } = req.body;

console.log('req.body from changeLevelTitle ======================--------------------=-=-=-=-=-=-=-> > > > > > >  ',req.body)
  try {
    await SkillerModel.updateMany(
      {
        "worlds._id": worldId,
        "worlds.levels._id": levelId,
      },
      {
        $set: { "worlds.$[world].levels.$[level].levelTitle": levelTitle },
      },
      {
        arrayFilters: [
          { "world._id": worldId },
          { "level._id": levelId },
        ],
        new: true,
      }
    );

    const updatedWorld = await WorldsModel.findOneAndUpdate(
      { _id: worldId, "levels._id": levelId },
      {
        $set: { "levels.$.levelTitle": levelTitle },
      },
      {
        new: true,
      }
    );

    res.status(200).json({ message: "Level title updated successfully", updatedWorld });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }}catch(error){
    console.log(error.message)
  }
};

export const changeLevelDescription = async(req, res) => {
  console.log('req.body from changeLevelDescription ===============================-=-=-=-=-=-=-=-=-=-=-=-=- > > > > > > > >  ',req.body)
try
{  if(req.query.worldId){
    worldId = req.query.worldId
  }
  if(req.query.levelId){
    levelId = req.query.levelId
  }
  const levelDescription = req.query.levelDescription

  await SkillerModel.updateMany(
    {
      "worlds._id": worldId,
      "worlds.levels._id": levelId,

    },
    {
      $set: {
        "worlds.$[world].levels.$[level].levelDescription": levelDescription,
      },
    },
    {
      arrayFilters: [
        { "world._id": worldId },
        { "level._id": levelId },
      ],
      new: true,
    }
  );



  await WorldsModel.findOneAndUpdate(
    {
      _id: worldId,
      "levels._id": levelId
    },
    {
      "levels.levelDescription": levelDescription
    },
    {
      new: true
    }
  )}
  catch(error){
    console.log(error.message)
  }
}


export const changeWorldName = async(req, res) => {

  const {worldName, worldId} = req.body



  
  await SkillerModel.updateMany(
    {

      "worlds._id": worldId,

    },
    {
      $set: {
        "worlds.$.worldName": worldName,
      },
    },
    {
      new: true,
    }
  );

  await WorldsModel.findByIdAndUpdate(
    worldId,
    {
      $set: {
        worldName: worldName
      }
    },
    {
      new:true
    }
  )
}

export const changeWorldDescription = async(req, res) => {

const {worldId, worldDescription} = req.body

    
  await SkillerModel.updateMany(
    {

      "worlds._id": worldId,

    },
    {
      $set: {
        "worlds.$.worldDescription": worldDescription,
      },
    },
    {
      new: true,
    }
  );

  await WorldsModel.findByIdAndUpdate(
    worldId,
    {
      $set: {
        worldDescription: worldDescription
      }
    },
    {
      new:true
    }
  )
}

export const changeWorldThumbnail = async (req, res) => {
  try {
    const { worldId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract file details from the request
    const { buffer, mimetype } = req.file;


        
  await SkillerModel.updateMany(
    {

      "worlds._id": worldId,

    },
    {
      $set: {
        "worlds.$.worldThumbnail":  {
          data: buffer,
          contentType: mimetype,
        },
      },
    },
    {
      new: true,
    }
  );
    // Update the thumbnail in the database
    const updatedWorld = await WorldsModel.findByIdAndUpdate(
      worldId,
      {
        worldThumbnail: {
          data: buffer,
          contentType: mimetype,
        },
      },
      { new: true }
    );

    if (!updatedWorld) {
      return res.status(404).json({ message: 'World not found' });
    }

    res.status(200).json({ message: 'Thumbnail updated successfully', world: updatedWorld });
  } catch (error) {
    console.error('Error updating thumbnail:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const changeWorldPrice = async(req, res) => {
  try
{const {worldId, worldPrice} = req.body

    
  await SkillerModel.updateMany(
    {

      "worlds._id": worldId,

    },
    {
      $set: {
        "worlds.$.price": worldPrice,
      },
    },
    {
      new: true,
    }
  );

  await WorldsModel.findByIdAndUpdate(
    worldId,
    {
      $set: {
        price: worldPrice
      }
    },
    {
      new:true
    }
  )}catch(error){
    console.log(error.message)
  }
}

export const changeAllowAdvisor = async(req, res) => {
  try
{  const {worldId, allowAdvisors} = req.body
  await SkillerModel.updateMany(
    {

      "worlds._id": worldId,

    },
    {
      $set: {
        "worlds.$.isWorldAllowingAdvisors": allowAdvisors,
      },
    },
    {
      new: true,
    }
  );

  await WorldsModel.findByIdAndUpdate(
    worldId,
    {
      $set: {
        isWorldAllowingAdvisors: allowAdvisors
      }
    },
    {
      new:true
    }
  )}catch(error){
    console.log(error.message)
  }
}

getWorld
getAllWorlds

export const changeNameSurname = async(req, res) => {
  try
{  const {firstName, surnamee, skillerId} = req.body;
  await SkillerModel.findByIdAndUpdate(
    skillerId,
    {
      $set: {
        name: firstName,
        surname: surnamee
      }
    },
    {
      new: true
    }
  )}catch(error){
    console.log(error.message)
  }
}

export const checkPastPass = async(req, res) => {
  try
{  const {currentPassword, skillerId} = req.query
  const skiller = await SkillerModel.findById(skillerId)
  const compare = Boolean(await bcryptjs.compare(currentPassword, skiller.password))

  res.status(200).json(compare)}
  catch(error){
    console.log(error.message)
  }
}

export const updatePassword  = async(req, res) => {
  try
{  const {newPassword, skillerId} = req.body

  const salt = await bcryptjs.genSalt(10);
  const hashedPwd = await bcryptjs.hash(newPassword, salt)
  await SkillerModel.findByIdAndUpdate(
    skillerId, 
    {
      $set: {
        password: hashedPwd
      }
    },
    {
      new: true
    }
  )}catch(error){
    console.log(error.message)
  }
}


export const uploadDefiningVideo = async(req, res) => {

 
  try
{  
  const videoURL = req.body.videoURL
  const skillerId = req.body.skillerId
  await SkillerModel.findByIdAndUpdate(
    skillerId,
    {
      $set: {
        definingVideo: videoURL
      }
    },
    {
      new: true
    }
  )

res.status(200).json('uploaded successfully')
} catch(error){
 
  }
}

export const deleteDefiningVideo = async(req, res) => {

 
  try
{  
  const skillerId = req.query.skillerId
  await SkillerModel.findByIdAndUpdate(
    skillerId,
    {
      $set: {
        definingVideo: null
      }
    },
    {
      new: true
    }

  )
  res.status(200).message('video deleted successfully')
} catch(error){
 
  }
}



export const getRelativePeople = async(req, res) => {

  const skiller = await SkillerModel.findById(skillerId)
  const skCategories = skiller.categories

  const skillers = await SkillerModel.find

}



export const WLgetPosts =async(req, res) => {
  //req => worldId
  
    if(req.query.worldId){
      worldId = req.query.worldId
    }
    if(req.query.levelId){ 
      levelId = req.query.levelId
    }
  
  const posts = await PostsModel.find(ps => ps.worldId === worldId && ps.levelId === levelId)
  res.status(200).json(posts)
}

getProfile
getMates

getLevels

myEarning

setLevelCompleted

rateWorld
commentWorld

startExam

getMates


getMessages1




getAllWorlds
getWorld

export const AGetMates = async (req, res) => {
  try {

    // Fetch the skiller by ID
    const skiller = await SkillerModel.findById(skillerId).select('worlds mates');

    if (!skiller) {
      return res.status(404).json({ message: 'Skiller not found' });
    }

    const skillerWorlds = skiller.worlds; // Skiller's worlds
    const worldIds = skillerWorlds.map((world) => world._id); // Extract world IDs

    // Find other skillers who share at least one world
    // const allSkillers = await SkillerModel.find().select('worlds mates');
const allSkillers = await SkillerModel.find().select({
  'name': 1,
  'surname' : 1,
  'worlds._id': 1, // Only fetch `_id` from `worlds`
  'worlds.worldName': 1, // Fetch `worldName` if needed
  'worlds.worldThumbnail.data': 1, // Fetch `worldThumbnail.data`
  'worlds.worldThumbnail.contentType': 1, // Fetch `worldThumbnail.contentType`
  'mates._id': 1, // Only fetch `_id` from `mates`
});

const filteredSkillers = allSkillers.filter((otherSkiller) => 
  otherSkiller._id.toString() !== skillerId.toString() && // Exclude the current skiller
  otherSkiller.worlds.some((world) => worldIds.includes(world._id.toString())) && // Check for shared worlds
  !otherSkiller.mates.some((mate) => mate._id.toString() === skillerId.toString()) // Ensure `mates` doesn't include `skillerId`
);

// Format the filtered skillers' data
const formattedSkillers = filteredSkillers.map((filteredSkiller) => ({
  _id: filteredSkiller._id,
  name: filteredSkiller.name,
  surname: filteredSkiller.surname,
  picture: filteredSkiller.picture?.picture?.data
    ? `data:${filteredSkiller.picture.contentType};base64,${filteredSkiller.picture.picture.data.toString('base64')}`
    : null, // Fallback to default profile picture
  rate: filteredSkiller.rate || 0, // Default to 0 if rate is not available
  totalCash: filteredSkiller.totalCash || 0, // Default to 0 if no totalCash
  sharedWorlds: filteredSkiller.worlds
    .filter((world) => worldIds.includes(world._id.toString())) // Only include shared worlds
    .map((world) => ({
      _id: world._id,
      name: world.worldName,
      thumbnail: world.worldThumbnail?.data
        ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
        : null, // Fallback to default thumbnail
    })),
}));

    console.log('formattedSkillers from getMates =================================-=-=-=-=-=-=-=-=-=-=> > > > >  > > > ',formattedSkillers)
    // Send the formatted data to the frontend
    res.status(200).json(formattedSkillers);
  } catch (error) {
    console.error('Error fetching mates:', error);
    res.status(500).json({ message: 'Error fetching mates' });
  }
};

export const getAllSkillers = async(req, res) => {
  try
 {
 const skipNum = req.query.skipNum;
 
    // Fetch the skiller by ID
 
    // Find other skillers who share at least one world
    // const allSkillers = await SkillerModel.find().select('worlds mates');
   
 const allSkillersss = await SkillerModel.find().select( {
  name:1, 
  surname: 1,
  picture: 1,
  rate: 1,
  totalCash: 1,
  mates: {
    mateId: 1
  }
 }).skip(skipNum).limit(6);

 
// Format the filtered skillers' data
  const formattedSkillers = allSkillersss?.map((filteredSkiller) => ({
  _id: filteredSkiller?._id,
  name: filteredSkiller?.name,
  surname:  filteredSkiller?.surname,           
  picture: filteredSkiller?.picture,
  rate: filteredSkiller?.rate || 0,
  totalCash: filteredSkiller?.totalCash || 0,
 mates: filteredSkiller.mates
}));
 
    res.status(200).json(formattedSkillers);
 }catch(error){

 }
}


export const LgetAllSkillers = async(req, res) => {
  try
 {
  const skipNum = req.query.skipNum || 0;
 
     // Fetch the skiller by ID
  
     // Find other skillers who share at least one world
     // const allSkillers = await SkillerModel.find().select('worlds mates');
     
     const studentsIds = await WorldsModel.findById(worldId).select({
      students: {
        _id: 1
      }
     })

     
     const allSkillersss = await Promise.all(
      studentsIds.map((studentId) => SkillerModel.findById(studentId).select(      {
        name:1, 
        surname: 1,
        picture: 1,
        rate: 1,
        totalCash: 1,
        mates: {
          mateId: 1
        }}).skip(skipNum).limit(6))
      
    )

 
 
  
 // Format the filtered skillers' data
   const formattedSkillers = allSkillersss?.map((filteredSkiller) => ({
   _id: filteredSkiller?._id,
   name: filteredSkiller?.name,
   surname:  filteredSkiller?.surname,           
   picture: filteredSkiller?.picture,
   rate: filteredSkiller?.rate || 0,
   totalCash: filteredSkiller?.totalCash || 0,
  mates: filteredSkiller.mates
 }));
 
 console.log('formattedSkillers =============================================-=-=-=-=-=-=-=-=-=-=----=-=-=-> > > >  > > >   ',formattedSkillers)
     res.status(200).json(formattedSkillers);
  } catch(error) {

  }
 }
 


export const WGetMates = async (req, res) => {
  try {

    // Fetch the skiller by ID
    const skiller = await SkillerModel.findById(skillerId);

    if (!skiller) {
      return res.status(404).json({ message: 'Skiller not found' });
    }

    const skillerWorlds = skiller.worlds; // Skiller's worlds
    const worldIds = skillerWorlds.map((world) => world._id); // Extract world IDs

    // Find other skillers who share at least one world
    const allSkillers = await SkillerModel.find();

    const filteredSkillers = allSkillers.filter((otherSkiller) => 
      otherSkiller._id !== skillerId && // Exclude the current skiller
      otherSkiller.worlds.some((world) => worldIds.includes(world._id)) // Check for shared worlds
    );

    // Format the filtered skillers' data
    const formattedSkillers = filteredSkillers.map((filteredSkiller) => ({
      _id: filteredSkiller._id,
      name: filteredSkiller.name,
      surname: filteredSkiller.surname,
      picture: filteredSkiller.picture?.picture?.data
        ? `data:${filteredSkiller.picture.contentType};base64,${filteredSkiller.picture.picture.data.toString('base64')}`
        : null, // Fallback to default profile picture
      rate: filteredSkiller.rate || 0, // Default to 0 if rate is not available
      totalCash: filteredSkiller.totalCash || 0, // Default to 0 if no totalCash
      sharedWorlds: filteredSkiller.worlds
        .filter((world) => worldIds.includes(world._id)) // Only include shared worlds
        .map((world) => ({
          _id: world._id,
          name: world.worldName,
          thumbnail: world.worldThumbnail?.data
            ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
            : null, // Fallback to default thumbnail
        })),
    }));

    // Send the formatted data to the frontend
    res.status(200).json(formattedSkillers);
  } catch (error) {
    console.error('Error fetching mates:', error);
    res.status(500).json({ message: 'Error fetching mates' });
  }
};



export const LGetMates = async (req, res) => {
  if(req.query.worldId){
    worldId = req.query.worldId
  }
  if(req.query.levelId){
    levelId = req.query.levelId
  }
  try {

    // Fetch the skiller by ID
    const skiller = await SkillerModel.findById(skillerId);

    if (!skiller) {
      return res.status(404).json({ message: 'Skiller not found' });
    }

    const skillerWorlds = skiller.worlds; // Skiller's worlds
    const worldIds = skillerWorlds.map((world) => world._id); // Extract world IDs

    // Find other skillers who share at least one world
    const allSkillers = await SkillerModel.find();

    let filteredSkillers = allSkillers.filter((otherSkiller) => 
      otherSkiller._id !== skillerId && // Exclude the current skiller
      otherSkiller.worlds.filter((world) => world._id === worldId) // Check for shared worlds
    );



    // Format the filtered skillers' data
    const formattedSkillers = filteredSkillers.map((filteredSkiller) => ({
      _id: filteredSkiller._id,
      name: filteredSkiller.name,
      surname: filteredSkiller.surname,
      picture: filteredSkiller.picture?.picture?.data
        ? `data:${filteredSkiller.picture.contentType};base64,${filteredSkiller.picture.picture.data.toString('base64')}`
        : null, // Fallback to default profile picture
      rate: filteredSkiller.rate || 0, // Default to 0 if rate is not available
      totalCash: filteredSkiller.totalCash || 0, // Default to 0 if no totalCash
      sharedWorlds: filteredSkiller.worlds
        .filter((world) => worldIds.includes(world._id)) // Only include shared worlds
        .map((world) => ({
          _id: world._id,
          name: world.worldName,
          thumbnail: world.worldThumbnail?.data
            ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
            : null, // Fallback to default thumbnail
        })),
    }));

    // Send the formatted data to the frontend
    res.status(200).json(formattedSkillers);
  } catch (error) {
    console.error('Error fetching mates:', error);
    res.status(500).json({ message: 'Error fetching mates' });
  }
};


getProfile

paidWorld

//send ==> add mate
export const sendMateRequest = async(req, res) => {
  try
{ 
   const {skillerId, mateId, mateRequestId, notificationId} = req.body;
const skiller = await SkillerModel.findById(skillerId).select('name')
const mate =await SkillerModel.findById(mateId).select({
  _id: 1,
  FcmToken: 1,
  name: 1,

  mates: {
    mateId : 1,
 
   
  }
})
const mateAlreadyRquests = mate.mates
const AlreadySentRequest = Boolean (mateAlreadyRquests.find(mt => mt.mateId === skillerId))

  //req => mateRequestId, mateId
  if(!AlreadySentRequest) {
    await SkillerModel.findByIdAndUpdate(
      skillerId, 
      {                
        $push: {
          mates: {
            _id: mateRequestId,
            pending: true,
            accepted: false,
            sender: true,
            receiver: false,
            mateId: mateId
          }
        }
      },
      {
        new: true
      }
    )
  
  
    
    await SkillerModel.findByIdAndUpdate(
      mateId, 
      {                
        $push: {
          mates: {
            _id: mateRequestId,
            pending: true,
            accepted: false,
            sender: false,
            receiver: true,
            mateId: skillerId
          }
        },
  
      },
      {
        new: true
      }
    );
    


      
    
    await SkillerModel.findByIdAndUpdate(
      mateId, 
      {                
 
        $push: {
          notificationsss: {
            _id: notificationId,

            readed: false,
            typeee:    'mateRequest',     
            title: `You got a mate request from ${skiller.name}`,
            content: `${skiller.name} sent you a mate request and waits for your response.`
          }
        }
      },
   { new: true, upsert: true } // Ensure new document is returned and create if not found
    );
 if(mate.FcmToken)
{
    const title = `You got a mate request from ${skiller.name}`;
    const content = `${skiller.name} sent you a mate request and wait for your respond.`;
    const FcmToken = mate.FcmToken;
    await sendNotification(FcmToken, title, content);}
  }
} catch(error){
 
  }

}
//get ==> for requests 
export const getMateRequests = async (req, res) => {
try
{    const skiller = await SkillerModel.findById(skillerId).select('worlds mates'); // Use req.params or req.body as per your route definition
    const skillerWorlds = skiller.worlds
    const worldIds = skillerWorlds.map((world) => world._id)
    if (!skiller) {
      return res.status(404).json({ message: 'Skiller not found' });
    }

    // Filter mates with pending status
    const mates = skiller.mates
    console.log('mates ====================================--=-=-----------------------==============================================================================================================-=--------=-=-=--::::::::::::::::::::::::::::::::::::::::::::::>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> > > > -=-=-=> >  > > > > >  ',mates)
    const pendings = mates.filter((mt) => mt.pending === true);

    console.log('pendings from getMateRequests ========================================-=-=-=-=-=-=-=-=-=-=-> > > > > > > > >  ',pendings)
    // Fetch pending mates details in parallel using Promise.all
    const pendingMates = await Promise.all(
      pendings.map((pending) => SkillerModel.findById(pending.mateId))
      
    );
    pendings.map((pending) => console.log('pending.mateId ===============-=-=-=-=-=-=-=-=-=-=-=-=-> > > >  > > > >  ',pending.mateId))

    const formattedSkillers = pendingMates.map((filteredSkiller) => ({
      _id: filteredSkiller._id,
      name: filteredSkiller.name,
      surname: filteredSkiller.surname,
      picture: filteredSkiller.picture?.picture?.data
        ? `data:${filteredSkiller.picture.contentType};base64,${filteredSkiller.picture.picture.data.toString('base64')}`
        : '', // Fallback to default profile picture
      rate: filteredSkiller.rate || 0, // Default to 0 if rate is not available
      totalCash: filteredSkiller.totalCash || 0, // Default to 0 if no totalCash
      sharedWorlds: filteredSkiller.worlds
        .filter((world) => worldIds.includes(world._id)) // Only include shared worlds
        .map((world) => ({
          _id: world._id,
          name: world.worldName,
          thumbnail: world.worldThumbnail?.data
            ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
            : '/images/default-world-thumbnail.jpg', // Fallback to default thumbnail
        })),
    }));
    // Return the pending mates to the front end
 
    res.status(200).json(formattedSkillers);

}
    catch(error){
      console.log(error.message)
    }
  
};




export const getMateRequestss = async (req, res) => {
   const skipNum = req.query.skipNum || 0;
   const skillerId = req.query.skillerId;
  try
  {    const skiller = await SkillerModel.findById(skillerId).select({
    mates: {
      _id: 1,
      pending:1,
      mateId: 1
    }
  }); // Use req.params or req.body as per your route definition
  
 
      // Filter mates with pending status
      const mates = skiller.mates
      
      console.log('mates ====================================--=-=-----------------------==============================================================================================================-=--------=-=-=--::::::::::::::::::::::::::::::::::::::::::::::>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> > > > -=-=-=> >  > > > > >  ',mates)
      const pendings = mates.filter((mt) => mt.pending === true && !mt.refused);
  
      console.log('pendings from getMateRequests ========================================-=-=-=-=-=-=-=-=-=-=-> > > > > > > > >  ',pendings)
      // Fetch pending mates details in parallel using Promise.all
      const pendingMates = await Promise.all(
        pendings.map((pending) => SkillerModel.findById(pending.mateId).select(      {
          name:1, 
          surname: 1,
          picture: 1,
          rate: 1,
          totalCash: 1,
          mates: {
            mateId: 1
  }}).skip(skipNum).limit(6))
        
      )
 



     
    
     
    // Format the filtered skillers' data
      const formattedSkillers = pendingMates?.map((filteredSkiller) => ({
      _id: filteredSkiller?._id,
      name: filteredSkiller?.name,
      surname:  filteredSkiller?.surname,           
      picture: filteredSkiller?.picture,
      rate: filteredSkiller?.rate || 0,
      totalCash: filteredSkiller?.totalCash || 0,
     mates: filteredSkiller.mates
    }));
    
 
 

    console.log('formattedSkillers from ########################### getMatesRequestss #####################33 ==================================================-=-=-=-=-> > >  > >  ',formattedSkillers)
      // Return the pending mates to the front end
   
      res.status(200).json(formattedSkillers);
  
  }
      catch(error){
        console.log(error.message)
      }
    
  };

//accept
export const acceptMateRequest = async(req, res) => {

 const {mateId, skillerId} = req.body
 console.log('mateRequestId coming from front ========================-=-=-=-=-> > > > > >  ',mateId)
  const skiller = await SkillerModel.findById(skillerId).select({
    mates: {
      _id: 1, 
      mateId: 1,

    }
  })
  const mates = skiller.mates
  const mate = mates.find(mt => mt.mateId === mateId)
  console.log('certain mate order ====-==--=-=-=-=-=-=-= > > > > > >',mate)


  await SkillerModel.findOneAndUpdate(
    {
      _id: skillerId,
      "mates.mateId": mateId
    },
    {
      $set: {
       "mates.$.accepted": true 
      }
    },
    {
      new: true
    }

  )


  await SkillerModel.findOneAndUpdate(
    {
      _id: mateId,
      "mates.mateId": skillerId
    },
    {
      $set: {
       "mates.$.accepted": true 
      }
    },
    {
      new: true
    }

  )
}



//refuse
export const refuseMate = async(req, res) => {

  const {mateId, skillerId} = req.body
  console.log('mateRequestId coming from front ========================-=-=-=-=-> > > > > >  ',mateId)
   const skiller = await SkillerModel.findById(skillerId).select({
    mates: {
      _id: 1, 
      mateId: 1,

    }
  })
   const mates = skiller.mates
   const mate = mates.find(mt => mt.mateId === mateId)
   console.log('certain mate order ====-==--=-=-=-=-=-=-= > > > > > >',mate)
 
 
   await SkillerModel.findOneAndUpdate(
     {
       _id: skillerId,
       "mates.mateId": mateId
     },
     {
       $set: {
        "mates.$.refused": true 
       }
     },
     {
       new: true
     }
 
   )
 
 
   await SkillerModel.findOneAndUpdate(
     {
       _id: mateId,
       "mates.mateId": skillerId
     },
     {
       $set: {
        "mates.$.refused": true 
       }
     },
     {
       new: true
     }
 
   )
 }
 

//cancel
export const cancelMateRequest = async(req, res) => {
  await SkillerModel.findByIdAndUpdate(

  )   


  await SkillerModel.findByIdAndUpdate(
    
  )
}


//get mates ==> for current
export const getAcceptedMates = async(req, res) => {
  const skillerId = req.query.id
try{

  const skiller = await SkillerModel.findById(skillerId).select({
    worlds : {
      worldName: 1,
      worldThumbnail : 1
    },
    mates: {
      accepted:1,

    }
  }); // Use req.params or req.body as per your route definition
  const skillerWorlds = skiller.worlds
  const worldIds = skillerWorlds.map((world) => world._id)
  const acceptedMates = skiller.mates.filter(mt => mt.accepted === true)
  console.log('acceptedMates from getAcceptedMates ===============================------------------------------------->>>>>>> > > > >  ',acceptedMates)
  const currentMates = await Promise.all(
    acceptedMates.map((acceptedMate) => SkillerModel.findById(acceptedMate.mateId).select({
      name: 1,
      surname: 1,
      picture:1, // Fallback to default profile picture
      rate: 1, // Default to 0 if rate is not available
      totalCash: 1, // Default to 0 if no totalCash
      sharedWorlds: {
        // Only include shared worlds
          worldName: 1,
          worldThumbnail : 1}
})));

  console.log('currentMates from getAcceptedMates ================================================================================================--=-=-=-=-=-> > > > > > >> > >  ',currentMates)

  const formattedSkillers = currentMates.map((filteredSkiller) => ({
    _id: filteredSkiller._id,
    name: filteredSkiller.name,
    surname: filteredSkiller.surname,
    picture: filteredSkiller.picture?.picture?.data
      ? `data:${filteredSkiller.picture.contentType};base64,${filteredSkiller.picture.picture.data.toString('base64')}`
      : null, // Fallback to default profile picture
    rate: filteredSkiller.rate || 0, // Default to 0 if rate is not available
    totalCash: filteredSkiller.totalCash || 0, // Default to 0 if no totalCash
    sharedWorlds: filteredSkiller.worlds
      .filter((world) => worldIds.includes(world._id)) // Only include shared worlds
      .map((world) => ({
        _id: world._id,
        name: world.worldName,
        thumbnail: world.worldThumbnail?.data
          ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
          : null, // Fallback to default thumbnail
      })),
  }));
  // Return the pending mates to the front end
  res.status(200).json(formattedSkillers);}
catch(error){
  console.log(error.message)
}

}
  


export const getAcceptedMatess = async(req, res) => {
  const skillerId = req.query.skillerId
  const skipNum = req.query.skipNum || 0;
try{

  const skiller = await SkillerModel.findById(skillerId).select({
   
    mates: {
      accepted:1,
      mateId: 1

    }
  }); // Use req.params or req.body as per your route definition
 
 
  const acceptedMates = skiller.mates.filter(mt => mt.accepted === true)
  console.log('acceptedMates from getAcceptedMates ===============================------------------------------------->>>>>>> > > > >  ',acceptedMates)
  const currentMates = await Promise.all(
    acceptedMates.map((acceptedMate) => SkillerModel.findById(acceptedMate.mateId).select(      {
      name:1, 
      surname: 1,
      picture: 1,
      rate: 1,
      totalCash: 1,
      mates: {
        mateId: 1
}}).skip(skipNum).limit(6)));

  // Format the filtered skillers' data
  const formattedSkillers = currentMates?.map((filteredSkiller) => ({
    _id: filteredSkiller?._id,
    name: filteredSkiller?.name,
    surname:  filteredSkiller?.surname,           
    picture: filteredSkiller?.picture,
    rate: filteredSkiller?.rate || 0,
    totalCash: filteredSkiller?.totalCash || 0,
   mates: filteredSkiller.mates
  }));
  // Return the pending mates to the front end
  res.status(200).json(formattedSkillers);}
catch(error){
  console.log(error.message)
}

}




export const getAcceptedMatessLength = async(req, res) => {
  const skillerId = req.query.skillerId
  const skipNum = req.query.skipNum || 0;
try{

  const skiller = await SkillerModel.findById(skillerId).select({
   
    mates: {
      accepted:1,
      mateId: 1

    }
  }); // Use req.params or req.body as per your route definition
 
 
 
 
  // Return the pending mates to the front end
  res.status(200).json(skiller.mates);}
catch(error){
  console.log(error.message)
}

}

export const getMyAdvisors = async(req, res) => {
  try
{  const skiller = await SkillerModel.findById(skillerId); // Use req.params or req.body as per your route definition
  const skillerAdvisors = skiller.myAdvisors
  const myAdvisorsIds = skillerAdvisors?.map((ad) => ad._id)

 
  const myAdvisors = await Promise.all(
    myAdvisorsIds.map((advisorId) => SkillerModel.findById(advisorId))
  );
  res.status(200).json(myAdvisors)}
  catch(error){
    console.log(error.message)
  }
}

export const getMyNDStudents = async(req, res) => {
  try
{  const skiller = await SkillerModel.findById(skillerId); // Use req.params or req.body as per your route definition
  const skillerStudents = skiller.myStudents
  const myStudentsIds = skillerStudents.map((ad) => ad._id)

 
  const myStudents = await Promise.all(
    myStudentsIds.map((studentId) => SkillerModel.findById(studentId))
  );
  res.status(200).json(myStudents)}
  catch(error){
    console.log(error.message)
  }
}

export const getMyDStudents = async (req, res) => {
  try {
    let worldsIds
    const { skillerId } = req.params; // Assuming skillerId is passed in the route
    const skiller = await SkillerModel.findById(skillerId);

    if (!skiller) {
      return res.status(404).json({ message: "Skiller not found" });
    }

    // Fetch all world IDs associated with the skiller
     worldsIds = skiller.worlds.map((w) => w._id);
    worldsIds = worldsIds.filter(w => w.publisher)

    // Fetch all worlds associated with the skiller
    const worlds = await WorldsModel.find({ _id: { $in: worldsIds } });

    // Initialize an array to store direct student data
    let myDirectStudents = [];

    // Map through each world to collect students
    for (const world of worlds) {
      // Get all student IDs from the world
      const worldStudentsIds = world.students.map((student) => student._id);

      // Fetch student details from SkillerModel
      const worldStudents = await SkillerModel.find({
        _id: { $in: worldStudentsIds },
      });

      // Append the students to the myDirectStudents array
      myDirectStudents = [...myDirectStudents, ...worldStudents];
    }

    // Send the collected students to the frontend
    res.status(200).json(myDirectStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};



  uploadCourse

  export const uploadRealWorldResults = async (req, res) => {
    try {
      const {_id, title, thumbnail, elements } = req.body;
      console.log('req.body from upload real world results ==============================-=--=-==-=--> > > > >',req.body)

  
      const formattedElements = elements.map((el, index) => ({
        type: el.type,
        content: el.content,
        order: index + 1,
      }));
      const photos = elements
      .filter((el) => el.type === "photo")
      .map((el, index) => ({
        contentUrl: el.content,
        order: index + 1,
      }));
    
    const videos = elements
      .filter((el) => el.type === "video")
      .map((el, index) => ({
        contentUrl: el.content,
        order: index + 1,
      }));
    
    const texts = elements
      .filter((el) => el.type === "text")
      .map((el, index) => ({
        text: el.content,
        order: index + 1,
      }));
    
    const pdfs = elements
      .filter((el) => el.type === "pdf")
      .map((el, index) => ({
        contentUrl: el.content,
        order: index + 1,
      }));
    
    const quizs = elements
      .filter((el) => el.type === "quiz")
      .map((el, index) => ({
        question: el.content.question,
        choices: el.content.choices,
        correctAnswer: el.content.correctAnswer,
        order: index + 1,
      }));
    
    const result = {
      _id,
      title,
      thumbnail,
      photos,
      videos,
      texts,
      pdfs,
      quizs,
    };
    
  
      // Update user's real world results in the database
      await SkillerModel.findByIdAndUpdate(
        skillerId,
        {
          $push: { realWorldResults: result },
        },
        { new: true }
      );
  
      res.status(201).json({ message: 'Real World Results uploaded successfully', result });
    } catch (error) {
      console.error('Error uploading Real World Results:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };








 

export const updateProfilePicture = async(req, res) => {
  //picture


  try {
    
    const file = req.file;
    const skillerId = req.body.skillerId
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const updatedUser = await SkillerModel.findByIdAndUpdate(
      skillerId,
      {
        $set:
{        picture: {
          name: file.originalname,
          picture: {
            data: file.buffer,
            contentType: file.mimetype,
          },
        }},
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Cover photo uploaded successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}


export const updateCoverPicture = async(req, res) => {
  //picture
 

  try {
    const file = req.file;
    const skillerId = req.body.skillerId
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const updatedUser = await SkillerModel.findByIdAndUpdate(
      skillerId,
      {
        $set:
{        coverPicture: {
          name: file.originalname,
          picture: {
            data: file.buffer,
            contentType: file.mimetype,
          },
        }},
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Cover photo uploaded successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}


export const deleteProfilePicture = async(req, res) => {
  try
{ 
  const skillerId = req.query.skillerId;
  await SkillerModel.findByIdAndUpdate(
    skillerId,
    {
      picture: null
    },
    {
      new: true
    }
  )

  res.status(200).json({ message: "Cover photo uploaded successfully", updatedUser });
}

  catch(error){
    console.error(error);
    res.status(500).json({ error: "Server error" });
  
  }
}


export const deleteCoverPicture = async(req, res) => {
  try
{  
  const skillerId = req.query.skillerId
  await SkillerModel.findByIdAndUpdate(
    skillerId,
    {
      coverPicture: null
    },
    {
      new: true
    }
  )

  res.status(200).json({ message: "Cover photo uploaded successfully", updatedUser });
}

  catch(error){
  
    res.status(500).json({ error: "Server error" });
  
  }
}
updateProfilePicture

checkPastPass

getProfile
export const getRealWorldResult = async (req, res) => {   
  try {
    const { achievementId } = req.query;

    // Find the achievement based on its ID
    const skiller = await SkillerModel.findOne(
      { "realWorldResults._id": achievementId },
      { "realWorldResults.$": 1 } // Fetch only the matched achievement
    );

    if (!skiller || skiller.realWorldResults.length === 0) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    const achievement = skiller.realWorldResults[0];

    res.status(200).json({
      _id: achievement._id,
      title: achievement.title,
      thumbnail: achievement.thumbnail,
      photos: achievement.photos,
      videos: achievement.videos,
      pdfs: achievement.pdfs,
      texts: achievement.texts, // Optional: Include if required
      quizs: achievement.quizs, // Optional: Include if required
    });
  } catch (error) {
    console.error('Error fetching achievement:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
insertLetter

addLevel

deleteLetter

addLevel

  

export const getPost = async(req, res)=> {

}



export const WuploadPost = async (req, res) => {
 
console.log('**********************######################***************##############   req.body from uploadPost********************##############################***********######## =============================-=-=-=-=-=-=-=-=-==-=-=-=-> > >  > > > >     ',req.body)

  try {

    const {
      _id,
      skillerId,
      worldId,
      postTitle,
      postDescription,
      postThumbnail,
      resources = [],
    } = req.body;

    const skiller = await SkillerModel.findById(skillerId).select('name rate picture');
    console.log('skiller from WuploadPost ############### ********************** ****  =====================-=-=-=-=-=-=-> > > > > >> >   ',skiller)
    const photos = [];
    const videos = [];
    const texts = [];
    const pdfs = [];
    const quizs = [];

    resources.forEach((res, index) => {
      const order = index + 1;
      if (res.type === "photo") photos.push({ contentUrl: res.content, order });
      else if (res.type === "video") videos.push({ contentUrl: res.content, order });
      else if (res.type === "pdf") pdfs.push({ contentUrl: res.content, order });
      else if (res.type === "text") texts.push({ text: res.content, order });
      else if (res.type === "quiz") {
        quizs.push({
          question: res.content,
          choices: res.choices || [],
          correctAnswer: res.correctAnswer || "",
          order,
        });
      }
    });

 

  

    const updatedWorld = await WorldsModel.findByIdAndUpdate(
      worldId,
      {
        $push: {
          posts: {
            _id,
            worldId: worldId,
            title: postTitle,
            description: postDescription,
            thumbnail: postThumbnail,
            poster: {
              _id: skillerId,
              rate: skiller?.rate,
              name: skiller?.name,
              picture: skiller?.picture
          
          },
            photos,
            videos,
            pdfs,
            texts,
            quizs,
          },
        },
      },
      { new: true }
    );

     
    res.status(200).json({ message: "Post uploaded successfully", updatedWorld });
  } catch (error) {
    console.error("Error in WuploadPost:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};





export const WaddPost = async (req, res) => {
 
  const   worldId = req.body.worldId
  const skillerId = req.body.skillerId
  console.log('req.body from WaddPost =============================================-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=---------== > > > > > > > >  ',req.body)
  try {
    const { _id, title, thumbnail, attachments } = req.body;



    await WorldsModel.findByIdAndUpdate(
      worldId,
      {
        $push: {
          posts:{
            _id: _id
          }
        }
      },
      {
        new:true
      }
    )



    await SkillerModel.findByIdAndUpdate(
      skillerId,
      {
        $push: {
          myPosts:{
            _id: _id
          }
        }
      },
      {
        new:true
      }
    )

    res.status(201).json({ message: 'Post added successfully', post: newPost });
  } catch (error) {
    console.error('Error adding post:', error);
    res.status(500).json({ message: 'Error adding post', error });
  }
};

export const WgetPosts =async(req, res) => {
  //req => worldId

  const worldId = req.query.worldId
  const skillerId = req.query.skillerId


  try
{     


    const world = await WorldsModel.findOne({ _id: worldId }).select('posts');

    const posts  = world.posts
    const filteredPosts = posts.filter((ps) => ps.poster._id === skillerId)
    console.log('filtered posts ================>> >> >  > >>  > >> > >  > >  ',filteredPosts)

    res.status(200).json(filteredPosts);
}
  catch(error){
    console.log(error.message)
  }

}


export const getCertainPost = async(req, res) => {
  //postId, worldId
  try
{  console.log('req.query from getCertainPost ==============-=-=-=-=-==========-=-> > > >  >',req.query)
  if(req.query.worldId){
    worldId = req.query.worldId
  }
  if(req.query.postId){
    postId = req.query.postId
  }
  const world = await WorldsModel.findById(worldId)

  const post = world.posts.find((ps) => ps._id === postId)
  console.log('post from getCertainPost ========================-=-=-=-=-=-=-=-=-=> > > > >  >>  ',post)
  res.status(200).json(post)}catch(error){
    console.log(error.message)
  }


}


export const WeditPost = async (req, res) => {
  try {
    const { postTitle, postDescription, postThumbnail, resources } = req.body;
    console.log(
      'req.body from WeditPost==========================-=-=-=-=-=---------=-=-=-=-=->  > >>  > > > >>   ',
      req.body
    );

    if (req.body._id) {
      postId = req.body._id;
    }
    if (req.body.worldId) {
      worldId = req.body.worldId;
    }
    if (!worldId || !postId) {
      return res.status(400).json({ message: "worldId and postId are required." });
    }

    // Define the updates to push new resources into existing arrays
    const pushFields = {
      "posts.$.photos": {
        $each: resources.filter((r) => r.type === "photo").map((r) => ({ contentUrl: r.content })),
      },
      "posts.$.videos": {
        $each: resources.filter((r) => r.type === "video").map((r) => ({ contentUrl: r.content })),
      },
      "posts.$.pdfs": {
        $each: resources.filter((r) => r.type === "pdf").map((r) => ({ contentUrl: r.content })),
      },
      "posts.$.texts": {
        $each: resources.filter((r) => r.type === "text").map((r) => ({ text: r.content })),
      },
      "posts.$.quizs": {
        $each: resources.filter((r) => r.type === "quiz").map((r) => ({
          question: r.content,
          choices: r.choices,
          correctAnswer: r.correctAnswer,
        })),
      },
    };

    // Include title, description, and thumbnail update
    const updateFields = {
      "posts.$.title": postTitle,
      "posts.$.description": postDescription,
      "posts.$.thumbnail": postThumbnail,
    };

    // Update the world document
    const updatedWorld = await WorldsModel.findOneAndUpdate(
      {
        _id: worldId,
        "posts._id": postId,
      },
      {
        $set: updateFields,
        $push: pushFields,
      },
      { new: true }
    );

    if (!updatedWorld) {
      return res.status(404).json({ message: "World or Post not found." });
    }

    res.status(200).json({ message: "Post updated successfully.", updatedWorld });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// export const WeditPost = async (req, res) => {
//   try {
//     const { postTitle, postDescription, postThumbnail, resources } = req.body;
//     console.log('req.body from WeditPost==========================-=-=-=-=-=---------=-=-=-=-=->  > >>  > > > >>   ',req.body)
//     if(req.body._id){
//       postId = req.body._id
//     }
//     if(req.body.worldId){
//       worldId = req.body.worldId
//     }
//     if (!worldId || !postId) {
//       return res.status(400).json({ message: "worldId and postId are required." });
//     }

//     const updateFields = {
//       "posts.$.title": postTitle,
//       "posts.$.description": postDescription,
//       "posts.$.thumbnail": postThumbnail,
//       "posts.$.photos": resources.filter((r) => r.type === "photo").map((r) => ({ contentUrl: r.content })),
//       "posts.$.videos": resources.filter((r) => r.type === "video").map((r) => ({ contentUrl: r.content })),
//       "posts.$.pdfs": resources.filter((r) => r.type === "pdf").map((r) => ({ contentUrl: r.content })),
//       "posts.$.texts": resources.filter((r) => r.type === "text").map((r) => ({ text: r.content })),
//       "posts.$.quizs": resources.filter((r) => r.type === "quiz").map((r) => ({
//         question: r.content,
//         choices: r.choices,
//         correctAnswer: r.correctAnswer,
//       })),
//     };

//     const updatedWorld = await WorldsModel.findOneAndUpdate(
//       {
//         _id: worldId,
//         "posts._id": postId,
//       },
//       { $set: updateFields },
//       { new: true }
//     );

//     if (!updatedWorld) {
//       return res.status(404).json({ message: "World or Post not found." });
//     }

//     res.status(200).json({ message: "Post updated successfully.", updatedWorld });
//   } catch (error) {
//     console.error("Error updating post:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

export const WdeletePost = async (req, res) => {
 
  try {
    if(req.query.worldId){
      worldId = req.query.worldId
    }
    if(req.query.postId){
      postId = req.query.postId
    }

    if (!worldId || !postId) {
      return res.status(400).json({ message: "worldId and postId are required." });
    }

    const updatedWorld = await WorldsModel.findByIdAndUpdate(
      worldId,
      {
        $pull: { posts: { _id: postId } },
      },
      {
        new: true,
      }
    );

    if (!updatedWorld) {
      return res.status(404).json({ message: "World not found or post does not exist." });
    }

    res.status(200).json({ message: "Post deleted successfully.", updatedWorld });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const AgetPosts =async(req, res) => {
  //req => worldId
  const skillerId = req.query.skillerId;
  try
{  let allPosts = [];
  let world ;
  const skiller = await SkillerModel.findById(skillerId).select({
    worlds: {
      _id: 1
    }
  })

  const worldIds = skiller.worlds.map((world) => world._id)
  console.log('worldIds from AgetPosts ==================-=-=-=-=-=->  > > > > > >  ',worldIds)


  for(const worldId of worldIds) {
     world =await WorldsModel.findById(worldId).select({
      posts: {
        _id: 1,
        title: 1,
        thumbnail: 1,
        description: 1,
        worldId: 1,
        levelId: 1,
        poster: {
          _id: 1,
          name: 1,
          rate: 1,
          picture: {
            name: 1,
            picture: {
              data: 1,
              contentType: 1,
            }
          },
      
      },
        photos:1,
        videos:1,
        texts: 1, // Store text directly
        pdfs: 1,
        quizs: 1
      }
     })
    if(world)
 {   allPosts = [...allPosts, ...world.posts]}
  }


 console.log('##################**************** allPosts from AgetPosts ************** ####################################*********************************** =============================================-=-=-=-=-=->> > > > > > > > ',allPosts)



    res.status(200).json(allPosts);}
    catch(error){
      console.log(error.message)
    }


}


export const AgetPostss =async(req, res) => {
  //req => worldId
  const skillerId = req.query.skillerId;
  try
{  
  const worlds = await WorldsModel.find({}, {
    posts: {

    }
  })

    res.status(200).json(worlds.posts);}
    catch(error){
      console.log(error.message)
    }


}


export const ASgetPosts =async(req, res) => {
  //req => worldId
  try
{  let skillerPosts = [];
  let worldPosts = []

 const worlds = await WorldsModel.find().select('posts');


  for(const world of worlds) {
    worldPosts = world.posts
    for(const post of worldPosts){
      if(post.poster._id === skillerId)
        {  
         console.log('post.poster._id ================================================================-=-=-=-=-=> > > >>> >   ',post.poster._id)
         skillerPosts = [...skillerPosts, post]}
         }
    }



 console.log('allPosts from AgetPosts =============================================-=-=-=-=-=->> > > > > > > > ',skillerPosts)



    res.status(200).json(skillerPosts);}catch(error){
      console.log(error.message)
    }


}

export const ASVgetPosts = async (req, res) => {
  try
  {
    const skillerId = req.query.skillerId
    const skiller = await SkillerModel.findById(skillerId).select({
      _id: 1,
      savedPosts: {
        _id: 1
      }
    });
 
    const savedPostIds = skiller?.savedPosts?.map((post) => post._id);
   
 
    // Find matching posts
    const savedPosts = await WorldsModel.aggregate([
      { $unwind: "$posts" }, // Flatten the posts array
      { $match: { "posts._id": { $in: savedPostIds } } }, // Match saved post IDs
      {
        $project: {

          post: "$posts"
        }
      }
    ]);
    
    
    return res.status(200).json(savedPosts);}catch(error){
 
    }

};



export const savePost = async(req, res) => {
  try
{  const {postId} = req.body
  console.log('postId from savePost ================-=-=-=-=-=--=-= > > >> > > >  >  ',postId)
  const skiller = await SkillerModel.findById(skillerId).select('savedPosts')
  const skillerSavedPosts = skiller.savedPosts
  const alreadyExist = skillerSavedPosts.find(sksv => sksv._id === postId)
  if(!alreadyExist){
  await SkillerModel.findByIdAndUpdate(
    skillerId,
    {
      $push: {
        savedPosts : {
          _id: postId
        }
      }
    },
    {
      new : true
    }
  )}}catch(error){
    console.log(error.message)
  }
}

export const unSavePost = async(req, res) => {
  const {postId} = req.body
  try
{  await SkillerModel.findByIdAndUpdate(
    skillerId,
    {
      $pull: {
        savedPosts: {
          _id: postId
        }
      }
    },
    {
      new: true
    }
  )}catch(error){
    console.log(error.message)
  }
}

export const checkIsPaidWorld = async(req, res) => {
 
   const  worldId = req.query.worldId
   const skillerId= req.query.skillerId
 
  try
{  const skiller = await SkillerModel.findById(skillerId)
  const worlds = skiller.worlds
  const isPaidWorld = Boolean(worlds.find(w => w._id === worldId))
  console.log('isPaidWorld from checkIsPaidWorld ============================-=-=-=-=-=-=-=-=-=-=-=-=-=-=====================-=-=-=-=-=-=-=-=-->   > > > > > > > > > >   ',isPaidWorld)
  res.status(200).json(isPaidWorld)}catch(error){
    console.log(error.message)
  }
}


export const publishWorld = async(req, res) => {
  try
{  if (req.body.SworldId){
    worldId = req.body.SworldId
  }
  console.log('req.body from publishWorld ===========================================-=-=-=-=-> > > > >  > > ',req.body)
  await SkillerModel.findOneAndUpdate(
    {
      _id: skillerId,
      "worlds._id" : worldId
    },
    {
      $set:
    {  "worlds.$.published" : true,
      "worlds.$.draft": false}
    },
    {
      new : true
    }
  )
  await WorldsModel.findByIdAndUpdate(
    worldId, 
    {
      $set: 
    {  published: true,
      draft: false}
      
    },
    {
      new : true
    }
  )}catch(error){
    console.log(error.message)
  }
}




export const setWorldPublished = async (req, res) => {
 
  const  worldId = req.body.worldId;
  const skillerId = req.body.skillerId;
 

 
    try {
      // Update World and Skiller models asynchronously
      await WorldsModel.findByIdAndUpdate(
        worldId,
      {$set:  { published: true, draft: false }},
        { new: true }
      );

      await SkillerModel.findOneAndUpdate(
        {
          _id: skillerId,
          'worlds._id': worldId,
        },
     { $set:  {
          'worlds.$.published': true,
          'worlds.$.draft': false,
        }},
        { new: true }
      );

      console.log(`World ${worldId} published successfully.`);
    } catch (error) {
      console.error('Error during publishing:', error);
    }
 
};

export const getPublishedStatus = async(req, res) => {
  try
{  const world = await WorldsModel.findById(worldId)
  res.status(200).json(world)}catch(error){
    console.log(error.message)
  }
}





export const getTrailerForEdit = async(req, res) => {
  //worldId
  }

export const editTrailer = async(req, res) => {
//worldId
}


export const getSkillerId = async(req, res) => {
  res.status(200).json(skillerId)
}

getWorldForEdit

export const getMyCurrentAdvisorId = async(req, res) => {
  const skillerId = req.query.skillerId
  const skiller =await SkillerModel.findById(skillerId).select({
    worlds: {
      _id: 1,
      myCurrentAdvisorId:1
    }
  });
  const world = skiller?.worlds?.find(w => w._id === worldId)
  const currentAdvisorId = world?.myCurrentAdvisorId;
  res.status(200).json(currentAdvisorId)

}

export const getToBeAdvisorPermission = async(req, res) => {
  try
{ 
  const skillerId = req.query.skillerId
  const world = await WorldsModel.findById(worldId).select({
    advisors: {
      _id: 1
    }
  });
  const advisors = world.advisors
  const toBeAnAdvisorPermssion = Boolean(advisors.find(ad => ad._id === skillerId))
  res.status(200).json(toBeAnAdvisorPermssion);}
  catch(error){
    console.log(error.message)
  }
  }



  export const setWorldIdInBack = async(req, res) => {
    if(req.body.worldId){
      worldId = req.body.worldId
    }
  }


  export const getCategoriesForFilterWorlds = async (req, res) => {
    try {
      // Fetch the document from the database
      const categories = await CategoriesModel.findOne({}, { worldsCategories: 1, _id: 0 });
 
      // Check if categories exist
      if (categories) {
        res.status(200).json(categories.worldsCategories);
      } else {
        res.status(404).json({ message: "No categories found." });
      }
    } catch (error) {
      // Handle errors
      res.status(500).json({ message: "Error fetching categories.", error: error.message });
    }
  };

  
  export const getCategoriesForFilterSkillers = async (req, res) => {
    try {
      const skillerId = req.query.skillerId
      // Fetch the document from the database
      const categories = await CategoriesModel.findOne({}, { SkillerCategories: 1, _id: 0 });
  
      // Check if categories exist
      if (categories) {
        res.status(200).json(categories.SkillerCategories);
      } else {
        res.status(404).json({ message: "No categories found." });
      }
    } catch (error) {
      // Handle errors
      res.status(500).json({ message: "Error fetching categories.", error: error.message });
    }
  };
  
export const checkIsAlreadyRateWorld = async(req, res) => {
  try
{ 
  const skillerId = req.params.skillerId
 
   const worldId = req.params.worldId
 
  const world = await WorldsModel.findById(worldId).select('rates')
  const rates = world.rates;
  const isAlreadRateWorld =Boolean ( rates.find(rt => rt._id === skillerId))
  res.status(200).json(isAlreadRateWorld)}
  catch(error){
    console.log(error.message)
  }
}

export const checkIsAlreadyRateSkiller = async(req, res) => {
  try
{ 
  const skillerId = req.params.skillerId;
  const worldId = req.params.worldId;

  const world = await WorldsModel.findById(worldId).select('publisherId')
  const publisherId = world.publisherId
  const publisher = await SkillerModel.findById(publisherId).select('rates')
  const rates = publisher.rates;
  const isAlreadRateSkiller =Boolean ( rates.find(rt => rt._id === skillerId))
  res.status(200).json(isAlreadRateSkiller)}
  catch(error){
    console.log(error.message)
  }
}

 

getAllWorlds






export const LeadsSkMMODMFA = async(req, res) => {

  console.log('req.body from LeadsSKMMODMFA ==============-=-=-=-> > > > >',req.body)
  // insert to SK
   await SkModel.insertMany(
    {
      name: req.body.Name,
      email: req.body.Email
    }
   )
  // insert to SK => MMO
  await SkMMOModel.insertMany(
    {
      name: req.body.Name,
      email: req.body.Email
    }
   )
  //insert to SK => MMO => DM 
  await SkMMODMModel.insertMany(
    {
      name: req.body.Name,
      email: req.body.Email
    }
   )
  //insert to SK => MMO => DM => FA
  await SkMMODMFAModel.insertMany(
    {
      name: req.body.Name,
      email: req.body.Email
    }
   )
}


export const LeadsTsWebDev= async(req, res) => {

  console.log('req.body from LeadsSKMMODMFA ==============-=-=-=-> > > > >',req.body)
  // insert to SK
   await SkModel.insertMany(
    {
      name: req.body.Name,
      email: req.body.Email
    }
   )
   await SkTsModel.insertMany(
    {
      name: req.body.Name,
      email: req.body.Email
    }
   )
   await SkTsWebdevModel.insertMany(
    {
      name: req.body.Name,
      email: req.body.Email
    }
   )
}

handleSkillerSignUp

export const getSkillersIds = async (req, res) => {
  const skillersIdss = await SkillerModel.find() .select('id');
  res.status(200).json(skillersIdss)
}


export const SocialLinks = async (req, res) => {

  try
{  
  const skillerId = req.body.skillerId;
  await SkillerModel.findByIdAndUpdate(
    skillerId, 
    {
      linkedIn: req?.body?.links?.linkedIn,
      facebook: req?.body?.links?.facebook,
      twitter: req?.body?.links?.twitter,
      instagram: req?.body?.links?.instagram
    },
    {
      new : true
    }
  )}catch(error) {
    console.log(error.message)
  }
}



export const getWorldsIamAdvisorAt = async (req, res) => {
  let worldsIds;
  try
  {
    const skillerId = req.query.skillerId
    const worldsFromSkiller = await SkillerModel.findById(skillerId).select({
      worlds: {
        _id: 1,
               
  
      }
    });
 
    
  if (worldsFromSkiller && worldsFromSkiller.worlds) {
      worldsIds = worldsFromSkiller.worlds.map((w) => w._id);
    console.log(worldsIds);
  } else {
 
  }
  
 
 
 
 
 


  let worlds = await Promise.all(
    worldsIds.map(async (worldId) => {
        // Find the corresponding world in worldsModel using the _id
        const world = await WorldsModel.findById(worldId).select({
 
          _id: 1,
          worldName: 1,
          price: 1,
 
          worldDescription: 1,
  
         worldThumbnail: 1,
          advisors: {
            _id : 1,
            isAvailable: 1,
              
          acceptedRequest: 1,
       
          invitedAccept: 1

          },
          publisher: 1,
 
       
        }); // Assuming `findById` is an async method

        // Return the found world or null if not found
        return world || null;
    })
);

console.log('worlds ========================================-=-=-=-=-=-=-=--> > > > >  > ***********getWorldIamAdvisorAt****************=-==-=> > > >  ',worlds)

// Remove null values in case some worlds were not found
worlds = worlds.filter(
  world => world !== null && world.advisors.some(adv => adv._id === skillerId && (adv.acceptedRequest  || adv.invitedAccept))
);
 
  
 worlds  =  worlds.map((world) => ({

  _id: world._id,
  worldName: world.worldName,
  price: world.price,
  publisher: world.publisher,
  worldDescription: world?.worldDescription,
  advisors: world.advisors,

  worldThumbnail: world.worldThumbnail?.data && world.worldThumbnail.contentType
    ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
    : null,



}))

 res.status(200).json(worlds)
}
catch(error) {
  console.log(error.message)
}
}


export const toggleAdvisorStatus = async (req, res) => {
  try
{  
  const skillerId = req.body.skillerId
  const  worldId = req.body.worldId
 
 
  const world = await WorldsModel.findById(worldId).select({
    advisors: {
      _id: 1,
      isAvailable: 1
    }
  })
 
  const advisor = world.advisors.find(ad => ad._id === skillerId)
  const previousStatus = advisor.isAvailable
  await WorldsModel.findOneAndUpdate(
    {
      _id: worldId,
      'advisors._id': skillerId,
 
    },
{  $set:  {
      'advisors.$[advisor].isAvailable': !previousStatus,
 
    }},
    {    arrayFilters: [
      { 'advisor._id': skillerId} ,
 
       // Match the correct world
    ],
    new: true, }
  )}catch(error){
 
  }
}

//store token in the database
export const insertTokenToDb = async (req, res) => {

}
// export const notification =  async (req, res) => {
//   const { token, title, body } = req.body;
//   console.log('req.body from =========================>>> > > > >   ***************************notification**************************************************************notification***************************************************************notification***************************************************************notification***************************************************************notification***************************************************************notification*************************************',req.body)
//   if (!token || !title || !body) {
//     return res.status(400).json({ error: "Missing fields" });
//   }

//   try {
//     await sendNotification(token, title, body);
//     res.status(200).json({ success: true, message: "Notification sent" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to send notification" });
//   }
// }


  export const uploadJob = async (req, res) => {
    try
{        // Prepare the skiller object for insertion
        const skillerId = req.body.skillerId
        const instructor = await SkillerModel.findById(skillerId).select('name rate picture');
 
        const newJob = {
          _id: req.body._id,
          title: req.body.title,
          description : req.body.description,
          term : req.body.term,
          experience: req.body.experience,

          budget: req.body.budget, // Ensure lowercase 'budget'
          categories: req.body.category,
          publisher: {
            _id: skillerId,
            name: instructor.name,
            rate: instructor.rate,
            picture: instructor.picture
          },
          uploadedAt: new Date().toISOString().split('T')[0],
          
        };   
 
      
    
        // Insert the new skiller into the database
        const createJob = await JobsModel.create(newJob);
    }catch(error){
      console.log(error.message)
    }
        
  }
  

  export const getAllJobs = async (req, res) => {
    try
{   const jobs =  await JobsModel.find(
      {},
      {
        _id: 1,
        title: 1,
        description: 1,
        term: 1,
        experience: 1,
        budget: 1,
        categories:1,
        publisher: 1,

      }
    )
    console.log('*******************************########################******************#####******jobs from getAllJobs***************************######################*******************###################### =================================================-=-=-=-=-=-=-=-=-> > > >  > > >  ',jobs)
    res.status(200).json(jobs)}catch(error){
      console.log(error.message)
    }
  }


  export const sendProposalLetter = async (req, res) => {
    try
{    console.log('req.body from*******************************************#################*********** sendPropsalLetter******************############*************########3 ===============================-=-=-=-=-=-=-=-> > > > > > > > ',req.body)
    const skiller = await SkillerModel.findById(skillerId).select('name rate picture')
    await JobsModel.findByIdAndUpdate(
      req.body.jobId,
      {
        $push : {
          Freelancers: {
            _id: skillerId,
            theOne: false,
            name: skiller.name,
            rate: skiller.rate,
            letter : req.body.letter,
            picture: skiller.picture
          }


        }
      },
      {
        new : true
      }
    )}catch(error){
      console.log(error.message)
    }
  }


export const getUploadedJobs = async (req, res) => {
  try
{  const uploadedJobs = await JobsModel.find({"publisher._id" : skillerId }, {
    _id: 1,
    title: 1,
    description: 1,
    term: 1,
    experience: 1,
    budget: 1,
    categories:1,
    publisher: 1,
  })
  res.status(200).json(uploadedJobs)}catch(error){
    console.log(error.message)
  }
}

export const setPropsalAccepted = async (req, res) => {
  try
{  const jobId = req.body.jobId;
  const theOneId = req.body.theOneId
  await JobsModel.findOneAndUpdate(
    {_id : jobId,
      "Freelancers._id" : theOneId
    },
    {
      $set: {theOne : true}
    },
    {
      arrayFilters: [
        { 'Freelancers._id': theOneId }, // Match specific world
 
      ],
      new: true,
    }
  )}catch(error){
    console.log(error.message)
  }
}

export const getAllProposals = async (req, res) => {
  try
{ 
    console.log('req.query ============================================================-=-=-=-=-=-=-=-=-=-=-=-=-> >>> > >  > > > > > > > > >   ',req.query)
   console.log('req.query.jobId =================================-=-=-=-=-=-=-=-=-=-=-=->> > > > > > > > >  ',req.query.jobId)
  const job = await JobsModel.findById(req.query.jobId).select( 'Freelancers');
  console.log('********************************************##################applied freelancers#####################***********************=======================-=-=-=-=-=-=-=-=-=-> >  > > > >  ', job.Freelancers)
  res.status(200).json(job?.Freelancers)
}
catch(error) {
  console.log(error.message)
}
}
 

export const getAdvisorPriceNameWorldName = async(req, res) => {
  try
{  const worldId = req.query.worldId
  const advisorId= req.query.advisorId
  const world = await WorldsModel.findById(worldId).select({
    worldName : 1,
    advisors : {
      _id: 1,
      price: 1,
 
  
      studentToBeAdvisorName: 1, //which the advisor in this case
       
      
    }
  })
  console.log('world from ################################*************************  getAdvisorPriceNameWorldName ################################*******************************************================================-=-=-=-=-=-=--=-=-=-> > >  > > > > > > >    ',world)
  const worldName = world.worldName
  const advisorPrice = world?.advisors?.find(ad => ad._id === advisorId).price
  const advisorName = world?.advisors?.find(ad => ad._id === advisorId).studentToBeAdvisorName
  res.status(200).json({worldName, advisorPrice, advisorName})}catch(error){
    console.log(error.message)
  }
}



export const getExamerPriceNameWorldName = async (req, res) => {
  try
{  const worldId = req.query.worldId
  const examerId= req.query.examerId
  const world = await WorldsModel.findById(worldId).select({
    worldName : 1,
    examers : {
      _id: 1,
      price: 1,
 
  
      name: 1, //which the advisor in this case
       surname: 1
      
    }
  })
  const worldName = world.worldName;
  const examerPrice = world?.examers?.find(ad => ad._id === examerId)?.price
  const examerName = world?.examers?.find(ad => ad._id === examerId)?.name
  res.status(200).json({worldName, examerPrice, examerName})}
  catch(error){
    console.log(error.message)
  }
}


export const  changeAdvisorPrice = async (req, res) => {

  try 
{  
  const skillerId = req.body.skillerId
  await WorldsModel.findOneAndUpdate(
    {
      _id: req.body.worldId,
      'advisors._id' : skillerId
    },
    {
      $set : {
        price: req.body.pricee
      }
    },
    {
      
    
     new: true
    }
  )
} catch(error){
    console.log(error.message)
  }
}

export const getEmployees = async (req, res) => {
  try
{  const job = await JobsModel.find({'publisher._id' : req.body.skillerId}).select('Freelancers')
  const myEmployees = job.Freelancers.filter(fr => fr.theOne === true)
  res.status(200).json(myEmployees)}catch(error){
    console.log(error.message)
  }
}


export const getNumberOfUnReadedMessages = async (req, res) => {
  try
{  const skillerId = req.query.skillerId
  const skiller = await SkillerModel.findById(skillerId).select({
    messages: {
      _id:1,
      readed: 1,
      response: 1
    }
  })
 
  res.status(200).json(skiller?.messages?.filter(ms => !ms.readed && !ms.response)?.length)
}
catch(error)
{

}
}



export const sendWelcomeNotification = async (req, res) => {
  console.log('req.body from sendWelcomeNotification######################******************* ======================================-=-=-=-> > > > > > >  ',req.body)
  await SkillerModel.findByIdAndUpdate(
    req.body.skillerId,
    {
      $push: {
        notificationsss: {
          _id : req.body.notificationId,
          typeee: 'welcomeMessage',
          readed : false,
          title: 'hello and welcome to sell skill',
          content: 'sell skill is your best friend on online money making'
        }
      }
    },
    {
      new: true
    }
  )
}


export const setAllMessagesToReaded = async (req, res) => {
  const { skillerId, withId } = req.body;

  try {
    await SkillerModel.updateOne(
      {
        _id: skillerId,
        "messages.withId": withId,
        "messages.readed": false,
      },
      {
        $set: {
          "messages.$[elem].readed": true,
        },
      },
      {
        arrayFilters: [{ "elem.withId": withId, "elem.readed": false }],
        new: true,
      }
    );

    res.status(200).json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating messages", error });
  }
};


export const changeAdvisorTitle = async (req,res) => {
  try 
{  
  const skillerId = req.body.skillerId
  await WorldsModel.findOneAndUpdate(
    {
      _id: req.body.worldId,
      'advisors._id' : skillerId
    },
    {
      $set : {
        title: req.body.titlee
      }
    },
    {
      
    
     new: true
    }
  )
} catch(error){
    console.log(error.message)
  }
}

export const changeAdvisorDescription = async (req, res) => {
  try 
{  
  const skillerId = req.body.skillerId
  await WorldsModel.findOneAndUpdate(
    {
      _id: req.body.worldId,
      'advisors._id' : skillerId
    },
    {
      $set : {
        description: req.body.description
      }
    },
    {
      
    
     new: true
    }
  )
} catch(error){
    console.log(error.message)
  }
}


export const sendAdvisorReq = async (req, res) => {
try
{  console.log('req.body from #############################*************************** sendAdvisorReq ########################*********** ==================================================-=-=-=-=-=-=-=-=-> > > > > > > > > >>    ',req.body)
  const {worldId, skillerId, notificationId, title, description, price} = req.body
  const world = await WorldsModel.findById(worldId).select('publisherId')
  const publisherId = world.publisherId
 
  const skiller = await SkillerModel.findById(skillerId).select('name surname')
  await WorldsModel.findByIdAndUpdate(
    worldId,
{    push: {
      advisors: {
        _id: skillerId,
        title: req.body.title,
        description: req.body.description,
        
        price: req.body.price,
       
        
        studentToBeAdvisorName: skiller.name, //which the advisor in this case
        studentToBeAdvisorSurname: skiller.surname,
        isAvailable: true,

        
        requested: true,
        acceptedRequest: false,
        invited: false,
        invitedAccept: false
      }
    }},
    {
      new: true
    }
  )
 

  await SkillerModel.findByIdAndUpdate(
    publisherId,
    {
      $push: {
        notificationsss: {
          _id: notificationId,
          typeee: 'advisorRequest',
          ///for world s
          title: `You have got an advisor request from ${skiller.name} ${skiller.surname}`,
          content: `title: ${title}.

          description: ${description}.

          price: ${price}.
          `,
          requestId: skillerId,
          worldId: worldId,
          readed: false,
        }
      }
    },
    {
      new: true
    }
  )}catch(error){

  }
  //send notification to publisher ++ set requestId there
}

export const acceptAdvisorReq = async (req, res) => {
try
{   console.log('req.body from ###########################################****************************   acceptAdvisorReq *********************************##############################  ============================================================-=-=-=-=-=-=-=-=-=-=--=-> > > > > > > >   ',req.body)
  const {worldId, requestId, notificationId} = req.body

  const world = await WorldsModel.findById(worldId).select('worldName')
  //patch acceptedRequest to true
  await WorldsModel.findOneAndUpdate(
 {  _id: worldId,
    "advisors._id": requestId},
    {
      $set: {
        "advisors.$.acceptedRequest": true
      }
    },
    {new: true}
  )

   //send him notification
 
  await SkillerModel.findByIdAndUpdate(
    requestId,
    {
      $push: {
        notificationsss: {
          _id: notificationId,
          typeee: 'acceptedRequest',
          ///for world s
          title: `congratulations now you are an advisor on ${world.worldName}`,
          content: `congratulations, now you are an advisor on ${world.worldName}, you can always change your settings from your profile settings.`,
          requestId: requestId,
          worldId: worldId,
          readed: false,
        }
      }
    },
    {
      new: true
    }
  )}catch(error){

  }

}



export const sendInviteToSkiller = async (req, res) => {

try
{  const {skillerId, invitedSkillerId,  worldId, notificationId } = req.body
  const world = await WorldsModel.findById(worldId).select('worldName')
  //search for the studentToBeAdvisor

  //When click insert insert him direclty to the world advisors
  await WorldsModel.findByIdAndUpdate(
    worldId,
    {
      push: {
        _id: invitedSkillerId,







 
        isAvailable: false,
  
        
        requested: false,
        acceptedRequest: false,
        invited: true,
        invitedAccept: false
      }
    },
    {
      new: true
    }
  )
  //send him notification to put his title, desc, price and availble or not
  await SkillerModel.findByIdAndUpdate(
    skillerId,
    {
      $push: {
        notificationsss: {
          _id: notificationId,
          typeee: 'invitationToWorld',
          ///for world s
          title: `Congratulations you have been invited to be an advisor on ${world.worldName} world`,
          content: `Congratulations you have been invited to be an advisor on ${world.worldName} world, you can accept now and be an advisor right ahead!`,
          requestId: invitedSkillerId,
          worldId: worldId,
          readed: false,
        }
      }
    },
    {
      new: true
    }
  )}catch(error){
  }
}

export const acceptAdvisorInvitation = async (req, res) => {
try
{  const {worldId, skillerId, title, description, price, notificationId } = req.body
  const world = await WorldsModel.findById(worldId).select('publisherId')
  const skiller = await SkillerModel.findById(skillerId).select('name surname')
    //change state on the world
    await WorldsModel.findOneAndUpdate(
    
      {  _id: worldId,
        "advisors._id": skillerId},
        {
          $set: {
                   
       
          "advisors.$.title": title,
          "advisors.$.description": description,
          
          "advisors.$.price": price,
 
          "advisors.$.studentToBeAdvisorName": skiller.name, //which the advisor in this case
          "advisors.$.studentToBeAdvisorSurname": skiller.surname,
          "advisors.$.isAvailable": true,

 
          "advisors.$.invitedAccept": true
          }
        },
        {
          new: true
        }
      
    )
    //send notification to the invite sender


    await SkillerModel.findByIdAndUpdate(
      world.publisherId,
      {
        $push: {
          notificationsss: {
            _id: notificationId,
            typeee: 'invitationAccepted',
            ///for world s
            title: `your inivtation to ${skiller.name} ${skiller.surname} has been accepted!`,
            content: `congratulations, now ${skiller.name} ${skiller.surname} is an advisor in your world!`,
            worldId: worldId,
            requestId: skillerId,
            readed: false,
          }
        }
      },
      {
        new: true
      }
    )}catch(error){

    }
}


 



export const getPostResources = async (req, res) => {
  try {
    const worldId = req.query.worldId;
    const postId = req.query.postId;

    console.log('Received query:', req.query);

    const world = await WorldsModel.findOne(
      {
        _id: worldId,
        'posts._id': postId,
      }
    );

    if (!world) {
      return res.status(404).json({ message: 'World not found' });
    }

    const post = world.posts.find(p => p._id.toString() === postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const resources = [
      ...(post.photos || []).map(photo => ({ type: 'image', url: photo.contentUrl, order: photo.order })),
      ...(post.videos || []).map(video => ({ type: 'video', url: video.contentUrl, order: video.order })),
      ...(post.texts || []).map(text => ({ type: 'text', content: text.text, order: text.order })),
      ...(post.pdfs || []).map(pdf => ({ type: 'pdf', content: pdf.text, order: pdf.order })),
    ];

    resources.sort((a, b) => a.order - b.order);

    const formattedPost = {
      _id: post._id,
      title: post.title,
      thumbnail: post.thumbnail,
      description: post.description,
      worldId: world._id,
      levelId: post.levelId,
      poster: post.poster,
      resources,
    };

    res.status(200).json(formattedPost);
  } catch (error) {
    console.error('Error fetching post resources:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const checkIsAlreadyRatePost = async (req, res) => {
  try
  { 
    const {skillerId, worldId, postId} = req.params
     const world = await WorldsModel.findOne(
      {
        _id: worldId,
        'posts._id': postId,
      }
    );

    if (!world) {
      return res.status(404).json({ message: 'World not found' });
    }

    const post = world.posts.find(p => p._id.toString() === postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const rates = post.rates;
    const isAlreadRateWorld =Boolean ( rates.find(rt => rt._id === skillerId))
    res.status(200).json(isAlreadRateWorld)}
    catch(error){
      console.log(error.message)
    }
}



export const getPostComments = async(req, res) => {
  try
{  
  const {postId, worldId} = req.query

  const world = await WorldsModel.findOne(
    {
      _id: worldId,
      'posts._id': postId,
    }
  );

  if (!world) {
    return res.status(404).json({ message: 'World not found' });
  }

  const post = world.posts.find(p => p._id.toString() === postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  
 
  res.status(200).json(post.comments)
}
  catch(error){

  }
 }


 export const handleLikePost = async (req, res) => {
  const {worldId, postId, skillerId} = req.body
 }

 export const addCommentToPost = async (req, res) => {


  try{
    const {worldId, skillerId, postId} = req.body 
 
 
  console.log('req.body from commentWorld =================================--------------------:::::: >>> ', req.body)
  const skiller = await SkillerModel.findById(skillerId).select('name picture')
  await WorldsModel.findOneAndUpdate(
    {_id: worldId,

      "posts._id": postId
    },
    {
      $push: {
        "posts.comments": {
          _id: req.body.commentId,
          comment: req.body.comment,
          //commenter
          commenter: [{
            _id: skillerId,
            
            name: skiller.name,
            picture: skiller.picture,
          }],
  
        }
      }
    },
    {
      new: true
    }
  )
} catch (error) {
  console.log(error.message);

}


 }




 
export const handleSellerSignUp = async (req, res) => {//1
  try {
 
 
    // Validate required fields   
    const {_id, restaurant_name, description, email, phone_number, FcmToken, password, img  } = req.body;
    console.log('req.body from handleSellerSignUp ============================================-=-=-=-=-=-=-=-> > > > > > >   ',req.body)
 
 

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPwd = await bcryptjs.hash(password, salt);

    // Prepare the skiller object for insertion
    const newSkiller = {
      _id,
      name: restaurant_name,
      description,
      email,
      password: hashedPwd,
      FcmToken: FcmToken || '', // Default to an empty string if not provided
      phoneNumber: phone_number,
      image: img,
      verified: false,
       
      joinedAt: new Date().toISOString().split('T')[0],
 
    };   

    // Insert the new skiller into the database
    const createdSkiller = await sellerModel.create(newSkiller);
 

    await createdSkiller.save();
    
    // Generate JWT token
     const token = jwt.sign({ _id: createdSkiller._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  
    // Respond with the token
    return res.status(201).json({ token }); // 201 Created
  } catch (error) {
 
    return res.status(500).json({ error: 'Internal server error' });
  }
};





 
export const handleCustomerSignUp = async (req, res) => {//1
  try {
 
 
    // Validate required fields   
    const { name  ,   phone_number, FcmToken } = req.body;
  
    console.log('req.body from handleCustomerSignUp ====================-=-=-=-=-=-==========-=-=-=-=-= > > > >>   ', req.body)
 
    // Prepare the skiller object for insertion
    const newSkiller = {
 
      name,
     
 
      FcmToken: FcmToken || '', // Default to an empty string if not provided
      phoneNumber: phone_number,
 
       
      joinedAt: new Date().toISOString().split('T')[0],
 
    };   

    // Insert the new skiller into the database
    const createdSkiller = await CustomerrModel.create(newSkiller);
 

    await createdSkiller.save();

    // Generate JWT token
     const token = jwt.sign({ _id: createdSkiller._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Respond with the token
    return res.status(201).json({ token }); // 201 Created
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const getSeller = async(req, res) => {

  //params id
  console.log('req.params from getSeller ===============================================-=-=-=-=-=-=-=-=-=-=-=-> > > > > > > > >  ',req.params)

  console.log('req.params.id from getSeller =================================================-=-=-=-=-=-=-=-=->>> > >  > >> >  ', req.params.id)
  const seller = await sellerModel.findById(req.params.id)
  console.log('seller from getSeller ============================-=-=-=-=-=-=-> > > > > >    ',seller)
  res.status(200).send(seller)
  //verifed
  //name
  //
}

