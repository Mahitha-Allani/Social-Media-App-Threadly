import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
{
  senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  receiverId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  text:{
    type:String,
    default:""
  },
  postId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post",
    default:null
  },
  profileId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    default:null
  },
  read:{
    type:Boolean,
    default:false
  }
},
{
  timestamps:true
}
);

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
