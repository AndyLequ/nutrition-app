const express = require("express");
const router = express.Router();
const { getNutritionData } = require("../controllers/nutritionController");

const axios = require("axios");

axios
  .get("https://api.nal.usda.gov/fdc/v1/foods/list")
  .then((response) => {
    console.log("Data", response.data);
  })
  .catch((error) => {
    console.error("Error", error.message);
  });

// router.get('/foods', (req,res) => {
//     // res.json({id: 1, name: 'pineapple'})
// })

// router.post('/foods')
module.exports = router;
