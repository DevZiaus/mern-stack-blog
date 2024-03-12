import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required'));
    }
    // if (req.body.password.length < 8) {
    //     return next(errorHandler(400, 'Password must be at least 8 characters'));
    // }
    // if (req.body.username.length < 7 || req.body.username.length > 20) {
    //     return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
    // }
    // if (req.body.username.includes(' ')) {
    //     return next(errorHandler(400, 'Username can not contain spaces'));
    // }
    // if (req.body.username !== req.body.username.toLowerCase()) {
    //     return next(errorHandler(400, 'Username must be lowercase'));
    // }
    // if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
    //     return next(errorHandler(400, 'Username can contain only letters and numbers'));
    // }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User ({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.json('Sign Up Successfull');
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } =req.body;

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required'));
    }

    try {
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHandler(404, 'Wrong Credentials'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        
        if (!validPassword) {
            return next(errorHandler(400, 'Wrong Credentials'));
        }

        const token = jwt.sign(
            { id: validUser._id},
            process.env.JWT_SECRET,
        );

        const {password:pass, ...rest} = validUser._doc;

        res.status(200)
        .cookie('access_token', token, {
            httpOnly: true,
        })
        .json(rest);
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({email});
        if (user) {
            const token = jwt.sign({
                id: user._id},
                process.env.JWT_SECRET,
            );
            const { password, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User ({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture:googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign({
                id: newUser._id
            },
            process.env.JWT_SECRET );
            const { password, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        }
    } catch (error) {
        next(error);
    }
}