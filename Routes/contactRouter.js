import express from 'express';
import {
    createContact,
    getAllContacts,
    getContactById,
    setMeeting,
    updateMeetingStatus,
    deleteContact
} from '../Controllers/contactController.js';

const router = express.Router();

router.post('/create', createContact);
router.get('/all', getAllContacts);
router.get('/:id', getContactById);
router.put('/meeting/:id', setMeeting);
router.put('/meeting-status/:id', updateMeetingStatus);
router.delete('/delete/:id', deleteContact);

export default router;
