import { Schema, model } from "mongoose";

import bcrypt from 'bcrypt';

const SALT = 10; 

const userSchema = new Schema({

    username: {
        type: String,
        required: [true, "Username is required!"],
        minLength: [5, "Username must be at least 5 character long!"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        minLength: [10, "Email must to be 10 at lease!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minLength: [4, "Password must be at lease 4 char"]
    },
});

userSchema.pre('save',async function () {
    const hash = await bcrypt.hash(this.password, SALT);

    this.password = hash;
})

const User = model('User', userSchema);

export default User;