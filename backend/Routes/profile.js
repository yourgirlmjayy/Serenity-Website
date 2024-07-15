const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const express = require('express');
const router = express.Router();
const authenticateToken = require('../MiddleWare/authenticateToken');

router.post('/profile', authenticateToken, async (req, res) => {
    const { name, bio, age, birthday } = req.body;
    const userId = req.user.id;

    try {
        const profile = await prisma.profile.upsert({
            where: { userId: userId },
            update: {
                name,
                bio,
                age: parseInt(age),
                birthday: new Date(birthday)
            },
            create: {
                name,
                bio,
                age: parseInt(age),
                birthday: new Date(birthday),
                userId: userId
            }
        });
        res.json(profile);
    } catch (error) {
        console.error('Error saving profile: ', error.message);
        res.status(500).json({ error: 'Failed to save profile' })
    }
})


router.get('/user-profile', authenticateToken, async (req, res) => {

    const userId = req.user.id;
    try {
        let profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            profile = {
                name: "",
                bio: "",
                age: "",
                birthday: null,
            }
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile: ', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

module.exports = router;

