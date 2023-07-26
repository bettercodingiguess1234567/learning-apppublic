const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
require('dotenv').config();
const { validateToken } = require('../middlewares/auth');

router.post("/register", async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object().shape({
        name: yup
        .string()
        .trim()
        .matches(/^[a-z ,.'-]+$/i)
        .min(3).max(50)
        .required(),
    email: yup.string().trim().email().max(50).required(),
    password: yup.string().trim().min(8).max(50).required(),
    contactNumber: yup.string().trim().max(20).optional(), // Add contactNumber validation
  });


    try {
        await validationSchema.validate(data,
            { abortEarly: false, strict: true });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    // Hash passowrd
    data.password = await bcrypt.hash(data.password, 10);

    // Trim string values
    data.name = data.name.trim();
    data.email = data.email.trim().toLowerCase();
    data.password = data.password.trim();
    data.contactNumber = data.contactNumber?.trim(); // Trim contact number if provided

    // Check email
    let user = await User.findOne({
        where: { email: data.email }
    });
    if (user) {
        res.status(400).json({ message: "Email already exists." });
        return;
    }

    // Create user
    let result = await User.create(data);
    res.json(result);
});




router.post("/login", async (req, res) => {
    let data = req.body;

    // Trim string values
    data.email = data.email.trim().toLowerCase();
    data.password = data.password.trim();

    // Validate request body
    let validationSchema = yup.object().shape({
        email: yup.string().trim().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
    });

    try {
        await validationSchema.validate(data, { abortEarly: false, strict: true });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    // Check email and password
    let errorMsg = "Email or password is not correct.";
    let user = await User.findOne({
        where: { email: data.email }
    });

    if (!user) {
        res.status(400).json({ message: errorMsg });
        return;
    }

    let match = await bcrypt.compare(data.password, user.password);

    if (!match) {
        res.status(400).json({ message: errorMsg });
        return;
    }

    // Return user info
    let userInfo = {
        id: user.id,
        email: user.email,
        name: user.name
    };
    let accessToken = sign(userInfo, process.env.APP_SECRET);

    res.json({
        accessToken: accessToken,
        user: userInfo
    });
});


router.get("/auth", validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
    };
    res.json({
        user: userInfo
    });
});
module.exports = router;