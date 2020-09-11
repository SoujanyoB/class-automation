//Mongoose configuration
const mongoose= require('mongoose');

mongoose.Promise= global.Promise;                
mongoose.connect( 'mongodb://localhost:27017/ClassAutomation',{ useNewUrlParser: true },{ useUnifiedTopology: true });

module.exports={
    mongoose:mongoose
}