-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: joinify_3
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `grupo_suscripcion`
--

DROP TABLE IF EXISTS `grupo_suscripcion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupo_suscripcion` (
  `id_grupo_suscripcion` int NOT NULL AUTO_INCREMENT,
  `nombre_grupo` varchar(100) NOT NULL,
  `fecha_creacion` date NOT NULL,
  `estado_grupo` varchar(50) NOT NULL,
  `num_integrantes` int NOT NULL,
  `id_servicio` int NOT NULL,
  `costo_total` decimal(10,2) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `id_creador` int NOT NULL,
  `correo_cuenta` varchar(150) NOT NULL,
  `contrasena_cuenta` text,
  PRIMARY KEY (`id_grupo_suscripcion`),
  KEY `id_servicio` (`id_servicio`),
  KEY `id_creador` (`id_creador`),
  CONSTRAINT `grupo_suscripcion_ibfk_1` FOREIGN KEY (`id_servicio`) REFERENCES `servicio_streaming` (`id_servicio`),
  CONSTRAINT `grupo_suscripcion_ibfk_2` FOREIGN KEY (`id_creador`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupo_suscripcion`
--

LOCK TABLES `grupo_suscripcion` WRITE;
/*!40000 ALTER TABLE `grupo_suscripcion` DISABLE KEYS */;
INSERT INTO `grupo_suscripcion` VALUES (1,'Mi grupo 1','2025-11-23','Activo',3,1,150.00,'2025-11-23','2025-12-23',1,'correo@gmail.com','41e6259cfafab865bfe9d17482495ee4:e9b8b5833048f1fe57b017611b9efa4f'),(2,'Chocolate','2025-11-23','Activo',2,3,166.00,'2025-11-23','2025-12-23',2,'correo2@gmail.com','5850476aad10229d5b2c3f214fa2c54c:40fcc11d501e6903bfd6cdf3af31c3aa');
/*!40000 ALTER TABLE `grupo_suscripcion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_pagos`
--

DROP TABLE IF EXISTS `historial_pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_pagos` (
  `id_historial_pago` int NOT NULL AUTO_INCREMENT,
  `id_pago` int NOT NULL,
  `id_grupo_suscripcion` int NOT NULL,
  PRIMARY KEY (`id_historial_pago`),
  KEY `id_pago` (`id_pago`),
  KEY `id_grupo_suscripcion` (`id_grupo_suscripcion`),
  CONSTRAINT `historial_pagos_ibfk_1` FOREIGN KEY (`id_pago`) REFERENCES `pago` (`id_pago`),
  CONSTRAINT `historial_pagos_ibfk_2` FOREIGN KEY (`id_grupo_suscripcion`) REFERENCES `grupo_suscripcion` (`id_grupo_suscripcion`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_pagos`
--

LOCK TABLES `historial_pagos` WRITE;
/*!40000 ALTER TABLE `historial_pagos` DISABLE KEYS */;
INSERT INTO `historial_pagos` VALUES (1,1,1);
/*!40000 ALTER TABLE `historial_pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `id_notificacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` date NOT NULL,
  `estado` enum('pendiente','leída','eliminada') NOT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (1,1,'Paulina se ha unido al grupo.','2025-11-23','pendiente'),(2,2,'Tu pago fue recibido.','2025-11-23','pendiente'),(3,1,'Recibiste pago.','2025-11-23','pendiente'),(4,2,'Maicol se ha unido al grupo.','2025-11-23','pendiente'),(5,2,'Grupo lleno.','2025-11-23','pendiente');
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` date NOT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES (1,2,50.00,'2025-11-23');
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicio_streaming`
--

DROP TABLE IF EXISTS `servicio_streaming`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicio_streaming` (
  `id_servicio` int NOT NULL AUTO_INCREMENT,
  `nombre_servicio` varchar(100) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`id_servicio`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicio_streaming`
--

LOCK TABLES `servicio_streaming` WRITE;
/*!40000 ALTER TABLE `servicio_streaming` DISABLE KEYS */;
INSERT INTO `servicio_streaming` VALUES (1,'Netflix','Plataforma líder de streaming con películas, series y documentales originales y licenciados.'),(2,'Disney Plus','El hogar del contenido de Disney, Pixar, Marvel, Star Wars y National Geographic.'),(3,'Amazon Prime','Streaming de películas, series y producciones originales de Amazon.'),(4,'HBO Max','Series y películas exclusivas de HBO, Warner Bros, DC y más.'),(5,'Apple TV','Originales Apple y éxitos de cine y televisión en un solo lugar.'),(6,'Hulu','Películas, series y programación exclusiva en streaming bajo demanda.'),(7,'Paramount+','Películas y series de Paramount, CBS, Nickelodeon y más.'),(8,'Star+','Series, películas, deportes en vivo y más contenido para adultos.'),(9,'Crunchyroll','Streaming especializado en anime japonés subtitulado y doblado.'),(10,'YouTube Premium','Versión sin anuncios de YouTube con acceso a contenido exclusivo.'),(11,'Tubi','Streaming gratuito con anuncios, películas y series populares.'),(12,'Pluto TV','Televisión en vivo y contenido bajo demanda sin costo.'),(13,'Rakuten TV','Películas y series europeas, muchas disponibles de forma gratuita.'),(14,'Mubi','Cine de autor y películas seleccionadas diariamente.'),(15,'Funimation','Anime con doblaje al inglés y subtítulos, especialmente para EE.UU.'),(16,'DAZN','Streaming especializado en deportes en vivo como boxeo y fútbol.'),(17,'Plex','Streaming gratuito con películas, series y canales en vivo.'),(18,'Kanopy','Streaming educativo y cultural gratuito con acceso bibliotecario.'),(19,'Acorn TV','Series y películas británicas, australianas y canadienses.'),(20,'CuriosityStream','Documentales sobre ciencia, historia y tecnología.'),(21,'Shudder','Streaming de películas y series de terror y suspenso.'),(22,'Discovery+','Contenido de Discovery Channel, Animal Planet y más.'),(23,'BritBox','Series clásicas y nuevas del Reino Unido.'),(24,'Sundance Now','Películas independientes, documentales y thrillers.'),(25,'FuboTV','Streaming de canales en vivo con enfoque en deportes.'),(26,'Xumo Play','Streaming gratuito con contenido en vivo y bajo demanda.'),(27,'Popcornflix','Películas gratuitas financiadas por anuncios.'),(28,'Redbox Free Live TV','Canales de TV gratuitos por internet.'),(29,'Vix','Plataforma gratuita con películas, series y canales en español, propiedad de TelevisaUnivision.'),(30,'Sling TV','Servicio de TV en vivo por internet con paquetes personalizables y canales populares.'),(31,'The Roku Channel','Streaming gratuito con películas, series, noticias y canales en vivo.'),(32,'Hayu','Servicio enfocado en reality shows como The Real Housewives, Top Chef y más.'),(33,'Crackle','Plataforma gratuita de Sony con películas, series y contenido original.'),(34,'Topic','Streaming de thrillers internacionales, dramas criminales y contenido independiente.'),(35,'WOW Presents Plus','Contenido LGBTQ+ como RuPaul’s Drag Race y programas de drag internacionales.'),(36,'Binge','Plataforma australiana con acceso a contenido de HBO, Warner Bros y más.'),(37,'Shahid','Streaming en árabe con películas, series, programas en vivo y deportivos.'),(38,'Cinepolis KLIC','Servicio de renta y compra de películas recientes, sin necesidad de suscripción.'),(39,'Claro Video','Plataforma latinoamericana de series, películas y conciertos en demanda.'),(40,'Televisa Univision+','Contenido exclusivo en español, incluyendo novelas, series y deportes.'),(41,'AMC+','Servicio premium con contenido de AMC, SundanceTV, IFC y Shudder.'),(42,'StarzPlay','Películas taquilleras y series originales disponibles bajo demanda.'),(43,'Eros Now','Plataforma india con películas de Bollywood, series y música.'),(44,'Discovery Familia GO','Contenido educativo, series y caricaturas para niños y familias en español.'),(45,'Gaia','Streaming enfocado en yoga, espiritualidad, salud holística y meditación.'),(46,'MagellanTV','Documentales sobre historia, ciencia, naturaleza y cultura.'),(47,'Hallmark Movies Now','Películas románticas, familiares y de temporada navideña.'),(48,'Pantaya','Películas y series en español para el público latino en EE.UU. (ahora parte de Vix).');
/*!40000 ALTER TABLE `servicio_streaming` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `fecha_registro` date NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Maicol','maicol@gmail.com','$2b$10$x8d8cgZPuYYm287BihWkkeB3mn/PvV3t1/5VTxohGHlKzHcwEZZAS','2025-11-23'),(2,'Paulina','paulina@gmail.com','$2b$10$2.xR8znVnPTyjvpW58zQv.GA//5PJ1iXOK3.6tCLxCEuA.Mi5hqTq','2025-11-23'),(3,'Aketzali','aketzali@hotmail.com','$2b$10$M4kwsOT/ND4cjdM7NAN3lOppcZv1TmlLKtlnYImvN9rpBTqiG9Fbu','2025-11-23');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_grupo`
--

DROP TABLE IF EXISTS `usuario_grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_grupo` (
  `id_usuario_grupo` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_grupo_suscripcion` int NOT NULL,
  `rol` enum('Admin','Miembro') NOT NULL,
  PRIMARY KEY (`id_usuario_grupo`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_grupo_suscripcion` (`id_grupo_suscripcion`),
  CONSTRAINT `usuario_grupo_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `usuario_grupo_ibfk_2` FOREIGN KEY (`id_grupo_suscripcion`) REFERENCES `grupo_suscripcion` (`id_grupo_suscripcion`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_grupo`
--

LOCK TABLES `usuario_grupo` WRITE;
/*!40000 ALTER TABLE `usuario_grupo` DISABLE KEYS */;
INSERT INTO `usuario_grupo` VALUES (1,1,1,'Admin'),(2,2,2,'Admin'),(3,2,1,'Miembro'),(4,1,2,'Miembro');
/*!40000 ALTER TABLE `usuario_grupo` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-25 22:36:43
