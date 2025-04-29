import mongoose , { Document, Schema } from 'mongoose';
import { comparePassword,hashPassword } from '../utils/bcrypt';
export interface UserDocument extends Document {
    name:string;
    email:string;
    password?:string;
    profilePicture:string | null;
    isActive:boolean;
    lastLogin:Date | null;
    createdAt:Date;
    updatedAt:Date;
    currentWorkspace:mongoose.Types.ObjectId | null;
    comparePassword(value:string):Promise<boolean>;
    omitPassword():Omit<UserDocument,"password">;
}

const userSchema = new Schema<UserDocument>({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        select:true,
    },
    profilePicture:{
        type:String,
        default:null,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    lastLogin:{
        type:Date,
        default:null,
    },
    currentWorkspace:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace",
    }
},{
    timestamps:true,// this will help us to create the createdAt and updatedAt fields automatically
});

// ONe important thing to add here , before when we uset he find or the create for a certain user , we used to hash the password in each function but another good option is to use the 
// pre hook of the mongoose which will help us to hash the password before saving it to the database. because the model.pre("save") will be called internally everytime we save the user to the database

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        if(this.password){
            this.password= await hashPassword(this.password);
        }
    }
    next();
})

userSchema.methods.omitPassword= function():Omit<UserDocument,"password">{
    const userObject=this.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.methods.comparePassword= async function(value:string):Promise<boolean>{
        return comparePassword(value,this.password);
}

const userModel = mongoose.model<UserDocument>("User",userSchema);
export default userModel;