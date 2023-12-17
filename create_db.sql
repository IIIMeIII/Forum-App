DROP TABLE IF EXISTS `participant`;

CREATE TABLE `participant` (
  `user_id` int NOT NULL,
  `topic_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`topic_id`)
) 

DROP TABLE IF EXISTS `post`;

CREATE TABLE `post` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `content` varchar(999) NOT NULL DEFAULT '"empty"',
  `date` datetime NOT NULL,
  `user_id` int NOT NULL,
  `topic_id` int NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `FK_post_user_idx` (`user_id`),
  KEY `FK_post_topic_idx` (`topic_id`),
  CONSTRAINT `FK_post_topic` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`topic_id`),
  CONSTRAINT `FK_post_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) 

DROP TABLE IF EXISTS `topic`;

CREATE TABLE `topic` (
  `topic_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`topic_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) 

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(45) NOT NULL,
  `surname` varchar(45) NOT NULL,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(45) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) 