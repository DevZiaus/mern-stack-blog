import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import User from '../models/user.model.js'

export const test = ( req, res ) => {
    res.json({Message: 'API is working'});
}

export const updateUser = async( req, res, next ) => {
    if (req.user.id !== req.params.userID) {
        return next(errorHandler(403, 'You are not allowed to update this user!'));
    }
    if (req.body.password) {
        if (req.body.password.length < 8) {
            return next(errorHandler(400, 'Password must be at least 8 characters'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        if (req.body.username.length < 5 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 5 and 20 characters'));
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username can not contain spaces'));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username can contain only letters and numbers'));
        }
    }
    if (req.body.name) {
        if (req.body.name.length < 5 || req.body.name.length > 20) {
            return next(errorHandler(400, 'Name must be between 5 and 20 characters'));
        }
        if (!req.body.name.match(/^[a-zA-Z\s]+$/)) { // Changed from username to name, allow spaces
            return next(errorHandler(400, 'Name can contain only letters'));
        }
    }
    
    if (req.body.bio) {
        if (req.body.bio.trim() === '') { // Ensures bio isn't just whitespace
            return next(errorHandler(400, 'Nothing written about yourself'));
        }
    }
    
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userID, {
            $set: {
                username: req.body.username,
                name: req.body.name,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
                bio: req.body.bio,
            },
        }, { new: true });
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async(req, res, next) => {
    if (req.user.id !== req.params.userID) {
        return next(errorHandler(403, 'You are not allowed to delete this user!'));
    }
    try {
        await User.findByIdAndDelete(req.params.userID);
        res.status(200).json('User has been deleted!!!')
    } catch (error) {
        next(error);
    }
};

export const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User has been signed out!');
    } catch (error) {
        next(error);
    }
};