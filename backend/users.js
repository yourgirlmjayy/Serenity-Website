import express from 'express';
import bcrypt from 'bcryptjs/dist/bcrypt';
import {User} from '/user.js'

const router = express.Router();
const saltRounds = 10;

//route for user registration 
router.post('/users', async (req, res) => {
    const { email, password, name } = req.body;
    
    try {
        // check if current email exists
        const existingUser = await prisma.user.findFirst({
            where: {OR: [{email}]}
        });

        if (existingUser) {
            return res.status(400).json({error: "Username already exists"});
        }

        // if user is new, encrpyt the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //create new user in database
        const newUser = await prisma.user.create({
            data: {
              email,
              name: name ?? null,
              password: hashedPassword
            }
        });
        //return a successful response
        res.status(200).json(newUser);  

        // set the user in the session
        req.session.user = newUser;
        // return the user in the data response
        res.json({user: newUser});
    } catch (error) {
        console.error(error);
    
          //return 500 error in worst case scenario
          res.status(500).json({ error: "Failed to create user" });
      }
    
})

// Route for user login
router.post('/users/login', async (req, res) => {
    const {email, password} = req.body;
    
    try{
    // use Prisma to find a unique user record in the database where the email matches
    const user = await prisma.user.findUnique({
        where : { email }
    });
    
    // if email does not exist, throw an error
    if (!user) {
        return res.status(401).json({error: "Invalid username"});
    }
    // compare the password user types with the one in the database
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword) {
        return res.status(401).json({error: "Invalid password"})
    }

    //set the user in session 
    req.session.user = user;

    //return user data in response
    res.json({user});
    } catch(error){
        
    }


})