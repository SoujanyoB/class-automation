//User model
const mongoose = require('mongoose');       //Requiring mongoose since it is called below
const validator = require('validator');
const jwt= require('jsonwebtoken');
const _=require('lodash');
const bcrypt=require('bcryptjs')

var UserSchema = new mongoose.Schema({      //Custom methods cannot be added to normal user method.Schema needed

    email:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        unique:true,                        //All emails should be unique
        validate:{
            // validator: (value)=>{
            //     return validator.isEmail(value);
            // },
            validator: validator.isEmail,
            message:'{VALUE} is not a valid email'
        }
    },
    password:{
        type: String,
        minlength:6,
        required:true
    },
        tokens:[{                                   //verifying user has access to do something when he makes a request
            access:{
                type: String,
                required:true
            },
            token:{
                type: String,
                required:true
            }
        }]
    
})

UserSchema.methods.toJSON = function(){             //Returns only email and id in the response body     

    var user=this;
    var userObject=user.toObject();

    return _.pick(userObject, ['_id','email']);
}

UserSchema.methods.generateAuthToken = function(){  //Instance methods can be added to UserSchema.methods

    var user=this;                                  //this keyword binds individual docs. Arrow functions not bounded to this keyword.
    var access = 'auth';                            //First element of tokens array
    var token =  jwt.sign({_id:user._id.toHexString(),access},'secret').toString(); //second element of tokens array
    
    user.tokens.push({access,token});               //Pushing the two elements into the array
    return user.save().then(() => {                 //saving changes made to user model
        return token;                               //token returned so that it can be accessed in server.js
    })
}     

UserSchema.methods.removeToken=function(token){     //instance method removes token from a user

    var user=this;                                  

    return user.update({                            //updates array of tokens,                                                                              
        $pull:{                                     //removes object from the array whose token property is token               
            tokens:{
                token:token
            }
        }
    })
}

UserSchema.statics.findByToken = function(token){   //model method, takes token value, returns user matching that token

    var User = this;                                //binding this to Model
    var decoded;                                    //stores decoded jwt value

    try {

        decoded =jwt.verify(token, 'secret');       //setting decoded value
    } catch (e) {                                   //if verification failed
        // return new Promise((resolve,reject)=>{

        //     reject();
        // })

        return Promise.reject();                    //if this code runs, promise fails and findOne defined below does not run                    

        
    }

    return User.findOne({                           //if try block is a success,search for that user

        '_id': decoded._id,     

        'tokens.token': token,                      //tokens array has object equal to token, nested object searched like this
        'tokens.access':'auth'          
    })
}

UserSchema.statics.findByCredentials=function(email,password){      //finds user matching these credentials

    var User=this;

    return User.findOne({email}).then((user) => {                   //find a user with that email
        
        if(!user)                                                   //if no user exists with that email
        {
            console.log('user not found');                          
            return Promise.reject();                                
        }

        return new Promise((resolve, reject) =>{                    //bcrypt only accepts callbacks, so promise has to be declared explicitly

            bcrypt.compare(password,user.password,(err,res)=>{      //compare provided password with hashed password

                console.log(res);
                if(res)                                             //if passwords match, return the user
                {
                    resolve(user);
                }

                else {
                    console.log('passwords dont match');            //else return error
                   reject();
                }

                })
        })
    })
}

UserSchema.pre('save',function(next){               //Mongoose middleware so we can perform something(generate hashed password) before an event(save)

    var user=this;

   if(user.isModified('password'))
   {
       bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{

                 user.password=hash;
                 next();
            
            })
        })
        
   } 
   else
   {
       next();
   }
})

var User=mongoose.model('User',UserSchema)

module.exports={
    User:User
}