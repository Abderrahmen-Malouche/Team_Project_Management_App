import mongoose, { Document, Schema } from "mongoose";
import {
  ProviderEnumType,
  ProviderEnum,
} from "../enums/account-provider.enums";

export interface AccountDocument extends Document {
  provider: ProviderEnumType;
  providerId: string; // Store the email,googleId,githubId,facebookId
  userId: mongoose.Types.ObjectId;
  refreshToken: string | null;
  tokenExpiry: Date | null;
  createdAt: Date;
}

const accountSchema = new Schema<AccountDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  provider: {
    type: String,
    enum: Object.values(ProviderEnum),
    required: true,
  },
  providerId: {
    type: String,
    required: true,
    unique: true,
  },
  refreshToken:{
    type:String,
    default:null,
  },
  tokenExpiry:{
    type:Date,
    default:null
  }
},{
    timestamps:true,
    toJSON:{
        transform(doc,ret){
            delete ret.refreshToken;
        }
    }
});

const AccountModel= mongoose.model<AccountDocument>("Account",accountSchema);
export default AccountModel;