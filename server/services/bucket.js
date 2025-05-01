const { S3Client, CreateBucketCommand, HeadBucketCommand } = require("@aws-sdk/client-s3");

const requiredEnvVars = [
  'MINIO_ENDPOINT',
  'MINIO_PORT',
  'MINIO_ACCESS_KEY',
  'MINIO_SECRET_KEY',
  'MINIO_DEFAULT_BUCKET'  
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL ERROR: Environment variable ${envVar} is not defined.`);
    process.exit(1);
  }
}

const minioEndpoint = process.env.MINIO_ENDPOINT;
const minioPort = parseInt(process.env.MINIO_PORT || '9000', 10);
const useSsl = process.env.MINIO_USE_SSL === 'true'; 
const accessKeyId = process.env.MINIO_ACCESS_KEY;
const secretAccessKey = process.env.MINIO_SECRET_KEY;
const region = process.env.MINIO_REGION || 'us-east-1'; 
const bucketName = process.env.MINIO_DEFAULT_BUCKET;

const s3Client = new S3Client({
  endpoint: `http${useSsl ? 's' : ''}://${minioEndpoint}:${minioPort}`,
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  forcePathStyle: true,
});

console.log(`S3 Service initialized for endpoint: ${minioEndpoint}:${minioPort}, bucket: ${bucketName}`);

async function ensureBucketExists() {
  console.log(`Checking if bucket "${bucketName}" exists...`);
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket "${bucketName}" already exists.`);
  } catch (error) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404 || error.name === 'NoSuchBucket') {
      console.log(`Bucket "${bucketName}" not found. Creating...`);
      try {
        await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
        console.log(`Bucket "${bucketName}" created successfully.`);
      } catch (createError) {
        console.error(`FATAL ERROR: Could not create bucket "${bucketName}":`, createError);
        throw createError;
      }
    } else {
      console.error(`FATAL ERROR: Error checking bucket "${bucketName}":`, error);
      throw error;
    }
  }
}

module.exports = { s3Client, bucketName, ensureBucketExists };