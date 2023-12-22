--
-- Dumping data for table `participant`
--

LOCK TABLES `participant` WRITE;
INSERT INTO `participant` VALUES (3,1),(5,1),(1,2),(5,2),(2,3),(3,3),(5,3);
UNLOCK TABLES;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
INSERT INTO `post` VALUES (1,'pizza!','This pizza I had today was pretty nice!','2015-12-23 00:00:00',3,1),(2,'jazz','I\'ve been listening to a lot of Jazz lately...anyone else? :D','2010-12-23 00:00:00',1,2),(3,'holiday soon','I was thinking of travelling to Paris soon and wanted to hear eveyone\'s experiences','0001-11-23 00:00:00',2,3),(4,'Canada!','Going to Canada in a few weeks!','2012-12-23 00:00:00',3,3),(5,'NCT WORLD DOMINATION','LET ME INTRODUCE YOU TO SOME NEW THANNNGGSSSSSS','2023-12-22 13:53:54',5,2),(6,'NCT WORLD DOMINATION','LET ME INTRODUCE YOU TO SOME NEW THANNNGSSSSSSS\r\n','2023-12-22 13:59:02',5,3);
UNLOCK TABLES;

--
-- Dumping data for table `reply`
--

LOCK TABLES `reply` WRITE;
INSERT INTO `reply` VALUES (1,'that\'s pretty cool! Hope you enjoy :)','2016-12-23 00:00:00',2,4),(2,'now i\'m craving pizza xD','2023-12-18 22:14:57',4,1),(3,'I\'ve not listened to much jazz. any recommendations?','2023-12-21 17:17:48',4,2);
UNLOCK TABLES;

--
-- Dumping data for table `topic`
--

LOCK TABLES `topic` WRITE;
INSERT INTO `topic` VALUES (1,'food'),(2,'music'),(3,'travel');
UNLOCK TABLES;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
INSERT INTO `user` VALUES (1,'ben','smith','bensmith',NULL,'chickendinner'),(2,'bobby','winters','bobbyw','b@gmail.com','icecream'),(3,'Jessica','Summers','Chu_yu','JessicaSummers@gmail.com','tescosmealdeal'),(4,'Wemble','Tubbus','TumblyWumbly','WembleTubbus@gmail.com','guiltygearking'),(5,'test','user','testuser','','testuser123');
UNLOCK TABLES;
