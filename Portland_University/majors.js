module.exports = function() {
    var express = require('express');
    var router = express.Router();

    // Selects all majors
    function getAllMajors(res, mysql, context, complete) {
        mysql.pool.query("SELECT * FROM Majors ORDER BY name", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }

            context.majs = results;
            context.majs.forEach(element => changeBool(element))
            complete();
        });
    }

    // Changes bool value to Yes/No
    function changeBool(element) {
        if (element.undergraduate == 1) {
            element.undergraduate = "Yes"
        } else {
            element.undergraduate = "No"
        }
    }

    // Changes blank values to null
    function checkNull(inserts) {
        for (i = 0; i < inserts.length; i++) {
            if (inserts[i] == '') {
                inserts[i] = null
            }
        }
    }

    // Display all majors
    router.get('/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql')
        getAllMajors(res, mysql, context, complete)
        console.log(context.majors)

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('majors', context)
                console.log(context)
            }
        }
    });

    // Add a major
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Majors (name, college, undergraduate) VALUES (?,?,?)"

        // change string to bool
        if (req.body.undergrad == "Yes") {
            req.body.undergrad = 1
        } else if (req.body.undergrad == "No") {
            req.body.undergrad = 0
        }

        var inserts = [req.body.name, req.body.colName, req.body.undergrad]
        checkNull(inserts)

        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/majors');
            }
        });
    })

    return router;
}();