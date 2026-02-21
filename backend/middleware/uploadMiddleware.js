const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Memory storage — files stay in buffer, uploaded to Cloudinary directly
const storage = multer.memoryStorage();

// File filter: allow images + PDFs/docs
const fileFilter = (req, file, cb) => {
    const allowedImages = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedDocs = ['application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if ([...allowedImages, ...allowedDocs].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Allowed: JPEG, PNG, WebP, GIF, PDF, DOC, DOCX'), false);
    }
};

// Multer instance — 5MB limit
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * Upload a buffer to Cloudinary.
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} folder - Cloudinary folder (e.g., 'avatars', 'resumes')
 * @param {string} resourceType - 'image' or 'raw' (for PDFs/docs)
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToCloudinary = (buffer, folder, resourceType = 'auto') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: `job-portal/${folder}`,
                resource_type: resourceType,
                transformation: folder === 'avatars'
                    ? [{ width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }]
                    : folder === 'logos'
                        ? [{ width: 500, height: 500, crop: 'limit', quality: 'auto' }]
                        : undefined,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({ url: result.secure_url, publicId: result.public_id });
            }
        );
        stream.end(buffer);
    });
};

/**
 * Delete a file from Cloudinary by public ID.
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (err) {
        console.error('Cloudinary delete error:', err.message);
    }
};

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary };
