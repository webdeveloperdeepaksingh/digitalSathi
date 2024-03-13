import { NextResponse } from "next/server";
import connect from "../../../../server";
import Participents from "../../../../models/Participents";
import Users from "../../../../models/Users";

export const GET = async (request) => {
try 
    {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        await connect();
        const user = await Users.findOne({ _id: userId });
        let eventList = await Participents.find();

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); 

        eventList = eventList.filter((evt) => {
            const eventMonth = evt.createdAt.getMonth();
            return ((user.usrRole === 'ADMIN' || evt.userId === userId) && eventMonth === currentMonth);
        });
        return new NextResponse(JSON.stringify({ eventList }), { status: 200 });
    } catch (error) {
        return new NextResponse("Error while fetching data: " + error, { status: 500 });
    }
};