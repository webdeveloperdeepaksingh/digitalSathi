// import { NextResponse } from 'next/server';
// import { Products } from '../../../../../../models/Products';
// import connect from '../../../../../../server';
// import cloudinary from 'cloudinary'; 

// cloudinary.config({     //initialize cloudinary credentials.
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// export const PUT = async (req, {params}) => {
// try 
//     {     
//         const courseId = params.CourseId;
//         const { public_id } = await req.json();

//         await connect ();
//         const courseData = Products.findById(courseId)

//         if (!courseData) {
//             return NextResponse.json({ message: 'No course found with given ID', success: false }, {status:404});
//         }
     
//         if (!public_id) {
//             return NextResponse.json({ message: 'No image found', success: false });
//         }
    
//         const result = await cloudinary.v2.uploader.destroy(public_id, {
//             invalidate: true,
//             resource_type: "image"
//         });
    
//         if (result.result === 'ok') {
//             return NextResponse.json({ message: 'Image removed successfully', success: true }, { status: 200 });
//         } else {
//             return NextResponse.json({ message: 'Error removing image', success: false });
//         }
    
//     } catch (error) {
//         return NextResponse.json({ message: 'Error removing image', success: false });
//     }
// };

