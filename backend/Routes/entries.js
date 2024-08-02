const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const express = require('express');
const router = express.Router();
const authenticateToken = require('../MiddleWare/authenticateToken');

// get all the categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.activityCategory.findMany({
      include: {
        options: true
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

router.post('/log-mood-activity', authenticateToken, async (req, res) => {

  // extract mood and activities from the request body
  const { mood, activities } = req.body
  const userId = req.user.id;

  // check if user id exists
  if (!userId) {
    return res.status(400).json({ error: "User ID not found!" });
  }
  //get date without time
  const today = new Date();
  // set time of the day to be midnight
  today.setHours(0, 0, 0, 0);

  try {
    //find or create the user entry for today 
    let userEntry = await prisma.userEntry.findFirst({
      where: {
        userId: userId,
        date: {
          // use greater than or equal to(gte) and less than(lt) to ensure it's within the current day
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      include: { moods: true, activities: true }
    });

    if (userEntry) {
      const userMoods = userEntry.moods || [];
      const userActivities = userEntry.activities || [];
      // return 400 status only if user already logged mood and activities
      if (userMoods.length > 0 && userActivities.length > 0) {
        return res.status(400).json({ error: "Mood and activities logged for today" });
      }
    } else {
      // create new entry if no userEntry is found for that day
      userEntry = await prisma.userEntry.create({
        data: {
          userId: userId,
          date: new Date()
        }
      });
    }


    if (mood) {
      // create new mood entry 
      const newMood = await prisma.mood.create({
        data: {
          mood: mood,
          userEntryId: userEntry.id
        }
      })
      await prisma.userEntry.update({
        where: { id: userEntry.id },
        data: {
          moods: { connect: { id: newMood.id } }
        }
      })
    }

    //create category or find categories and options
    for (const { category, option } of activities) {
      const activityOption = await prisma.activityOption.findFirst({
        where: {
          option,
          category: { category }
        }
      })

      if (activityOption) {
        const newActivity = await prisma.userActivity.create({
          data: {
            userEntryId: userEntry.id,
            activityOptionId: activityOption.id
          }
        })
        await prisma.userEntry.update({
          where: { id: userEntry.id },
          data: {
            activities: { connect: { id: newActivity.id } }
          }
        })
      }
    }

    res.status(201).json({ message: 'Mood and activities logged successfully!' })

  } catch (error) {
    console.error('Error logging mood and activities:', error);
    res.status(500).json({ error: 'Failed to log mood & activities' });
  }

})

module.exports = router;