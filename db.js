const mongoose = require('mongoose');
const mongoURI = 'mongodb://127.0.0.1:27017/myProject';

const mongoDB = async() => {
    try{
        const conn = await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}

    const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: (value) => {
                    return value.includes('@');
                },
                message: 'Invalid email format',
            },
        },
        age: {
            type: Number, 
            required: true,
            
        }
    });

const User = mongoose.model('User', userSchema);

module.exports = {User, mongoDB};


   