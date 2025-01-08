const userModel = require('../../models/userModel');

// Fetch Documents for Logged-in User
async function getDocuments(req, res) {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }

        res.status(200).json({
            message: "Documents fetched successfully.",
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

module.exports = getDocuments;
