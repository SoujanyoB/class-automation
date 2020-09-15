var {User}=require('./../models/user');

    var authenticate=(req,res,next)=>{

        var token = req.params.token;         //gets value of token, (key=x-auth) while res.header sets value
        User.findByToken(token).then((user) => {    
            if(!user)
            {
                return Promise.reject();          //user not found, promise rejected so 401 sent back
            }
            req.user=user;                        //req object modified instead of simply sending user back, so modified req object used in server.js
            req.token=token;
            next();                               //everything went well, so app can continue
        }).catch((err) => {
            res.status(401).send('Please sign up or log in to view the home page');               //jwt not verified
        });
    }

    module.exports={authenticate};