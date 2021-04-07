module.exports = function() {
    var express = require('express');
    var router = express.Router();

    // selects all enrollments
    function getAllEnrolls(res, mysql, context, complete) {
        mysql.pool.query("SELECT Enrollments.student_id AS sid, CONCAT(Students.last_name,', ',Students.first_name)\
         AS sName, Enrollments.class_id AS cid, Classes.name As cName, Enrollments.grade FROM Enrollments\
         JOIN Students ON Enrollments.student_id = Students.student_id JOIN\
         Classes ON Enrollments.class_id = Classes.class_id ORDER BY sName", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }

            context.enrolls = results;
            complete();
        });
    }

    // select enrollments whose class name starts with given string
    function getEnrollByClass(req, res, mysql, context, complete) {
        var query = "SELECT Enrollments.student_id AS sid, CONCAT(Students.last_name,', ',Students.first_name) AS sName,\
         Enrollments.class_id AS cid, Classes.name as cName, Enrollments.grade FROM Enrollments JOIN Students ON Enrollments.student_id =\
          Students.student_id JOIN Classes ON Enrollments.class_id = Classes.class_id WHERE Classes.name LIKE "\ +
            mysql.pool.escape(req.params.s + '%') + " ORDER BY cName, sName"

        mysql.pool.query(query, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.enrolls = results;
            complete();
        });

    }

    // select enrollments by student name
    function getEnrollByName(req, res, mysql, context, complete) {
        var query = "SELECT * FROM (SELECT Enrollments.student_id AS sid, CONCAT(Students.last_name,', ',Students.first_name)\
         AS sName, Enrollments.class_id AS cid, Classes.name as cName, Enrollments.grade FROM Enrollments JOIN Students ON Enrollments.student_id =\
          Students.student_id JOIN Classes ON Enrollments.class_id = Classes.class_id) AS tmp WHERE sName LIKE " + mysql.pool.escape(req.params.s + '%') + \
            " ORDER BY cName"

        mysql.pool.query(query, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.enrolls = results;
            complete();
        });

    }

    // selects enrollment matching id
    function getEnrollById(res, mysql, context, cid, sid, complete) {
        var sql = "SELECT Enrollments.student_id AS sid, first_name, last_name, Enrollments.class_id AS cid, name AS class,\
         grade FROM Enrollments JOIN Students ON Enrollments.student_id=Students.student_id\
          JOIN Classes ON Enrollments.class_id=Classes.class_id WHERE Enrollments.class_id = ? AND Enrollments.student_id = ?";
        var inserts = [cid, sid];
        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.enroll = results[0];
            complete();
        });
    }

    // Displays all enrollments
    router.get('/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchEnrollByClass.js", "searchEnrollByStudentName.js", "deleteEnrollment.js"];
        var mysql = req.app.get('mysql')
        getAllEnrolls(res, mysql, context, complete)

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('enrollments', context);

            }
        }
    });

    // Displays enrollments whose class name starts with given string.
    router.get('/by_class/:s/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchEnrollByClass.js", "searchEnrollByStudentName.js"];
        var mysql = req.app.get('mysql');
        getEnrollByClass(req, res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('enrollments', context);
            }
        }
    })

    // Displays enrollments with given student name
    router.get('/by_name/:s/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchEnrollByClass.js", "searchEnrollByStudentName.js"];
        var mysql = req.app.get('mysql');
        getEnrollByName(req, res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('enrollments', context);
            }
        }
    })

    // adds enrollment and redirect to enrollments page to display
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Enrollments (class_id, student_id, grade) VALUES((SELECT class_id FROM Classes WHERE name = ?),\
        (SELECT student_id FROM Students WHERE first_name=? AND last_name=?),?)"

        var inserts = [req.body.cName, req.body.sfName, req.body.slName, req.body.grade]
        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/enrollments');
            }
        });
    })

    // displays enrollment matching given id
    router.get('/:id', function(req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateEnrollment.js"];
        var mysql = req.app.get('mysql');
        var [cid, sid] = req.params.id.split('&')
        getEnrollById(res, mysql, context, cid, sid, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('updateEnrollment', context);
            }

        }
    });

    // update an enrollment
    router.put('/:id', function(req, res) {
        var sql = "UPDATE Enrollments SET grade=? WHERE class_id=? AND student_id=?";
        var inserts = [req.body.grade, req.body.cid, req.body.sid];
        var mysql = req.app.get('mysql');

        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                res.end();
            }
        });
    });

    // delete an enrollment
    router.delete('/cid/:cid/sid/:sid', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Enrollments WHERE class_id = ? AND student_id = ?";

        var inserts = [req.params.cid, req.params.sid];
        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            } else {
                res.status(202).end();
            }
        })
    })

    return router;
}();