import { NextResponse } from "next/server";
import { writeFile} from 'fs/promises'; 

export const POST = async (req) => {
try 
    {
        const data = await req.formData();
        const file = data.get('image');
        const fileName = data.get('fileName');
 
        if (!file) {
            return NextResponse.json({ message: 'No image found', success: false });
        }
        
        const imageData = await file.arrayBuffer();
        const buffer =  Buffer.from(imageData);
        const path = `./public/images/${fileName}`;
        await writeFile(path, buffer);

        return NextResponse.json({ result: 'Image uploaded successfully', success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Image upload failed', success: false });
    }
}
