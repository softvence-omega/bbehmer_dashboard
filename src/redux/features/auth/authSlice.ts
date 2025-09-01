import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type TUser = {
    email:string,
    name:string,
    isAdmin:boolean,
    isSuspend:boolean,
    iat:number,
    exp:number
}

type TInitialState = {
  user: null | TUser;
  token: null | string;
};

const initialState :TInitialState = {
    user:null,
    token:null
}



const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser : (state,action) =>{
            const {user,token} = action.payload;
            state.user = user;
            state.token = token
        },
        logOut: (state) =>{
            state.user = null;
            state.token = null
        }
    }
});

export const {setUser,logOut} =  authSlice.actions;

export const useCurrentToken = (state:RootState) => state.auth.token;

export const seletCurrentUser = (state:RootState) => state.auth.user;

export default authSlice.reducer;