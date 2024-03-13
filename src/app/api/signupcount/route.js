import { NextResponse } from "next/server";
import connect from "../../../../server";
import Users from "../../../../models/Users";

export const GET = async (request) => {
try 
    {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        await connect();
        const user = await Users.findOne({ _id: userId });
        let userList = await Users.find();

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); 

        userList = userList.filter((usrCount) => {
            const userMonth = usrCount.createdAt.getMonth();
            return ((user.usrRole === 'ADMIN' || usrCount.userId === userId) && userMonth === currentMonth);
        });
        return new NextResponse(JSON.stringify({ userList }), { status: 200 });
    } catch (error) {
        return new NextResponse("Error while fetching revenue data: " + error, { status: 500 });
    }
};