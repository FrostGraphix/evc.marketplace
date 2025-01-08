const userModel = require('../../models/userModel');

// Remove Document from a User
async function removeDocument(req, res) {
    try {
        const { userId, documentId } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }

        // Remove document by ID
        user.documents = user.documents.filter(doc => doc._id.toString() !== documentId);
        await user.save();

        res.status(200).json({
            message: "Document removed successfully.",
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

module.exports = removeDocument;
