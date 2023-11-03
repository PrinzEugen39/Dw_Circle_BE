import { v2 as cloudinary } from "cloudinary";

export default new (class CloudinaryConfig {
  upload() {
    cloudinary.config({
      cloud_name: "dl7ttedsi",
      api_key: "587567672326331",
      api_secret: "Wd81XWachtK10Bd5GrbPuy-epyo",
    });
  }

  async destination(image: any) {
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        "src/uploads/" + image
      );
      return cloudinaryResponse.secure_url;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
})();
