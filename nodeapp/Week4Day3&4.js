const fs = require('fs');

let dataArray = [];

const addData = (userData, callback) => {
    try {
        const { username, email, mobileNumber, password, userRole } = userData;
        const newUserData = { username, email, mobileNumber, password, userRole };
        dataArray.push(newUserData);
        if (callback) {
            callback(null, newUserData);
        }
    } catch (err) {
        console.error("Error adding user data:", err);
        if (callback) {
            callback(err, null);
        }
    }
};

const displayData = () => {
    dataArray.forEach((user, index) => {
        console.log(`User ${index + 1}:`, user);
    });
};

const callbackFunction = (err, addedUserData) => {
    if (err) {
        console.error("Error occurred:", err);
    } else {
        console.log("Successfully added user data:", addedUserData);
    }
};

const writeDataToFile = () => {
    const writeStream = fs.createWriteStream('userData.json');
    writeStream.write(JSON.stringify(dataArray, null, 2));
    writeStream.end();

    writeStream.on('finish', () => {
        console.log("Data has been written to 'userData.json' using streams.");
    });

    writeStream.on('error', (err) => {
        console.error("Error writing to file:", err);
    });
};

const readDataAndPrint = () => {
    const readStream = fs.createReadStream('userData.json', { encoding: 'utf-8' });
    let data = '';

    readStream.on('data', (chunk) => {
        data += chunk;
    });

    readStream.on('end', () => {
        try {
            if (data) {
                const parsedData = JSON.parse(data);
                console.log("User Information from file:", parsedData);
            }
        } catch (err) {
            console.error("Error parsing JSON data:", err);
        }
    });

    readStream.on('error', (err) => {
        console.error("Error reading file:", err);
    });
};

module.exports = {
    dataArray,
    addData,
    displayData,
    callbackFunction,
    writeDataToFile,
    readDataAndPrint
};
