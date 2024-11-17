const mongoose= require('mongoose');

const connectRequestSchema=new mongoose.Schema({
    fromUserID: {
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:['accepted', 'rejected', 'ignored', 'interested'],
            message:`{VALUE} is not defined`
        },
        required:true
    }
},
{
    timestamps:true
})

connectRequestSchema.index({ fromUserID: 1, toUserID: 1 });

connectRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    // Check if the fromUserId is same as toUserId
    if (connectionRequest.fromUserID.equals(connectionRequest.toUserID)) {
      throw new Error("Cannot send connection request to yourself!");
    }
    next();
});

const connectionModel = new mongoose.model("connectionModel",connectRequestSchema);
module.exports=connectionModel