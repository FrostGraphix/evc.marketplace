const likedProductModel = require("../../models/likedProduct");

const deleteLikedProductController = async (req, res) => {
  try {
    // Extract product ID from request body
    const { productId } = req.body;
    const currentUser = req.userId; // Get user ID from authToken middleware

    // Check if the user is authenticated
    if (!currentUser) {
      return res.status(401).json({
        message: "Please Login to delete liked product.",
        success: false,
        error: true,
      });
    }

    // Check if the liked product exists for the user
    const likedProduct = await likedProductModel.findOne({
      productId,
      userId: currentUser,
    });

    if (!likedProduct) {
      // If the product does not exist in liked products
      return res.status(404).json({
        message: "Liked product not found.",
        success: false,
        error: true,
      });
    }

    // Delete the liked product from the database
    await likedProductModel.deleteOne({ productId, userId: currentUser });

    // Return success response
    res.json({
      message: "Liked product deleted successfully.",
      success: true,
      error: false,
    });
  } catch (err) {
    // Handle any errors
    res.status(500).json({
      message: err.message || "Internal Server Error",
      success: false,
      error: true,
    });
  }
};

module.exports = deleteLikedProductController;
