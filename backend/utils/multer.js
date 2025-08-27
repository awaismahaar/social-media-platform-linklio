import multer from "multer";
import path from "path";
// Multer Storage (Temporary Uploads to Server)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Files temporarily stored in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


// Multer File Upload Middleware
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif|webp|avif|heic/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (mimeType && extName) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

export default upload;
