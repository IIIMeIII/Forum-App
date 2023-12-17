LOCK TABLES `participant` WRITE;
INSERT INTO `participant` VALUES (1,1),(1,2);
UNLOCK TABLES;

LOCK TABLES `post` WRITE;
INSERT INTO `post` VALUES (1,'pizza!','This pizza I had today was pretty nice!','2015-12-23 00:00:00',3,1),(2,'jazz','I\'ve been listening to a lot of Jazz lately...anyone else? :D','2010-12-23 00:00:00',1,2),(3,'holiday soon','I was thinking of travelling to Paris soon and wanted to hear eveyone\'s experiences','0001-11-23 00:00:00',2,3),(4,'Canada!','Going to Canada in a few weeks!','2012-12-23 00:00:00',3,3);
UNLOCK TABLES;

LOCK TABLES `topic` WRITE;
INSERT INTO `topic` VALUES (1,'food'),(2,'music'),(3,'travel');
UNLOCK TABLES;

LOCK TABLES `user` WRITE;
INSERT INTO `user` VALUES (1,'ben','smith','bensmith',NULL,'chickendinner'),(2,'bobby','winters','bobbyw','b@gmail.com','icecream'),(3,'Jessica','Summers','Chu_yu','JessicaSummers@gmail.com','tescosmealdeal');
UNLOCK TABLES;

