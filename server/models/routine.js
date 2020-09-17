const mongoose = require('mongoose');

var subjectSchema= new mongoose.Schema({
    subjects:[{                                   //verifying user has access to do something when he makes a request
        subjectName:{
            type: String,
        },
        subjectStartTime:{
            type: String,
        }
    }]
})

var RoutineSchema= new mongoose.Schema({
    subjectsArr:[subjectSchema],
    _creator:{
        type:String
    }
    

})

var Routine= mongoose.model('Routine',RoutineSchema)

module.exports= {
    Routine
}