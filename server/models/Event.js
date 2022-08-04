const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    id:{
        type:Number,
        required:true,
    },
    temperature:{
        type: Number,
        required:true,
    },
    humidity:{
        type: Number,
        required:true,
    },
    readingId:{
        type: String,
        required:true,
    }
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;