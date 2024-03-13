import { NextResponse } from "next/server";
import Enquiries from "../../../../models/Enquiries";
import connect from "../../../../server";
import Users from "../../../../models/Users";

export const GET = async (request) => {
try 
    {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        await connect();
        const user = await Users.findOne({ _id: userId });
        let enquiryList = await Enquiries.find();

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); 

        enquiryList = enquiryList.filter((enquiry) => {
            const enquiryMonth = enquiry.createdAt.getMonth();
            return ((user.usrRole === 'ADMIN' ||enquiry.userId === userId) && enquiryMonth === currentMonth);
        });
        return new NextResponse(JSON.stringify({ enquiryList }), { status: 200 });
    } catch (error) {
        return new NextResponse("Error while fetching data: " + error, { status: 500 });
    }
};
