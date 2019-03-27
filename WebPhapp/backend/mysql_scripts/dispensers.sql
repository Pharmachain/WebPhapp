/*
 * Create the dispensers table and insert some items. `id` starts at 1, ends at 6.
 * Ran on AWS on 3/26/19
 */

USE seniordesign1;

CREATE TABLE `dispensers` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(45) DEFAULT NULL,
	`phone` BIGINT DEFAULT NULL,
	`location` varchar(70) DEFAULT NULL, 
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

INSERT INTO seniordesign1.dispensers
	(name, phone, location)
VALUES
	("Walgreens", 15553336464, "8840 E Dragontail Rd"),
	("Costco", 15551106464, "8705 N Colchuck Ln"),
	("Safeway", 15559376464, "8453 E Argonaut Dr"),
	("Yokes", 15552126464, "8364 McClellan Pl"),
	("Rite Aid", 15553456464, "9415 Stuart Rd"),
	("Walgreens", 15555676464, "8605 Sherpa Rd");
