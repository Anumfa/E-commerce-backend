import Contact from '../Models/contactSchema.js';

// Create a new contact submission (from frontend)
export const createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
        }

        const newContact = await Contact.create({
            name: name.trim(),
            email: email.trim(),
            subject: subject?.trim() || '',
            message: message.trim()
        });

        res.status(201).json({ success: true, data: newContact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all contact submissions (for admin)
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single contact by ID
export const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.status(200).json({ success: true, data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Set meeting for a contact
export const setMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const { meetingDate, meetingNotes } = req.body;

        if (!meetingDate) {
            return res.status(400).json({ success: false, message: 'Meeting date is required' });
        }

        const contact = await Contact.findByIdAndUpdate(
            id,
            {
                meetingStatus: 'scheduled',
                meetingDate: new Date(meetingDate),
                meetingNotes: meetingNotes || ''
            },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }

        res.status(200).json({ success: true, data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update meeting status
export const updateMeetingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { meetingStatus } = req.body;

        if (!['none', 'scheduled', 'completed', 'cancelled'].includes(meetingStatus)) {
            return res.status(400).json({ success: false, message: 'Invalid meeting status' });
        }

        const contact = await Contact.findByIdAndUpdate(
            id,
            { meetingStatus },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }

        res.status(200).json({ success: true, data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a contact submission
export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.status(200).json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
