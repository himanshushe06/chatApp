import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve("uploads");
//uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true,
    });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Make filename safe
        const safeName =
            file.originalname.replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );
        // Prevent duplicate filenames
        cb(
            null,
            `${Date.now()}-${safeName}`
        );
    },
});

const fileFilter = (req, file, cb) => {
    //Images
    if (file.mimetype.startsWith("image/")) {
        return cb(null, true);
    }

    //Audio
    if (file.mimetype.startsWith("audio/")) {
        return cb(null, true);
    }

   // Documents
    const allowedDocumentTypes = [
        // PDF
        "application/pdf",
        // Word
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // Excel
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // PowerPoint
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        // Text
        "text/plain",
        "text/csv",
        // ZIP
        "application/zip",
        "application/x-zip-compressed",
    ];
    if ( allowedDocumentTypes.includes( file.mimetype )) {
        return cb(null, true);
    }
    // Reject unsupported files
    return cb(
        new Error(
            `Unsupported file type: ${file.mimetype}`
        ),
        false
    );
};
const upload = multer({
    storage,
    limits: {
        // Maximum file size = 10 MB
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter,
});

export default upload;