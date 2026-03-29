const { cloudinary } = require("./config/cloudinary.js");
console.log("Config before upload:", cloudinary.config());
cloudinary.uploader.upload_stream(
  { folder: "restyle-products" },
  (error, result) => {
    if (error) {
      console.error("UPLOAD ERROR:", error);
    } else {
      console.log("UPLOAD SUCCESS:", result.secure_url);
    }
  }
).end(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64"));
