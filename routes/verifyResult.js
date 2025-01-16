const express = require('express');
const router = express.Router();
const Result = require('../model/Result');

// Route to handle result verification and access
router.post('/verifyResult', async (req, res) => {
  const { semester, level } = req.body;
  const regNo = req.session.regNo;

  // const semester = "1"
  // const regNo = "20191100001"
  // const level= "100"
  console.log(regNo, semester, level)
  try {
    // Find the result based on the provided regNo, semester, and level
    const result = await Result.find({ regNo, semester, level });

    // If no result found, return error message
    if (!result || result == []) {
      return res.status(404).json({ message: 'No result found for the specified semester and level' });
    }

    // Store result in session for later access after face verification
    req.session.result = result;

    console.log(result)
    // If result is found, return it to the client
    res.status(200).json({ message: 'Proceed to face verification', result: result });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while verifying the result', error: err.message });
  }
});


module.exports = router;
