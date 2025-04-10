// import multer from 'multer';
// import multerS3 from 'multer-s3';
// import AWS from 'aws-sdk';

// // AWS S3 configuration
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION
// });

// const uploadThumbnail = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_S3_BUCKET_NAME,
//     acl: 'public-read',
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, `thumbnails/${Date.now()}_${file.originalname}`);
//     }
//   }),
//   limits: { fileSize: 5 * 1024 * 1024 } // 5 MB file size limit for thumbnails
// });

// const uploadVideos = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_S3_BUCKET_NAME,
//     acl: 'public-read',
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, `videos/${Date.now()}_${file.originalname}`);
//     }
//   }),
//   limits: { fileSize: 10 * 1024 * 1024 * 1024 } // 10 GB file size limit for videos
// });

// export const uploadThumbnailMiddleware = uploadThumbnail.single('thumbnail');
// export const uploadVideosMiddleware = uploadVideos.array('videos', 10); // Max 10 videos
