import { NextResponse } from "next/server";
import {writeFile} from 'fs/promises';

export const POST = async (req) =>{

    const data = await req.formData();
    const file = data.get('pdfFile');
    const fileName = data.get('fileName');
    
    if(!file){
        return NextResponse.json({message:'No file found', success:false})
    }

    const fileData = await file.arrayBuffer();
    const buffer = await Buffer.from(fileData);
    const path = `./public/pdf/${fileName}`
    await writeFile(path, buffer);
    return NextResponse.json({message:'file uploaded', success:true})
}