const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3Bucket } = require('../database/conn');

export async function s3Uupload() {
    try {
        const upload = await multer({
            storage: multerS3({
                s3: s3Bucket,
                bucket: config.S3_BUCKET_NAME,
                acl: 'public-read', // Adjust permissions as necessary
                metadata: async (req, file) => ({ fieldName: file.fieldname }),
                key: async (req, file) => `${Date.now().toString()}-${file.originalname}`
            })
        })
        return upload
    } catch (error) {
        console.log('we might not be as connected to s3_Bucket', error)
    }
}
