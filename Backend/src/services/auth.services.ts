import mongoose from "mongoose";
import userModel from "../models/user.model";
import AccountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/roles-permission.model";
import { Roles } from "../enums/role.enum";
import { NotFoundException } from "../utils/appError";
import MemberModel from "../models/member.model";
export const loginOrCreateAccountService = async (data:{
    provider:string;
    displayName:string;
    providerId:string;
    picture?:string;
    email?:string;
})=>{
    const {providerId,provider,displayName,picture,email}=data;
    const session = await mongoose.startSession();
    // Simulate a database call to find or create an account
    try{
        session.startTransaction();
        console.log("started session")
            let user= await userModel.findOne({email:email}).session(session);
            if(!user){
                user = new userModel({
                    email,
                    name:displayName,
                    profilePicture:picture || null,
                });
                await user.save({session});
                const account = new AccountModel({
                    userId:user._id,
                    provider:provider,
                    providerId:providerId,
                });
                await account.save({session});
                const workspace = new WorkspaceModel({
                    name:`${user.name}'s Workspace`,
                    description:`${user.name}'s Workspace`,
                    owner:user._id,
                })
                await workspace.save({session});
                const ownerRole= await RoleModel.findOne({
                    name:Roles.OWNER,
                }).session(session)
                if(!ownerRole){
                    throw new NotFoundException("Owner role not found")
                }
                const member = new MemberModel({
                    userId:user._id,
                    workspace:workspace._id,
                    role:ownerRole._id,
                    joinedAt:new Date(),
                })
                await member.save({session});
                user.currentWorkspace= workspace._id as mongoose.Types.ObjectId;
                await user.save({session});
            }
            await session.commitTransaction();
            session.endSession();
            console.log("End Session");
            return {user}
        }
    catch(error){
        await session.abortTransaction();
        session.endSession();
        console.log("End Session with error",error);
        throw error;
    }
    finally{
        session.endSession();
    }
}