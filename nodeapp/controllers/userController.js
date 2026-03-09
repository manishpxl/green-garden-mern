const User = require('../models/user');
const { generateToken } = require('../middleware/auth');

const addUser = async (req, res) => {
    try {
        console.log(req.body)
        const newUser = await User.create(req.body);
        res.status(201).json({ message: "Success", user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserByEmailAndPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = generateToken(user._id);

        // Exclude password from the response
        user.password = undefined;

        res.status(200).json({ message: "Success", token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addUser,
    getUserByEmailAndPassword
};
