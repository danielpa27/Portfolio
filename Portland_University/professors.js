module.exports = function() {
    var express = require('express');
    var router = express.Router();



    // Selects all professors
    function getAllProfs(res, mysql, context, complete) {
        mysql.pool.query("SELECT employee_id AS id, first_name, last_name, college, tenured FROM Professors ORDER BY last_name", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }

            context.profs = results;
            context.profs.forEach(element => changeBool(element))
            complete();
        });
    }

    // Selects professors whose last name starts with given string
    function getProfLastName(req, res, mysql, context, complete) {
        var sql = "SELECT employee_id as id, first_name, last_name, college, tenured FROM Professors WHERE last_name LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(sql, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.profs = results;
            context.profs.forEach(element => changeBool(element));
            complete();
        });

    }

    // Changes bool values to Yes/No
    function changeBool(element) {
        if (element.tenured == 1) {
            element.tenured = "Yes"
        } else {
            element.tenured = "No"
        }
    }

    // Changes blank values to Null
    function checkNull(inserts) {
        for (i = 0; i < inserts.length; i++) {
            if (inserts[i] == '') {
                inserts[i] = null
            }
        }
    }


    // Display all professors
    router.get('/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchProfByName.js"];
        var mysql = req.app.get('mysql')
        getAllProfs(res, mysql, context, complete)

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('professors', context);
            }
        }
    });

    // Display professors whose last name starts with given string.
    router.get('/search/:s/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchProfByName.js"];
        var mysql = req.app.get('mysql');
        getProfLastName(req, res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('professors', context);
            }
        }
    })


    // Add professor and display all professors
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Professors (first_name, last_name, college, tenured) VALUES (?,?,?,?)"

        // change string to bool
        if (req.body.tenured == "Yes") {
            req.body.tenured = 1
        } else if (req.body.tenured == "No") {
            req.body.tenured = 0
        }

        var inserts = [req.body.fname, req.body.lname, req.body.college, req.body.tenured]
        checkNull(inserts)

        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/professors');
            }
        });
    })

    return router;
}();