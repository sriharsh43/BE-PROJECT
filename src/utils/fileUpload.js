import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET 
});

    /*const uploadOnCloudinary = async (localFilePath) =>{
        try {
            if(!localFilePath) return null
            //upload on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type : 'auto'
            })
            //file has been uploaded
            console.log("File is uploaded on cloudinary");
            console.log(response.url);
            return response
             
        } catch (error) {
            fs.unlinkSync(localFilePath) //remove the locally saved temporary file as cloud upload operation failed
            return null
        }
    }
    export{uploadOnCloudinary}*/
    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if (!localFilePath) return null;
    
            // Upload to Cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: 'auto'
            });
    
            console.log("✅ File uploaded on Cloudinary:", response.url);
    
            // Delete the local file
            fs.unlink(localFilePath, (err) => {
                if (err) {
                    console.error("❌ Failed to delete local file:", err);
                } else {
                    console.log("🗑️ Local file deleted successfully.");
                }
            });
    
            return response;
        } catch (error) {
            console.error("❌ Cloudinary upload failed:", error);
    
            // Ensure local file is deleted even if upload fails
            if (fs.existsSync(localFilePath)) {
                fs.unlink(localFilePath, (err) => {
                    if (err) console.error("❌ Failed to delete local file:", err);
                });
            }
    
            return null;
        }
    };
    export{uploadOnCloudinary}
/*cloudinary.v2.uploader.upload('https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',{ public_id: 'shoes'},
    function (error,result) {
        console.log(result)})*/
       
    
    