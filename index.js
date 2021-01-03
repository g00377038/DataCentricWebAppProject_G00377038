var express = require('express');
//var mysql = require('promise-mysql');
var mySQL_DAO = require('./mySQL_DAO')
var mongo_DAO = require('./mongo_DAO')
var bodyParser = require('body-parser')
var app = express();

//specify default templating engine
app.set('view engine', 'ejs')

//set up bodyParser
app.use(bodyParser.urlencoded({ extended: false }))

//display button menu for home page when url ends with "/"
app.get('/', (req, res) => {
    console.log("GET on /")
    
    //render "goToButtons.ejs"
    res.render('goToButtons')
})

//display "ListCountries.ejs" when url ends with "/ListCountries"
app.get('/ListCountries', (req, res) => {
    mySQL_DAO.getCountries()
        .then((result) => {
            //render "showCountries.ejs"
            res.render('showCountries', {countries: result})
        })
        .catch((error) => {
            //display error
            res.send(error)
        })
})

//display "ListCities.ejs" when url ends with "/ListCities"
app.get('/ListCities', (req, res) => {
    mySQL_DAO.getCities()
        .then((result) => {
            //render "showCities.ejs
            res.render('showCities', {cities: result})
        })
        .catch((error) => {
            //display error
            res.send(error)
        })
})

//display "ListHeadsOfState.ejs" when url ends with "/ListHeadsOfState"
app.get('/ListHeadsOfState', (req, res) => {
    mongo_DAO.getHeadsOfState()
        .then((documents) => {
            //render "showHeadsOfState.ejs
            res.render('showHeadsOfState', {headsOfState: documents})
        })
        .catch((error) => {
            //display error
            res.send(error)
        })
})

//display "AddCountry.ejs" when url ends with "/addCountry"
app.get('/AddCountry', (req, res) => {
    //render "addCountry.ejs
    res.render("addCountry")
})

//add a new country to mysql database
app.post('/AddCountry', (req, res) => {
    //call "addCountry" from "mySQL_DAO.js"
    mySQL_DAO.addCountry(req.body.countryCode, req.body.countryName, req.body.countryDetails)
    .then(() => {
        //display "showCountries.ejs" after successfully adding new country
        mySQL_DAO.getCountries()
        .then((result) => {
            res.render('showCountries', {countries: result})
        })
        .catch((error) => {
            //display error
            res.send(error)
        })
    })
    .catch((error) => {
        //display error
        res.send(error)
    })
})

//delete a country from mysql database
app.get('/countries/:co_code', (req, res) => {
    //call "deleteCountry" from "mySQL_DAO.js"
    mySQL_DAO.deleteCountry(req.params.co_code)
        .then((result) => {
            //display error message
            if (result.affectedRows == 0) {
                res.send("<h3>Country: " + req.params.co_code + " doesn't exist. </h3>")
            }
            else {
                //display "showCountries.ejs" after successfully deleting the country
                mySQL_DAO.getCountries()
                    .then((result2) => {
                        res.render('showCountries', { countries: result2 })
                    })
                    .catch((error) => {
                        //display error
                        res.send(error)
                    })
            }
        })
        .catch((error) => {
            //display error
            res.send("<div> <h1>Error Message</h1> <h2>" + req.params.co_code + " has cities, it cannot be deleted.</h2> </div>")
        })
})

//display "EditCountry.ejs" when url ends with "/editCountry"
app.get('/EditCountry', (req, res) => {
    res.render("editCountry")
})

//display "AddHeadOfState.ejs" when url ends with "/addHeadOfState"
app.get('/AddHeadOfState', (req, res) => {
    res.render("addHeadOfState")
})

//add new head of state to mongodb database
app.post('/AddHeadOfState', (req, res) => {
    //call "addHeadOfState" from "mongo_DAO.js"
    mongo_DAO.addHeadOfState(req.body._id, req.body.headOfState)
        .then((result) => {
            //display "showHeadsOfState.ejs" after successfully adding new head of state
            mongo_DAO.getHeadsOfState()
                .then((documents) => {
                    res.render('showHeadsOfState', { headsOfState: documents })
                })
                .catch((error) => {
                    //display error
                    res.send(error)
                })
        })
        .catch((error) => {
            //display error
            res.send(error)
        })
})

//delete head of state from mongodb database
app.get('/ListHeadsOfState/:_id', (req, res) => {
    //call "deleteHeadOfState" from "mongo_DAO.js"
    mongo_DAO.deleteHeadOfState(req.params._id)
        .then((result) => {
            //display "showHeadsOfState.ejs" after successfully deleting the head of state
            mongo_DAO.getHeadsOfState()
                .then((documents) => {
                    res.render('showHeadsOfState', { headsOfState: documents })
                })
                .catch((error) => {
                    //display error
                    res.send(error)
                })
        })
        .catch((error) => {
            //display error
            res.send(error)
        })
})

//display "showAllDetails.ejs" when url ends with "/showAllDetails/:city" (unfinished)
app.get('/showAllDetails/:city', (req, res) => {
    //call "getCity" from "mySQL_DAO.js"
    mySQL_DAO.getCity(req.params.city)
        .then((result) => {
            //display specific city's details
            res.send(result)
        })
        .catch((error) => {
            //display error
            res.send(error)
        }) 
   /*
        mySQL_DAO.getCity(req.params.city)
        .then((result) => {
            res.render('showAllDetails', {result})
        })
        .catch((error) => {
            res.send(error)
        }) */

})

app.listen(3000, () => {
    console.log("Listening on Port 3000")
})