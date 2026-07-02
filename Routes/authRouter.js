import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../Models/userschema.js';

const client = new OAuth2Client(process.env.googlecilentID);

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'User already exists' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ success: true, user: { _id: user._id, name, email } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (!user.password) return res.status(400).json({ message: 'Invalid credentials. Try logging in with Google.' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.jwtsecret || 'secret', { expiresIn: '1d' });
        res.status(200).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.googlecilentID,
        });
        
        const payload = ticket.getPayload();
        const { email, name, sub } = payload;
        
        let user = await User.findOne({ email });
        
        if (!user) {
            user = await User.create({ name, email, role: 'user' });
        }
        
        const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.jwtsecret || 'secret', { expiresIn: process.env.jwtexpiry || '1d' });
        res.status(200).json({ success: true, token: jwtToken, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ success: false, message: 'Google Authentication failed' });
    }
});

export default router;
