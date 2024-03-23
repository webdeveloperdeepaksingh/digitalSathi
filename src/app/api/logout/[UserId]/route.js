import { NextResponse } from "next/server";

export const  GET = async (request, {params}) =>{
try 
    {
        if(typeof window === "undefined"){
            request.cookies.delete('loggedInUserToken');
        }
        
        return null;
    } catch (error) {
        
    }
}