const mongoose = require('mongoose');

var RoutineSchema= new mongoose.Schema({
    subjects:[{                                   //verifying user has access to do something when he makes a request
        subjectName:{
            type: String,
        },
        subjectStartTime:{
            type: String,
        }
    }],
    _creator:{
        type:String
    }
    

})

var Routine= mongoose.model('Routine',RoutineSchema)

module.exports= {
    Routine
}