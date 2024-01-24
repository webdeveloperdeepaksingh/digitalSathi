'use client';
import React, {createContext, useState} from "react";

export const UserContext = createContext();

export const GlobalState = ({children}) =>{
    const [loggedInUser, setLoggedInUser] = useState('');
    return (
        <UserContext.Provider value={{loggedInUser, setLoggedInUser}}>
            <div>
                {children}
            </div>
        </UserContext.Provider>
    )
}

