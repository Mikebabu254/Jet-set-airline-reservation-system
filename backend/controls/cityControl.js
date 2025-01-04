const cityModel = require("../models/cityModel")

const addCity = async (req, res) => {
    const {cityCode,countryName,cityName,timeZone} = req.body;
    
    try{
        // res.json({msg: "city added"})
        const addCity = await cityModel.create({
            cityCode,countryName,cityName,timeZone
        })
        res.status(201).json(addCity);
    }catch(Error){
        console.log(Error)
    }
}

const viewCity= async (req, res)=>{
    try{
        const getCity = await cityModel.find()
        res.json(getCity)
    }catch(Error){
        console.log(Error)
    }
}

const countCity = async (req, res) =>{
    try{
        const numberOfCities = await cityModel.countDocuments();
        res.json({numberOfCities})
    }catch(Error){
        console.log("Error counting the numbers of cities")
    }
}

module.exports = {addCity, viewCity, countCity}