const axios = require('axios')

exports.getNutritionData = async (req, res) => {
    try{
        const response = await axios.post(
            'https://nal.altarama.com/reft100.aspx?key=FoodData',
            { query: req.body.query},
            {
                headers: {
                    'x-app-id': process.env.APP_ID,
                    'x-app-key': process.env.API_KEY,
                },
            }
        )
        res.json(response.data)
    } catch(error){
        res.status(500).json({error: 'API call failed'})
    }
}