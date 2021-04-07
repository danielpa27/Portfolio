
DROP TABLE IF EXISTS `Enrollments`;
DROP TABLE IF EXISTS `Classes`;
DROP TABLE IF EXISTS `Professors`;
DROP TABLE IF EXISTS `Students`;
DROP TABLE IF EXISTS `Majors`;




-- Creates the major tables 
CREATE TABLE `Majors`(
	`major_id` INT(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255),
	`college` VARCHAR(255),
	`undergraduate` BOOLEAN,
	PRIMARY KEY(`major_id`)
) ENGINE=InnoDB;


-- Creates the students tables 
CREATE TABLE `Students`(
	`student_id` INT(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`first_name` VARCHAR(255) NOT NULL,
	`last_name` VARCHAR(255) NOT NULL,
	`gpa` DECIMAL(3,2),
	`major_id` INT(8),
	PRIMARY KEY(`student_id`),
	FOREIGN KEY (`major_id`) REFERENCES `Majors` (`major_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Creates the professors tables 
CREATE TABLE `Professors`(
	`employee_id` INT(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`first_name` VARCHAR(255) NOT NULL,
	`last_name` VARCHAR(255) NOT NULL,
	`college` VARCHAR(255) NOT NULL,
	`tenured` BOOLEAN,
	PRIMARY KEY(`employee_id`)
) ENGINE=InnoDB;

-- Create classes table 
CREATE TABLE `Classes` (
	`class_id` INT(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`capacity` INT(4),
	`major_id` INT(8),
	`employee_id` INT(8) NOT NULL,
	PRIMARY KEY(`class_id`),
	FOREIGN KEY(`major_id`) REFERENCES `Majors` (`major_id`) ON DELETE CASCADE,
	FOREIGN KEY(`employee_id`) REFERENCES `Professors` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB;



-- Creates the enrollement table 
CREATE TABLE `Enrollments`(
	`class_id` INT(8) NOT NULL,
	`student_id` INT(8) NOT NULL,
	`grade` CHAR(1),
	PRIMARY KEY(`class_id`,`student_id`),
	FOREIGN KEY(`class_id`) REFERENCES `Classes` (`class_id`) ON DELETE CASCADE,
	FOREIGN KEY(`student_id`) REFERENCES `Students` (`student_id`) ON DELETE CASCADE
 ) ENGINE=InnoDB;


-- Sample Data for Majors
 INSERT INTO Majors (name, college, undergraduate) 
 VALUES ('Computer Science', 'Engineering', 1), ('Art', 'Liberal Arts', 1),
 ('Business', 'Business', 1), ('Physics', 'Engineering', 0);

-- Sample Data for Students
INSERT INTO Students (first_name, last_name, gpa, major_id) 
VALUES ('Robert', 'Oppenheimer', 3.67, (SELECT major_id FROM Majors WHERE name = 'Physics')),
('Jeff', 'Bezos', 2.57, (SELECT major_id FROM Majors WHERE name = 'Business')),
('Steve', 'Jobs', 3.87, (SELECT major_id FROM Majors WHERE name = 'Computer Science')),
('Vincent', "Van Gogh", 4.00, (SELECT major_id FROM Majors WHERE name = 'Art'));


-- Sample Data for Professors
INSERT INTO Professors (first_name, last_name, college, tenured)
VALUES ('Bill', 'Gates', 'Engineering', 1), ('Gavin', 'Belson', 'Business', 0),
('Albert', 'Einstein', 'Engineering', 0), ('Georgia', "O'Keefe", 'Liberal Arts', 1);

-- Sample Data for Classes
INSERT INTO Classes (name, capacity, major_id, employee_id)
VALUES ('Intro to Python', 120, (SELECT major_id FROM Majors WHERE name='Computer Science'),
 (SELECT employee_id FROM Professors WHERE first_name='Bill' AND last_name = 'Gates')),
 ('Modern Art', 30, (SELECT major_id FROM Majors WHERE name='Art'),
 (SELECT employee_id FROM Professors WHERE first_name='Georgia' AND last_name = "O'Keefe")),
 ('Basics of Business', 450, (SELECT major_id FROM Majors WHERE name='Business'),
 (SELECT employee_id FROM Professors WHERE first_name='Gavin' AND last_name = 'Belson')),
 ('Ethics in Physics', 340, (SELECT major_id FROM Majors WHERE name='Physics'),
 (SELECT employee_id FROM Professors WHERE first_name='Albert' AND last_name = 'Einstein'));

-- Sample Data for Enrollments
INSERT INTO Enrollments (class_id, student_id, grade)
VALUES ((SELECT class_id FROM Classes WHERE name = 'Modern Art'), (SELECT student_id FROM Students WHERE first_name='Vincent' AND last_name='Van Gogh'), 'B'),
((SELECT class_id FROM Classes WHERE name = 'Basics of Business'), (SELECT student_id FROM Students WHERE first_name='Jeff' AND last_name='Bezos'), 'C'),
((SELECT class_id FROM Classes WHERE name = 'Ethics in Physics'), (SELECT student_id FROM Students WHERE first_name='Robert' AND last_name='Oppenheimer'), 'F'),
((SELECT class_id FROM Classes WHERE name = 'Intro to Python'), (SELECT student_id FROM Students WHERE first_name='Steve' AND last_name='Jobs'), 'A');