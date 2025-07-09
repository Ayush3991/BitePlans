const Transaction = require('../models/Transaction');

// GET /api/v1/transactions/:id
const getTransactionById = async (req, res) => {
  try {
    // Extract transaction ID from request parameters
    const transactionId = req.params.id;

    // Find the transaction from the database
    const transaction = await Transaction.findOne({ orderId });

    // If transaction not found
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Return the found transaction
    return res.status(200).json({
      success: true,
      transaction
    });

  } catch (err) {
    // Catch any database errors
    console.error('Error while fetching transaction:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching transaction'
    });
  }
};

module.exports = { getTransactionById };
