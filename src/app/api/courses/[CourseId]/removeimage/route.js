import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { Products } from '../../../../../../models/Products';

export const DELETE = async (req, { params }) => {
    try {
        const courseId = params.CourseId;
        const record = { _id: courseId };
        await connect(); 

        const pdt = await Products.findOne(record);
        const imgName = pdt.prodImage; 
        const imagePath = `./public/images/${imgName}`;
        await unlink(imagePath);

        await Products.updateOne(record, { $unset: { prodImage: 1 } });

        return NextResponse.json({message: 'Image removed successfully', success: true}, { status: 200 });
    } catch (error) {
        return NextResponse.json({message: 'Error removing image', success: false,});
    }
};

