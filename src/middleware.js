import { NextResponse } from "next/server";

export default function middleware(request){    
    
    const noAccessPath = request.nextUrl.pathname.startsWith('/dashboard');
    const authToken = request.cookies.get("token");
 
    if(noAccessPath){
        if(!authToken || authToken.value === "undefined"){
            return new NextResponse("You are not logged in. Please sign in to access the dashboard.", {status: 401});
        }
        // If authToken exists or the path doesn't start with /dashboard, proceed as usual.
        return NextResponse.next();
    }
}

export const config = {
    matcher:[
        "/dashboard/:path*"
    ],
};
    
