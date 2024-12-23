import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({ 
    cloud_name: dag2snskj, 
    secure: true 
});

const url = cloudinary.url('MariaIndia')

console.log(url)
