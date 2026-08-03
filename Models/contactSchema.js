import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true
    },
    subject: {
        type: String,
        trim: true,
        default: ''
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true
    },
    meetingStatus: {
        type: String,
        enum: ['none', 'scheduled', 'completed', 'cancelled'],
        default: 'none'
    },
    meetingDate: {
        type: Date
    },
    meetingNotes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
