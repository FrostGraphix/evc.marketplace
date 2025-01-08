const userModel = require('../../models/userModel');

// Add Document for a User
async function addDocument(req, res) {
    try {
        const { userId, link, price, location } = req.body;

        // Validate Input
        if (!userId || !link || !price || !location) {
            return res.status(400).json({ message: "All fields are required.", success: false });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }

        // Add document
        user.documents.push({ link, price, location });
        await user.save();

        res.status(200).json({
            message: "Document added successfully.",
            success: true,
            data: user.documents,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || "Internal Server Error.",
            success: false,
        });
    }
}

module.exports = addDocument;
