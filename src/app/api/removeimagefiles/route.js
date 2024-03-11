import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';

export const POST = async (req) => {
try 
{
    const { imgName } = await req.json();

    if (!imgName) {
        return NextResponse.json({ message: 'No image name provided', success: false });
    }

    const imagePath = `./public/images/${imgName}`;
    await unlink(imagePath); // Delete the image

    return NextResponse.json({ message: 'Image removed successfully', success: true }, { status: 200 });
} catch (error) {
    return NextResponse.json({ message: 'Error removing image', success: false });
}
};
