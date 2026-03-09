const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'usersData.json');
let usersData = [];

// Reading Data from JSON File
if (fs.existsSync(dataFilePath)) {
    try {
        const rawData = fs.readFileSync(dataFilePath, 'utf-8');
        if (rawData) {
            usersData = JSON.parse(rawData);
        }
    } catch (err) {
        console.error("Error reading usersData.json:", err);
    }
}

const saveUsersData = () => {
    fs.writeFileSync(dataFilePath, JSON.stringify(usersData, null, 2));
};

const register_fs = (req, res) => {
    try {
        const { username, email, mobileNumber, password, userRole } = req.body;

        // Check if email already exists
        const existingUser = usersData.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ error: true, message: 'User already exists' });
        }

        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            mobileNumber,
            password,
            userRole
        };

        usersData.push(newUser);
        saveUsersData();

        return res.status(201).json({ error: false, message: 'User Registered Successfully', data: newUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const login_fs = (req, res) => {
    try {
        const { email, password } = req.body;

        const user = usersData.find(u => u.email === email);
        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(400).json({ error: true, message: 'Invalid credentials' });
        }

        // Exclude password for response
        const { password: pwd, ...userWithoutPassword } = user;
        return res.status(200).json({ error: false, message: 'Login successful', data: userWithoutPassword });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const resetPassword_fs = (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const userIndex = usersData.findIndex(u => u.email === email);
        if (userIndex === -1) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        usersData[userIndex].password = newPassword;
        saveUsersData();

        return res.status(200).json({ error: false, message: 'Password reset successful' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllUsers_fs = (req, res) => {
    try {
        const usersWithoutPasswords = usersData.map(user => {
            const { password, ...rest } = user;
            return rest;
        });
        return res.status(200).json({ error: false, message: 'All users retrieved', data: usersWithoutPasswords });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register_fs,
    login_fs,
    resetPassword_fs,
    getAllUsers_fs
};
