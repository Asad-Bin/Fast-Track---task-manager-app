

import asyncHandler from 'express-async-handler';
import User from '../models/auth/userModel.js';
import generateToken from '../helpers/generateToken.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    //validation
    if (!name || !email || !password) {
        // 400 Bad Request
        res.status(400).json({ message: "All fields are required" });
    }

    // check password length
    if (password.length < 6) {
        return res 
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        // bad request
        return res.status(400).json({ message: "User already exists" });
    }

    // create new user
    const user = await User.create({
        name,
        email,
        password,
    });

    // generate token with user id
    const token = generateToken(user._id);

    // send back the user and token in the response to the client
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "none", // cross-site access --> allow all third-party cookies
        secure: true,
    });

    if (user) {
        const { _id, name, email, role, photo, bio, isVerified } = user;

        // 201 Created
        res.status(201).json({
        _id,
        name,
        email,
        role,
        photo,
        bio,
        isVerified,
        token,
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
});

// user login
export const loginUser = asyncHandler(async (req, res) => {
// get email and password from req.body
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
        // 400 Bad Request
        return res.status(400).json({ message: "All fields are required" });
    }

    // check if user exists
    const userExists = await User.findOne({ email });

    if (!userExists) {
        return res.status(404).json({ message: "User not found, sign up!" });
    }

    // console.log(userExists);
    // console.log(password);

    // check id the password match the hashed password in the database
    const isMatch = await bcrypt.compare(password, userExists.password);

    if (!isMatch) {
        // 400 Bad Request
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token with user id
    const token = generateToken(userExists._id);

    if (userExists && isMatch) {
        const { _id, name, email, role, photo, bio, isVerified } = userExists;

        // set the token in the cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: "none", // cross-site access --> allow all third-party cookies
            secure: true,
        });

        // send back the user and token in the response to the client
        res.status(200).json({
            _id,
            name,
            email,
            role,
            photo,
            bio,
            isVerified,
            token,
        });
    } else {
        res.status(400).json({ message: "Invalid email or password" });
    }
});


// logout user
export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token");

    res.status(200).json({ message: "Logged out successfully" });
});

// get user profile
export const getUser = asyncHandler(async (req, res) => {
    // get user details from the token -> 
    const user = await User.findById(req.user._id).select("-password");

    if(user){
        res.status(200).json(user);
    } else{
        res.status(404).json({message: "User not found"});
    }
});

// update user
export const updateUser = asyncHandler(async (req, res) => {
    // get user deatails from token --> protect middleware
    const user = await User.findById(req.user._id);

    if(user){
        // // user properties to update
        // const { name, bio, photo } = req.body;

        // update user properties
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.photo = req.body.photo || user.photo;
        user.bio = req.body.bio || user.bio;

        // save the updated user details
        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            photo: updatedUser.photo,
            bio: updatedUser.bio,
            isVerified: updatedUser.isVerified,
        });
    } else{
        res.status(404).json({message: "User not found"});
    }
});
