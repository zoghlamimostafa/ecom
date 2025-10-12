const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.SECRET_KEY || process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUploads, 
      {
        resource_type: "auto",
        folder: "ecommerce_products"
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          });
        }
      }
    );
  });
};
const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(fileToDelete, (error, result) => {
      if (error) {
        console.error("❌ Cloudinary delete error:", error);
        reject(error);
      } else {
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      }
    });
  });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };