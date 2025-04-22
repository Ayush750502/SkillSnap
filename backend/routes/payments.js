const express = require("express");
const router = express.Router();

const { capturePayment, verifyPayment } = require("../controllers/payments");
const {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} = require("../middleware/auth");

// router.post('/capturePayment', auth, isStudent, capturePayment);
// router.post('/verifyPayment', auth, isStudent, verifyPayment);

router.post("/capturePayment", auth, isStudent, async (req, res) => {
  res.json({ capturePayment: "true" });
});
router.post("/verifyPayment", auth, isStudent, async (req, res) => {
  res.json({ verifypayment: "true" });
});

module.exports = router;
