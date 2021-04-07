   module.exports = function() {
       var express = require('express');
       var router = express.Router();


       // Selects all students 
       function getAllStudents(res, mysql, context, complete) {
           mysql.pool.query("SELECT Students.student_id AS id, Students.first_name AS fname, Students.last_name AS lname, Students.gpa AS gpa, Majors.name AS major FROM Students JOIN Majors ON Students.major_id = Majors.major_id ORDER BY Students.last_name;",
               function(error, results, fields) {
                   if (error) {
                       res.write(JSON.stringify(error));
                       res.end();
                   }

                   context.students = results;
                   complete();
               });
       }

       // Selects students whose last name starts with given string 
       function getStudentLastName(req, res, mysql, context, complete) {
           var sql = "SELECT Students.student_id AS id, Students.first_name AS fname, Students.last_name AS lname, Students.gpa AS gpa, Majors.name AS major FROM Students JOIN Majors ON Students.major_id = Majors.major_id WHERE Students.last_name LIKE " + mysql.pool.escape(req.params.s + '%') + "ORDER BY Students.last_name;"
           mysql.pool.query(sql, function(error, results, fields) {
               if (error) {
                   res.write(JSON.stringify(error));
                   res.end();
               }

               context.students = results;
           });

       }

       // Change blank values to Null
       function checkNull(inserts) {
           for (i = 0; i < inserts.length; i++) {
               if (inserts[i] == '') {
                   inserts[i] = null
               }
           }
       }

       // Display all students
       router.get('/', function(req, res) {
           var callbackCount = 0;
           var context = {};
           context.jsscripts = ["searchStudentByName.js"];
           var mysql = req.app.get('mysql')
           getAllStudents(res, mysql, context, complete)

           function complete() {
               callbackCount++;
               if (callbackCount >= 1) {
                   res.render('students', context)

               }
           }
       });

       // Add student and redirect to students page to display
       router.post('/', function(req, res) {
           var mysql = req.app.get('mysql');

           var sql = "INSERT INTO Students (first_name, last_name, gpa, major_id) VALUES (?,?,?,(SELECT major_id FROM Majors WHERE name=?))"
           var inserts = [req.body.fname, req.body.lname, req.body.gpa, req.body.major]
           checkNull(inserts)

           console.log(inserts)
           mysql.pool.query(sql, inserts, function(error, results, fields) {
               if (error) {
                   console.log(JSON.stringify(error))
                   res.write(JSON.stringify(error));
                   res.end();
               } else {
                   res.redirect('/students');
               }
           });
       })

       return router;
   }();