var mysql = require('promise-mysql');

var pool;

mysql.createPool({
    connectionLimit : 3,
    host : 'localhost',
    user : 'root',
    password : 'ZqQDpr$8',
    database : 'geography'
})
.then((result) => {
    pool = result
})
.catch((error) => {
    console.log(error)
});

//function to return all countries in mysql database
var getCountries = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from country')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            }) 
    } )
}

//function to return all cities in mysql database
var getCities = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from city')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            }) 
    } )
}

//function to return a specific city's details
var getCity = function (cityCode) {
    return new Promise((resolve, reject) => {
        pool.query('select * from city where cty_code = "' + cityCode +'"')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            }) 
    } )
}

//function to delete a specific country from mysql database
var deleteCountry = function (co_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'delete from country where co_code = ?',
            values: [co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//function to add new country to mysql database
var addCountry = function (countryCode, countryName, countryDetails) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'insert into country values (?, ?, ?)',
            values: [countryCode, countryName, countryDetails]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//function to edit existing country (unfinished)
/* var editCountry = function (countryName, countryDetails) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'insert into country values (?, ?, ?)',
            values: [countryCode, countryName, countryDetails]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
} */

module.exports = { getCountries, getCities, getCity, deleteCountry, addCountry }
