var express = require('express');
var mongoose = require('mongoose');
var app = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


mongoose.connect(database.url);

var Employee = require('./models/employee');
const employee = require('./models/employee');


//get all employee data from db
app.get('/api/employees', function (req, res) {
    
    // use mongoose to get all employees in the database
    Employee.find().then(employees=> {
        res.json(employees);
    })
    // if there is an error retrieving, send the error otherwise send data
    .catch(error=>{
        res.send(error)
    })

});

// get a employee with ID of 1
app.get('/api/employees/:employee_id', function (req, res) {
    let id = req.params.employee_id;
    Employee.findById(id).then (employee=>{
       res.json(employee);
    }).catch(error=>{
        res.send(error);
    })

});


// create employee and send back all employees after creation
app.post('/api/employees', function (req, res) {

    console.log(req.body);

    // create mongose method to create a new record into collection
    Employee.create({
        name: req.body.name,
        salary: req.body.salary,
        age: req.body.age
    })
    .then(employee => {
        // get and return all the employees after newly created employe record
        Employee.find().then(employees=> {
            res.json(employees);
        }).catch(error=>{
            res.send(error)
        })
    })
    .catch(error => {
        console.error(error);
    });
});


// create employee and send back all employees after creation
app.put('/api/employees/:employee_id', function (req, res) {
    // create mongose method to update an existing record into collection
    console.log(req.body);

    let id = req.params.employee_id;
    var data = {
        name: req.body.name,
        salary: req.body.salary,
        age: req.body.age
    }

    // save the user
    Employee.findByIdAndUpdate(id, data).then(employee=>{
        res.send('Successfully! Employee updated - ' + employee.name);
    }).catch(error=>{
        throw error;
    })
});

// delete a employee by id
app.delete('/api/employees/:employee_id', function (req, res) {
    console.log(req.params.employee_id);
    let id = req.params.employee_id;
    Employee.deleteOne({
        _id: id
    }).then(res.send('Successfully! Employee has been Deleted.'))
        .catch(error=>{
            res.send(err);
        })
});

app.listen(port);
console.log("App listening on port : " + port);