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
    // try {
    //     // Retrieve the existing user from the database
    //     const existingUser = await User.findById(req.params.userID);
    //     if (!existingUser) {
    //         return next(errorHandler(404, 'User not found'));
    //     }
    
    //     // Construct the updated links object by merging existing links with new links
    //     const updatedLinks = {
    //         ...existingUser.links, // Existing links from the database
    //         ...req.body.links // New links received in the request body
    //     };
    
    //     // Update the user document in the database
    //     const updatedUser = await User.findByIdAndUpdate(req.params.userID, {
    //         $set: {
    //             // Update other fields as needed
    //             username: req.body.username,
    //             name: req.body.name,
    //             email: req.body.email,
    //             profilePicture: req.body.profilePicture,
    //             password: req.body.password,
    //             bio: req.body.bio,
    //             links: updatedLinks // Set the updated links object
    //         }
    //     }, { new: true });
    
    //     // Respond with the updated user data
    //     const { password, ...rest } = updatedUser._doc;
    //     res.status(200).json(rest);
    // } catch (error) {
    //     next(error);
    // }
    
};

export const deleteUser = async(req, res, next) => {
    if (!req.user.role === 'admin' && req.user.id !== req.params.userID) {
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

  
export const getUsers = async (req, res, next) => {
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
        return next(errorHandler(403, 'You are not authorised to see all the users!'))
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt : sortDirection })
            .skip(startIndex)
            .limit( limit );

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();
        
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1,
            now.getDate()
        );

        const lastMonthsUsers = await User.countDocuments({
            createdAt : { $gte : oneMonthAgo }
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthsUsers
        });

    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next)=> {
    try {
        const user = await User.findById(req.params.userId);
        if(!user){
            return next(errorHandler(404, 'User not found'));
        }
        const { password, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}


// TODO: 
// Create User profile
// Add functionality to create user for admin
// Add functionality to edit user for admin