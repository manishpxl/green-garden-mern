const fs = require('fs');

const writeDataToFileUsingfileSystem = () => {
    const plantsArray = [
        {
            plantName: "Aloe Vera",
            description: "Medicinal plant",
            price: 250,
            stockQuantity: 15,
            category: "Succulent"
        },
        {
            plantName: "Snake Plant",
            description: "Air purifying plant",
            price: 300,
            stockQuantity: 20,
            category: "Succulent"
        }
    ];

    try {
        const dataString = JSON.stringify(plantsArray, null, 2);
        fs.writeFileSync('plantsData.json', dataString);
        console.log("Data has been written to plantsData.json");
    } catch (error) {
        console.error("Error writing to plantsData.json:", error);
    }
};

const readDataAndPrintUsingfileSystem = () => {
    try {
        const rawData = fs.readFileSync('plantsData.json', 'utf-8');
        const readData = JSON.parse(rawData);

        readData.forEach((plant) => {
            console.log("Plant Info:", plant);
        });
    } catch (error) {
        console.error("Error reading from plantsData.json:", error);
    }
};

module.exports = {
    writeDataToFileUsingfileSystem,
    readDataAndPrintUsingfileSystem
};
