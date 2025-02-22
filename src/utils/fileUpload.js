import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET 
});

    const uploadOnCloudinary = async (localFilePath) =>{
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
            fs.unlink(localFilePath) //remove the locally saved temporary file as cloud upload operation failed
            return null
        }
    }
    export{uploadOnCloudinary}

/*cloudinary.v2.uploader.upload('https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',{ public_id: 'shoes'},
    function (error,result) {
        console.log(result)})*/
       
    
    