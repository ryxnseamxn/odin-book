const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const multerS3 = require('multer-s3');
const { s3Client } = require('./bucket');

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const s3Storage = multerS3({
  s3: s3Client,
  bucket: process.env.MINIO_DEFAULT_BUCKET || 'snaps',
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const uniqueFilename = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const uploadSnap = multer({
  storage: s3Storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter
});

const uploadSingleSnap = uploadSnap.single('snap');

const handleUpload = (req, res, next) => {
  uploadSingleSnap(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ error: `Server error: ${err.message}` });
    }
    next();
  });
};

module.exports = {
  uploadSnap,
  uploadSingleSnap,
  handleUpload,
  getFileUrl: (filename) => `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/${filename}`
};