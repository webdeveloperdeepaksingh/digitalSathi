import { NextResponse } from "next/server";
import connect from "../../../../server";
import Payments from "../../../../models/Payments";
import Users from "../../../../models/Users";

export const GET = async (request) => {
try 
    {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        await connect();
        const user = await Users.findOne({ _id: userId });
        let paymentList = await Payments.find();

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); 

        paymentList = paymentList.filter((pymt) => {
            const paymentMonth = pymt.createdAt.getMonth();
            return ((user.usrRole === 'ADMIN' || pymt.userId === userId) && paymentMonth === currentMonth);
        });
        return new NextResponse(JSON.stringify({ paymentList }), { status: 200 });
    } catch (error) {
        return new NextResponse("Error while fetching srevenue data: " + error, { status: 500 });
    }
};