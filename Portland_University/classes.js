module.exports = function() {
    var express = require('express');
    var router = express.Router();


    // get all majors
    function getMajors(res, mysql, context, complete) {
        mysql.pool.query("SELECT major_id as id, name FROM Majors", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.majors = results;
            complete();
        });
    }


    function getAllClasses(res, mysql, context, complete) {
        mysql.pool.query("SELECT Classes.class_id AS id, Classes.name as name, Classes.capacity, Majors.name AS major, Professors.last_name AS professor\
         FROM Classes JOIN Majors on Classes.major_id = Majors.Major_id JOIN Professors on Classes.employee_id = Professors.employee_id ORDER BY Classes.name",
            function(error, results, fields) {
                if (error) {
                    res.write(JSON.stringify(error));
                    res.end();
                }

                context.classes = results;
                complete();
            });
    }

    function getClassByName(req, res, mysql, context, complete) {
        var sql = "SELECT Classes.class_id AS id, Classes.name, Classes.capacity, Majors.name AS major, Professors.last_name AS professor FROM Classes\
         JOIN Majors on Classes.major_id = Majors.Major_id JOIN Professors on Classes.employee_id = Professors.employee_id WHERE Classes.name LIKE " +
            mysql.pool.escape(req.params.s + '%');

        mysql.pool.query(sql, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }

            context.classes = results;
            complete();
        });
    }

    function getClassesByMajor(req, res, mysql, context, complete) {
        var sql = "SELECT Classes.class_id AS id, Classes.name, Classes.capacity, Majors.name AS major, Professors.last_name AS professor FROM Classes\
         JOIN Majors on Classes.major_id = Majors.Major_id JOIN Professors on Classes.employee_id = Professors.employee_id WHERE Classes.major_id =\
          (SELECT major_id FROM Majors WHERE major_id=?) ORDER BY Classes.name";

        var inserts = [req.params.major_id]
        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }

            context.classes = results;
            complete();
        });
    }

    // changes blank entries to null
    function checkNull(inserts) {
        for (i = 0; i < inserts.length; i++) {
            if (inserts[i] == '') {
                inserts[i] = null
            }
        }
    }

    // display all classes
    router.get('/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchClassByMajor.js", "searchClassByName.js"];
        var mysql = req.app.get('mysql');
        getAllClasses(res, mysql, context, complete);
        getMajors(res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('classes', context);

            }
        }
    });


    // display classes which names starts with given string.
    router.get('/byName/:s/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchClassByName.js", "searchClassByMajor.js"];
        var mysql = req.app.get('mysql');
        getClassByName(req, res, mysql, context, complete);
        getMajors(res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('classes', context);
            }
        }
    })


    //  display all classes of a given major
    router.get('/byMajor/:major_id', function(req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchClassByMajor.js", "searchClassByName.js"];
        var mysql = req.app.get('mysql');
        getClassesByMajor(req, res, mysql, context, complete);
        getMajors(res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('classes', context);
            }

        }
    });

    // add class and display all classes
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Classes (name, capacity, major_id, employee_id) VALUES (?, ?, (SELECT major_id FROM Majors WHERE name=?)\
         ,(SELECT employee_id from Professors WHERE first_name=? AND last_name=?))"

        var inserts = [req.body.name, req.body.capacity, req.body.major, req.body.fname, req.body.lname]
        checkNull(inserts)

        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/classes');
            }
        });
    })

    return router;
}();