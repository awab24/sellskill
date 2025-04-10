import mongoose from 'mongoose';
import cors from 'cors'
import bodyParser from 'body-parser';
import express from 'express'
import session from 'express-session'
import dotenv from 'dotenv';
import router from './routers/routers.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

dotenv.config();
let params;
const require = createRequire(import.meta.url);
// const admin = require("firebase-admin");
// admin.initializeApp({
//   credential: admin.credential.cert("./serviceAccountKey.json"), // Adjust the path as needed
// });
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const app = express()
app.use(express.json({ limit: '10gb' }));
app.use(express.urlencoded({ limit: '10gb', extended: true }));
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

app.use(cors({
    origin: 'https://sell-skill.com' || '*', // Allow your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS',
    credentials: true,
  }));
app.set('view engine', 'ejs')



//connect to mongoose
app.use(router);
const PORT = process.env.PORT || 5000;
const dbUrl = process.env.DATABASE_URL;


//---------------send to next




//--------------------------

 
app.use(router);




// Serve Next.js static files for `/about`
app.use('/about', express.static(path.join(__dirname, '../next/out/about')));
app.use('/_next', express.static(path.join(__dirname, '../next/out/_next')));

// Ensure `/about` serves the correct HTML file
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../next/out/about/index.html'));
});




// Serve Next.js static files for `/about`
app.use('/blog/1', express.static(path.join(__dirname, '../next/out/blog/1')));
app.use('/_next', express.static(path.join(__dirname, '../next/out/_next')));

// Ensure `/about` serves the correct HTML file
app.get('/blog/1', (req, res) => {
  res.sendFile(path.join(__dirname, '../next/out/blog/1/index.html'));
});

// Serve Next.js static files for `/about`
app.use('/blog/2', express.static(path.join(__dirname, '../next/out/blog/2')));
app.use('/_next', express.static(path.join(__dirname, '../next/out/_next')));

// Ensure `/about` serves the correct HTML file
app.get('/blog/2', (req, res) => {
  res.sendFile(path.join(__dirname, '../next/out/blog/2/index.html'));
});


// Serve Next.js static files for `/about`
app.use('/blog/3', express.static(path.join(__dirname, '../next/out/blog/3')));
app.use('/_next', express.static(path.join(__dirname, '../next/out/_next')));

// Ensure `/about` serves the correct HTML file
app.get('/blog/3', (req, res) => {
  res.sendFile(path.join(__dirname, '../next/out/blog/3/index.html'));
});




// Serve Next.js static files for `/about`
app.use('/blog/4', express.static(path.join(__dirname, '../next/out/blog/4')));
app.use('/_next', express.static(path.join(__dirname, '../next/out/_next')));

// Ensure `/about` serves the correct HTML file
app.get('/blog/4', (req, res) => {
  res.sendFile(path.join(__dirname, '../next/out/blog/4/index.html'));
});



//  // Serve Next.js static files for `/about`
// app.use('/Gprofile', express.static(path.join(__dirname, '../next/out/Gprofile')));
// app.use('/_next', express.static(path.join(__dirname, '../next/out/_next')));

// app.get('/Gprofile/*', (req, res) => {
//    params = req.params[0]; // Capture everything after `/Gprofile/`

//   console.log('Params ================================================-=-=-=-=-=-=-=-=-=-> > > > > > >   ', params);

//   res.sendFile(path.join(__dirname, '../next/out/Gprofile/index.html'));
// });

// router.get('/api/endpoints/getProfile', async (req, res) => {
//   try {
//     //change skiller id to that from front
//     let haveSameWorld = false;
//     let areMates = false;
//     const id = params;
//     console.log('certainSkillerId from getProfile ==============================================-=-=-=-=-=-=-=-=-=-=-=-=-=-> > > > > > > > > > > >  ',id)
//     const skiller = await SkillerModel.findById(id)
//     const skWorlds = skiller.worlds.filter(w => w.publisher)
//     const skCart = skiller.myCart
//     console.log ( ' skCart =---------------------------==> ',skCart)
//    console.log ( ' skWorld =---------------------------==> ',skWorlds)

//     const worlds = await WorldsModel.find();
//     if (!skiller) {
//       return res.status(404).json({ error: "User not found" });
//     }

// if(skillerId)
// {    
//   const skiller2 = await SkillerModel.findById(skillerId)
//   const skiller1Worlds = skiller.worlds
//   const skiller2Worlds = skiller2.worlds

//   skiller1Worlds.forEach(sk1w => {
//     if (skiller2Worlds.some(sk2w => sk1w._id === sk2w._id )) {
//       haveSameWorld = true;
//     }
//   });


//   areMates = Boolean(skiller.mates.find(mt => mt._id === skillerId))
// }
//     const formattedSkiller = {
//       _id: skiller._id,
//       coverPicture: skiller.coverPicture
//         ? `data:${skiller?.coverPicture?.picture?.contentType};base64,${skiller?.coverPicture?.picture?.data?.toString('base64')}`
//         : null,
//       picture: skiller.picture
//         ? `data:${skiller?.picture?.picture?.contentType};base64,${skiller?.picture?.picture?.data?.toString('base64')}`
//         : null,
//       name: skiller.name ,
//       surname: skiller.surname ,
//       letter: skiller.letter || "",
//       rate: skiller.rate || 0,
//       followers: skiller.followers || [],
//       following: skiller.following || [],
//       worlds: skWorlds.map((world) => ({

//         _id: world._id,
//         worldName: world.worldName,
//         price: world.price,
//         numberOfStudents: world?.students?.length || 0,
//         numberOfAdvisors: world?.advisors?.length || 0,
//         worldDescription: world?.worldDescription,
//         dateOfPublish: world.dateOfPublish,
//         isWorldAllowingAdvisors: world.isWorldAllowingAdvisors,
//         worldThumbnail: world.worldThumbnail?.data && world.worldThumbnail.contentType
//           ? `data:${world.worldThumbnail.contentType};base64,${world.worldThumbnail.data.toString('base64')}`
//           : null,
//         publisher: world.publisher
//           ? {
//               _id: world.publisher._id,
//               name: world.publisher.name,
//               rate: world.publisher.rate,
//               picture: world.publisher.picture?.picture?.data && world.publisher.picture?.picture.contentType
//               ? `data:${world.publisher.picture?.picture?.contentType};base64,${world.publisher.picture?.picture?.data.toString('base64')}`
//               : null,
            
//             }
//           : null,
//         comments: world?.comments?.map((comment) => ({
//           _id: comment._id,
//           comment: comment.comment,
//           commenters: comment.commenter.map((commenter) => ({
//             _id: commenter._id,
//             name: commenter.name,
//             picture: commenter.picture.picture?.data && commenter.picture.picture.contentType
//               ? `data:${commenter.picture.picture.contentType};base64,${commenter.picture.picture.data.toString('base64')}`
//               : null,
//           })),
//         })),
//         allowedCard: (skWorlds ? !Boolean(skWorlds.find(w => w._id === world._id)  ) : true )         &&         ( skCart ? !Boolean ( skCart.find(cr => cr._id === world._id)) : true),
//         rates: world?.rates?.map((rate) => ({
//           _id: rate._id,
//           rate: rate.rate,
//           rater: rate.rater
//             ? {
//                 _id: rate.rater._id,
//                 name: rate.rater.name,
//                 picture: rate.rater.picture.picture?.data && rate.rater.picture.picture.contentType
//                   ? `data:${rate.rater.picture.picture.contentType};base64,${rate.rater.picture.picture.data.toString('base64')}`
//                   : null,
//               }
//             : null,
//         })),
//       })),
//       certifications: skiller.certifications || [],
//       realWorldResults: skiller.realWorldResults || [],
//       instructorDescription: skiller.instructorDescription || "No description available",
//       joinedAt: skiller.joinedAt || null,
//       definingVideo: skiller.definingVideo || null,
//       cash: skiller.totalCash || 0,
//       areMates: areMates,
//       haveSameWorld: haveSameWorld
//     };

//     res.status(200).json(formattedSkiller);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// } )

// Dynamic route for /Gprofile/:id
// app.get('/Gprofile/:id', (req, res) => {      
//   const { id } = req.params;

//   // Construct the path to the dynamic page
//   const filePath = path.join(__dirname, `../next/out/Gprofile/${id}/index.html`);

//   // Send the file if it exists, otherwise send a 404
//   res.sendFile(filePath, (err) => {
//     if (err) {
//       res.status(404).send('Page not found');
//     }
//   });
// });


// Serve React for all other routes
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


//------------------------------------


const connectMongoose = async() => {
    await mongoose.connect(dbUrl)
    .then(() => app.listen(PORT, () => console.log`successfully connected to mongoose `))
    .catch((error) => console.log(error.message))  
}

connectMongoose();


// export {admin};