import { NextResponse } from "next/server";

export function middleware(request){

    const authToken = request.cookies.get('token')?.value;
    const noAccessPath = request.nextUrl.pathname.startsWith('/dashboard');

    if(noAccessPath){
        if(!authToken){
            return new NextResponse("You are not logged in. Please sign in to access the dashboard.", {status: 401});
        }
        // If authToken exists or the path doesn't start with /dashboard, proceed as usual.
        return NextResponse.next();
    }
}

export const config = {
    matcher:[
        "/dashboard/:path*"
    ]
}