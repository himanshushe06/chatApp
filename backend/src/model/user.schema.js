import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    avatar:{
        type:String,
        default:""
    },

    lastSeen:{
        type:Date,
        default:Date.now
    },

    blockedUsers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    ],
    about: {
        type: String,
        default: "Hey there! I am using Chat App."
    },
},
{
    timestamps:true
}
);
const userModule = mongoose.model("User",userSchema);
export default userModule;