/*
 * Create the prescribers table and insert some row. `id` starts at 1 and goes to 7.
 * Ran on AWS on 3/26/2019
 */

USE seniordesign1;

CREATE TABLE `prescribers` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`first` varchar(45) DEFAULT NULL,
    `last` varchar(45) DEFAULT NULL,
	`phone` BIGINT DEFAULT NULL,
	`location` varchar(70) DEFAULT NULL, 
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

INSERT INTO seniordesign1.prescribers
	(first, last, phone, location)
VALUES
	("Fred", "Beckey", 15553332818, "Indiana and Hamilton"),
	("Colin", "Haley", 15551106464, "Mission and Ruby"),
    ("Dani", "Arnold", 15559379688, "Spokane Falls and Washington"),
    ("Steph", "Davis", 15552122223, "Broadway and Monroe"),
    ("Dean", "Potter", 15553456352, "Cincinnati and Nora"),
    ("Ueli", "Steck", 15555676597, "2nd and McClellan"),
    ("Lynn", "Hill", 15555670183, "Lyons and Lidgerwood");
