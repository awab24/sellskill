// import multer from 'multer';
// import multerS3 from 'multer-s3';
// import { S3Client } from '@aws-sdk/client-s3';

// // S3 Client Initialization
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // Multer middleware for handling S3 uploads
// const uploadMulterAWS = multer({
//   storage: multerS3({
//     s3: s3Client,
//     bucket: process.env.AWS_S3_BUCKET_NAME,
//     key: (req, file, cb) => {
//       cb(null, `videos/${Date.now()}_${file.originalname}`);
//     },
//     contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set content type based on the file
//   }),
// });

// export default uploadMulterAWS;

