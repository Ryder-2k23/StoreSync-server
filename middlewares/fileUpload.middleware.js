import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary, 
    params:{
        folder: "Medium-blog-api/post-images",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
        transformation: [{
            width: 500,
            height: 500,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto"
        }]
    }
});

const upload = multer({
    storage, limits:{fileSize: 5*1024*1024}  //5mb
});

export default upload;