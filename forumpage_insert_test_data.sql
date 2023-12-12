
LOCK TABLES `participant` WRITE;
INSERT INTO `participant` VALUES (1,1),(1,2);
UNLOCK TABLES;

LOCK TABLES `post` WRITE;
UNLOCK TABLES;

LOCK TABLES `topic` WRITE;
INSERT INTO `topic` VALUES (2,'food'),(3,'music'),(1,'travel');
UNLOCK TABLES;

LOCK TABLES `user` WRITE;
INSERT INTO `user` VALUES (1,'ben','smith','bensmith',NULL),(2,'bobby','winters','bobbyw','b@gmail.com');
UNLOCK TABLES;

