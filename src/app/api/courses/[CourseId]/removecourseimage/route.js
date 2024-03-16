import { NextResponse } from 'next/server';
import { Products } from '../../../../../../models/Products';

export const DELETE = async (req, { params }) => {
try 
    {
        const courseId = params.CourseId;
        const record = { _id: courseId };
        await connect(); 

        await Products.updateOne(record, { $unset: { prodImage: 1 } });
        return NextResponse.json({message: 'Image removed successfully', success: true}, { status: 200 });

    } catch (error) {
        return NextResponse.json({message: 'Error removing image', success: false,});
    }
};

