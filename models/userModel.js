const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    aadharCard:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
},{timestamps:true});


userSchema.pre('save',async function(next){
    //console.log(this);
    if(!this.isModified('password')) return next();
    
    this.password= await bcrypt.hash(this.password,12);
    next();
})

userSchema.methods.correctPassword=async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
};

const User=mongoose.model('User',userSchema);
module.exports=User;