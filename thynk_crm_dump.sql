-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: thynk_crm_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `thynk_crm_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `thynk_crm_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `thynk_crm_db`;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendance` (
  `id` varchar(50) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `date` varchar(50) NOT NULL,
  `clock_in` varchar(50) DEFAULT '',
  `clock_out` varchar(50) DEFAULT '',
  `hours` decimal(6,2) DEFAULT 0.00,
  `status` varchar(50) DEFAULT 'Present',
  `late` varchar(20) DEFAULT 'No',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_att_emp_date` (`employee_id`,`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES ('A001','E001','2026-06-26','09:15','18:30',9.25,'Present','No','2026-09-25 06:23:34','2026-09-25 06:23:34'),('A002','E002','2026-06-26','09:48','18:00',8.20,'Late Entry','Yes','2026-09-25 06:23:34','2026-09-25 06:23:34'),('A003','E003','2026-06-26','09:05','18:00',8.92,'Present','No','2026-09-25 06:23:34','2026-09-25 06:23:34'),('A004','E004','2026-06-26','','',0.00,'Absent','No','2026-09-25 06:23:34','2026-09-25 06:23:34'),('A005','E001','2026-06-25','09:08','18:15',9.12,'Present','No','2026-09-25 06:23:34','2026-09-25 06:23:34'),('A006','E002','2026-06-25','09:20','18:05',8.75,'Present','No','2026-09-25 06:23:34','2026-09-25 06:23:34'),('A007','E003','2026-06-25','09:02','18:10',9.13,'Present','No','2026-09-25 06:23:34','2026-09-25 06:23:34'),('A008','E004','2026-06-25','09:12','18:00',8.80,'Present','No','2026-09-25 06:23:34','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billing_software`
--

DROP TABLE IF EXISTS `billing_software`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `billing_software` (
  `id` varchar(50) NOT NULL,
  `client_name` varchar(255) DEFAULT '',
  `company_name` varchar(255) NOT NULL,
  `client_id` varchar(50) DEFAULT '',
  `price` decimal(10,2) DEFAULT 0.00,
  `maintenance` decimal(10,2) DEFAULT 0.00,
  `purchase_date` varchar(50) DEFAULT '',
  `renewal_date` varchar(50) DEFAULT '',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billing_software`
--

LOCK TABLES `billing_software` WRITE;
/*!40000 ALTER TABLE `billing_software` DISABLE KEYS */;
INSERT INTO `billing_software` VALUES ('BS001','Hasmi','Sree Balaji Textile Spares','',3500.00,2500.00,'2026-04-01','2027-04-01','','2026-09-25 06:23:34','2026-09-25 06:23:34'),('BS002','Hasmi','Dhanam Jayam Engineering','',2500.00,2500.00,'2026-04-01','2027-04-01','','2026-09-25 06:23:34','2026-09-25 06:23:34'),('BS003','','Jai Matrimony','',15000.00,3500.00,'2026-06-01','2027-06-01','','2026-09-25 06:23:34','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `billing_software` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `canva`
--

DROP TABLE IF EXISTS `canva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `canva` (
  `id` varchar(50) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `email` varchar(150) DEFAULT '',
  `price` decimal(10,2) DEFAULT 499.00,
  `purchase_date` varchar(50) DEFAULT '',
  `renewal_date` varchar(50) DEFAULT '',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canva`
--

LOCK TABLES `canva` WRITE;
/*!40000 ALTER TABLE `canva` DISABLE KEYS */;
INSERT INTO `canva` VALUES ('CAN001','Thynk Digital','gokul.digitalsolutions@gmail.com',499.00,'2025-07-25','2026-07-25','Main agency account','2026-09-25 06:23:34','2026-09-25 06:23:34'),('CAN002','Elakiya','elakiyamanikandann@gmail.com',499.00,'2025-08-24','2026-08-24','','2026-09-25 06:23:34','2026-09-25 06:23:34'),('CAN003','Vignesh','vigneshraja5148@gmail.com',499.00,'2025-09-12','2026-09-12','','2026-09-25 06:23:34','2026-09-25 06:23:34'),('CAN004','Sowmiya','sowmiya.thynkdigital@gmail.com',499.00,'2026-01-07','2027-01-07','','2026-09-25 06:23:34','2026-09-25 06:23:34'),('CAN005','Thirsha','thirsha.thynkdigital@gmail.com',499.00,'2026-02-08','2027-02-08','','2026-09-25 06:23:34','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `canva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` varchar(50) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `client_name` varchar(150) NOT NULL,
  `mobile` varchar(50) DEFAULT '',
  `whatsapp` varchar(50) DEFAULT '',
  `email` varchar(150) DEFAULT '',
  `website` varchar(255) DEFAULT '',
  `category` varchar(100) DEFAULT '',
  `gst` varchar(100) DEFAULT '',
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT '',
  `state` varchar(100) DEFAULT '',
  `country` varchar(100) DEFAULT 'India',
  `logo` varchar(50) DEFAULT '',
  `source` varchar(100) DEFAULT '',
  `assigned_employee_id` varchar(50) DEFAULT '',
  `status` varchar(50) DEFAULT 'Active',
  `priority` varchar(50) DEFAULT 'Medium',
  `date_created` varchar(50) DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES ('C001','Zenith Tech Labs','Rahul Sen','9876501234','9876501234','rahul@zenithlabs.com','https://www.zenithlabs.com','IT Services','27AAAAA1111A1Z1','402, Supreme Chambers, Andheri West','Mumbai','Maharashtra','India','Z','Google Ads','E001','Active','High','2025-01-10','2026-09-25 07:36:45','2026-09-25 07:36:45'),('C002','Bella Vita Salon & Spa','Priya Nair','9820011223','9820011223','priya@bellavitasalon.in','https://www.bellavitasalon.in','Beauty & Wellness','27BBBBB2222B2Z2','G-12, Ground Floor, Galleria Mall','Bengaluru','Karnataka','India','B','Instagram Outreach','E003','Active','Medium','2025-03-15','2026-09-25 07:36:45','2026-09-25 07:36:45'),('C003','Nutan Builders & Developers','Amit Shah','9930055443','9930055443','info@nutanbuilders.com','https://www.nutanbuilders.com','Real Estate','','101, Nutan Heights, SV Road, Bandra','Mumbai','Maharashtra','India','N','Referral','E002','Active','High','2024-11-20','2026-09-25 07:36:45','2026-09-25 07:36:45'),('C004','Globex Logistics','John D\'Souza','9167008899','9167008899','operations@globexlogistics.co.in','https://www.globexlogistics.co.in','Logistics','27CCCCC3333C3Z3','Building No. 5, Sector 17, Vashi','Navi Mumbai','Maharashtra','India','G','LinkedIn','E004','Inactive','Low','2024-05-05','2026-09-25 07:36:45','2026-09-25 07:36:45'),('C006','ABC Builders','Rakesh Gupta','9911223344','9911223344','info@abcbuilders.com','https://www.abcbuilders.com','Real Estate','27ABCB1234A1Z1','Building B, Central Avenue','Mumbai','Maharashtra','India','A','Referral','E002','Active','Medium','2026-01-01','2026-09-25 07:36:45','2026-09-25 07:36:45'),('C008','RIG Fabrication','Ravi','9988776655','9988776655','contact@rigearthing.com','https://www.rigearthing.com/','Industrial Manufacturing','27RIGE1234C1Z1','GIDC Industrial Estate','Vadodara','Gujarat','India','R','Google Search','E001','Active','High','2024-05-15','2026-09-25 06:23:34','2026-09-25 06:23:34'),('C009','Indus Dental Care','Sudharshan','9876123456','9876123456','appointments@indusdentalcare.com','https://www.indusdentalcare.com/','Healthcare','27INDD1234D1Z1','Flat 2, Prime Avenue, MG Road','Pune','Maharashtra','India','I','Instagram Outreach','E003','Active','Medium','2024-10-28','2026-09-25 06:23:34','2026-09-25 06:23:34'),('C010','Agtechnosolutions','Arun','9821102233','9821102233','arun@agtechnosolutions.in','https://agtechnosolutions.in/','IT Services','','12, Tech Park, Phase 1','Chennai','Tamil Nadu','India','A','Referral','E001','Active','Medium','2026-06-06','2026-09-25 06:23:34','2026-09-25 06:23:34'),('C011','Indus Flooring','Sudharshan','9834455667','9834455667','sudharshan@indusconcretepolishing.com','https://indusconcretepolishing.com/','Flooring & Construction','','Industrial Area Gate 3','Coimbatore','Tamil Nadu','India','I','Google Search','E003','Active','Medium','2025-07-16','2026-09-25 06:23:34','2026-09-25 06:23:34'),('C012','Thynk Digital','Gokul','9876543210','9876543210','gokul@thynkdigitalsolutions.com','https://www.thynkdigitalsolutions.com/','Digital Agency','','Main Road, Cross 2','Coimbatore','Tamil Nadu','India','T','Direct','E002','Active','High','2025-08-27','2026-09-25 06:23:34','2026-09-25 06:23:34'),('C013','MPS Hospital .IN','Manikandan','9812233445','9812233445','manikandan@mpshospitals.in','https://mpshospitals.in/','Healthcare','','MPS Road, City Center','Salem','Tamil Nadu','India','M','Referral','E004','Active','Medium','2024-09-08','2026-09-25 06:23:34','2026-09-25 06:23:34'),('C014','MPS Hospital .com','Manikandan','9812233445','9812233445','manikandan@mpshospitals.com','https://mpshospitals.com/','Healthcare','','MPS Road, City Center','Salem','Tamil Nadu','India','M','Referral','E004','Active','Medium','2024-09-08','2026-09-25 06:23:34','2026-09-25 06:23:34'),('C015','Wincube Solutions','Raj Kumar','9894455667','9894455667','rajkumar@wincube5s.com','https://www.wincube5s.com/','Consulting','','5S Office Block, G-3','Erode','Tamil Nadu','India','W','LinkedIn Outreach','E002','Active','Medium','2026-06-28','2026-09-25 06:23:34','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domains`
--

DROP TABLE IF EXISTS `domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domains` (
  `id` varchar(50) NOT NULL,
  `client_id` varchar(50) DEFAULT '',
  `domain_name` varchar(255) NOT NULL,
  `registrar` varchar(100) DEFAULT '',
  `registration_date` varchar(50) DEFAULT '',
  `expiry_date` varchar(50) DEFAULT '',
  `renewal_date` varchar(50) DEFAULT '',
  `auto_renewal` varchar(20) DEFAULT 'No',
  `status` varchar(50) DEFAULT 'Active',
  `renewal_cost` decimal(12,2) DEFAULT 0.00,
  `dns_status` varchar(50) DEFAULT 'OK',
  `ssl_status` varchar(50) DEFAULT 'Active',
  `nameservers` varchar(255) DEFAULT '',
  `credentials_placeholder` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domains`
--

LOCK TABLES `domains` WRITE;
/*!40000 ALTER TABLE `domains` DISABLE KEYS */;
INSERT INTO `domains` VALUES ('D001','C008','rigearthing.com','GoDaddy','2023-05-15','2024-05-15','2024-05-15','No','Expired',1200.00,'OK','Expired','ns1.godaddy.com, ns2.godaddy.com','Managed on client profile','Payment Status: Paid. Remarks: 2,557','2026-09-25 06:23:34','2026-09-25 06:23:34'),('D002','C010','agtechnosolutions.in','Hostinger','2026-06-06','2027-06-06','2027-06-06','Yes','Active',1300.00,'OK','Active','ns1.dns-serv.com, ns2.dns-serv.com','Username: agtechno | Pass: **********','Purchased Date: 06/06/2026. Payment Status: Paid.','2026-09-25 06:23:34','2026-09-25 06:23:34'),('D003','C011','indusconcretepolishing.com','Namecheap','2024-07-16','2025-07-16','2025-07-16','No','Expired',1000.00,'OK','Expired','dns1.namecheaphosting.com, dns2.namecheaphosting.com','Managed on client profile','Yearly Maintenance: 5000. Remarks: 2440.','2026-09-25 06:23:34','2026-09-25 06:23:34'),('D004','C012','thynkdigitalsolutions.com','GoDaddy','2024-08-27','2025-08-27','2025-08-27','No','Expired',1000.00,'OK','Expired','ns3.godaddy.com, ns4.godaddy.com','Managed on client profile','Remarks: 2440.','2026-09-25 06:23:34','2026-09-25 06:23:34'),('D005','C013','mpshospitals.in','Hostinger','2023-09-08','2024-09-08','2024-09-08','No','Expired',1261.00,'OK','Expired','ns1.hostinger.com, ns2.hostinger.com','Username: mpshosp | Pass: **********','Remarks: 1951 + 1261 (1261 domain, 1951 hosting).','2026-09-25 06:23:34','2026-09-25 06:23:34'),('D006','C014','mpshospitals.com','Hostinger','2023-09-08','2024-09-08','2024-09-08','No','Expired',1179.00,'OK','Expired','ns1.hostinger.com, ns2.hostinger.com','Username: mpshosp | Pass: **********','Remarks: 1179.','2026-09-25 06:23:34','2026-09-25 06:23:34'),('D007','C009','indusdentalcare.com','GoDaddy','2023-10-28','2024-10-28','2024-10-28','No','Expired',1200.00,'OK','Expired','ns5.godaddy.com, ns6.godaddy.com','Managed on client profile','Remarks: 2522.','2026-09-25 06:23:34','2026-09-25 06:23:34'),('D008','C015','wincube5s.com','Hostinger','2025-11-02','2026-11-02','2026-11-02','Yes','Active',1440.00,'OK','Active','ns1.hostinger.com, ns2.hostinger.com','Username: wincube | Pass: **********','Remarks: 1,440.','2026-09-25 06:23:34','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `domains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employees` (
  `id` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(50) DEFAULT '',
  `username` varchar(100) DEFAULT '',
  `password_hash` varchar(255) NOT NULL,
  `department` varchar(100) DEFAULT '',
  `designation` varchar(100) DEFAULT '',
  `role` varchar(100) DEFAULT 'Employee',
  `joining_date` varchar(50) DEFAULT '',
  `salary` decimal(12,2) DEFAULT 0.00,
  `manager_id` varchar(50) DEFAULT 'Admin',
  `status` varchar(50) DEFAULT 'Active',
  `photo` text DEFAULT NULL,
  `permissions` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_emp_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES ('E001','Gokul R','admin@thynkdigital.in','9876598765','admin','$2y$10$CwxDbwNh5H2AhJ/Air2ArOISiY9zOH4wkddxZXBEMx2ZclBGIT2uq','Development','Lead Web Developer','Administrator','2023-05-15',75000.00,'Admin','Active','https://randomuser.me/api/portraits/men/32.jpg','{\"crm\":true,\"hrms\":true,\"accounts\":true,\"marketing\":true,\"admin\":true}','2026-09-25 06:23:34','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `followups`
--

DROP TABLE IF EXISTS `followups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `followups` (
  `id` varchar(50) NOT NULL,
  `client_id` varchar(50) NOT NULL,
  `last_contact` varchar(50) DEFAULT '',
  `next_followup` varchar(50) NOT NULL,
  `type` varchar(50) DEFAULT 'WhatsApp',
  `assigned_employee_id` varchar(50) DEFAULT '',
  `status` varchar(50) DEFAULT 'Pending',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `followups`
--

LOCK TABLES `followups` WRITE;
/*!40000 ALTER TABLE `followups` DISABLE KEYS */;
INSERT INTO `followups` VALUES ('F001','C001','2026-06-20','2026-07-02','WhatsApp','E002','Pending','Ask about Lead Quality reports reviews.','2026-09-25 07:36:45','2026-09-25 07:36:45'),('F002','C002','2026-06-18','2026-06-27','Phone Call','E003','Pending','Follow-up regarding salon campaign renewal budget.','2026-09-25 07:36:45','2026-09-25 07:36:45'),('F003','C003','2026-06-25','2026-06-28','Meeting','E001','Pending','Review website landing pages structure.','2026-09-25 07:36:45','2026-09-25 07:36:45');
/*!40000 ALTER TABLE `followups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `google_ads`
--

DROP TABLE IF EXISTS `google_ads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `google_ads` (
  `id` varchar(50) NOT NULL,
  `client_id` varchar(50) DEFAULT '',
  `campaign_name` varchar(255) NOT NULL,
  `objective` varchar(100) DEFAULT 'Sales / Signups',
  `package_amount` decimal(12,2) DEFAULT 0.00,
  `ad_budget` decimal(12,2) DEFAULT 0.00,
  `start_date` varchar(50) DEFAULT '',
  `end_date` varchar(50) DEFAULT '',
  `reach` int(11) DEFAULT 0,
  `clicks` int(11) DEFAULT 0,
  `leads` int(11) DEFAULT 0,
  `cpl` decimal(10,2) DEFAULT 0.00,
  `roas` decimal(6,2) DEFAULT 0.00,
  `status` varchar(50) DEFAULT 'Running',
  `assigned_employee_id` varchar(50) DEFAULT '',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `google_ads`
--

LOCK TABLES `google_ads` WRITE;
/*!40000 ALTER TABLE `google_ads` DISABLE KEYS */;
INSERT INTO `google_ads` VALUES ('G001','C001','Zenith - Cloud Services Search','Sales / Signups',40000.00,25000.00,'2026-05-15','2026-08-15',35000,1890,95,263.15,2.80,'Running','E004','High competition keywords targeting enterprise accounts.','2026-09-25 07:36:45','2026-09-25 07:36:45');
/*!40000 ALTER TABLE `google_ads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hostings`
--

DROP TABLE IF EXISTS `hostings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hostings` (
  `id` varchar(50) NOT NULL,
  `client_id` varchar(50) DEFAULT '',
  `hosting_provider` varchar(100) DEFAULT '',
  `hosting_plan` varchar(100) DEFAULT '',
  `server_type` varchar(50) DEFAULT 'Linux',
  `purchase_date` varchar(50) DEFAULT '',
  `expiry_date` varchar(50) DEFAULT '',
  `renewal_date` varchar(50) DEFAULT '',
  `renewal_cost` decimal(12,2) DEFAULT 0.00,
  `disk_space` varchar(100) DEFAULT '',
  `bandwidth` varchar(100) DEFAULT '',
  `control_panel` varchar(100) DEFAULT 'hPanel',
  `ssl_expiry` varchar(50) DEFAULT '',
  `backup_status` varchar(100) DEFAULT 'Weekly Auto',
  `status` varchar(50) DEFAULT 'Active',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hostings`
--

LOCK TABLES `hostings` WRITE;
/*!40000 ALTER TABLE `hostings` DISABLE KEYS */;
INSERT INTO `hostings` VALUES ('H001','C008','Hostinger','Premium Shared Hosting','Linux','2023-05-15','2024-05-15','2024-05-15',1357.00,'100 GB SSD','Unlimited','hPanel','2024-05-15','Weekly Auto','Expired','Remarks: 2,557. Payment Status: Paid.','2026-09-25 06:23:34','2026-09-25 06:23:34'),('H002','C010','Hostinger','Cloud Startup','Linux','2026-06-06','2027-06-06','2027-06-06',2500.00,'200 GB SSD','Unlimited','hPanel','2027-06-06','Daily Auto','Active','Purchased Date: 06/06/2026. Payment Status: Paid.','2026-09-25 06:23:34','2026-09-25 06:23:34'),('H003','C011','Hostinger','Premium Shared','Linux','2024-07-16','2025-07-16','2025-07-16',1440.00,'100 GB','Unlimited','hPanel','2025-07-16','Weekly Auto','Expired','Yearly Maintenance: 5000. Remarks: 2440.','2026-09-25 06:23:34','2026-09-25 06:23:34'),('H004','C012','Hostinger','Cloud Professional','Linux','2024-08-27','2025-08-27','2025-08-27',1440.00,'250 GB','Unlimited','hPanel','2025-08-27','Daily Auto','Expired','Remarks: 2440.','2026-09-25 06:23:34','2026-09-25 06:23:34'),('H005','C013','Hostinger','Premium Shared','Linux','2023-09-08','2024-09-08','2024-09-08',1951.00,'100 GB','Unlimited','hPanel','2024-09-08','Weekly Auto','Expired','Remarks: 1951 + 1261 (1951 hosting, 1261 domain).','2026-09-25 06:23:34','2026-09-25 06:23:34'),('H006','C014','Hostinger','Premium Shared','Linux','2023-09-08','2024-09-08','2024-09-08',0.00,'100 GB','Unlimited','hPanel','2024-09-08','Weekly Auto','Expired','Remarks: 1179.','2026-09-25 06:23:34','2026-09-25 06:23:34'),('H007','C009','Hostinger','Premium Shared','Linux','2023-10-28','2024-10-28','2024-10-28',1322.00,'100 GB','Unlimited','hPanel','2024-10-28','Weekly Auto','Expired','Remarks: 2522.','2026-09-25 06:23:34','2026-09-25 06:23:34'),('H008','C015','Hostinger','Single Shared','Linux','2025-11-02','2026-11-02','2026-11-02',0.00,'50 GB','100 GB','hPanel','2026-11-02','Weekly Auto','Active','Remarks: 1,440.','2026-09-25 06:23:34','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `hostings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoices` (
  `id` varchar(50) NOT NULL,
  `client_id` varchar(50) NOT NULL,
  `invoice_date` varchar(50) NOT NULL,
  `due_date` varchar(50) NOT NULL,
  `service_id` varchar(50) DEFAULT '',
  `gross_amount` decimal(12,2) NOT NULL,
  `gst_rate` decimal(5,2) DEFAULT 18.00,
  `gst_amount` decimal(12,2) DEFAULT 0.00,
  `discount` decimal(12,2) DEFAULT 0.00,
  `net_amount` decimal(12,2) NOT NULL,
  `status` varchar(50) DEFAULT 'Pending Payment',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES ('INV-2026-001','C001','2026-01-10','2026-01-20','S001',55000.00,18.00,9900.00,0.00,64900.00,'Paid','2026-09-25 06:23:34','2026-09-25 06:23:34'),('INV-2026-002','C001','2026-01-10','2026-01-25','S002',110000.00,18.00,19800.00,5000.00,124800.00,'Partial','2026-09-25 06:23:34','2026-09-25 06:23:34'),('INV-2026-003','C002','2026-03-15','2026-03-30','S005',33000.00,18.00,5940.00,0.00,38940.00,'Partial','2026-09-25 06:23:34','2026-09-25 06:23:34'),('INV-2026-004','C003','2026-05-10','2026-05-25','S007',135000.00,18.00,24300.00,10000.00,149300.00,'Partial','2026-09-25 06:23:34','2026-09-25 06:23:34'),('INV-2026-005','C004','2025-05-05','2025-05-20','S010',36000.00,18.00,6480.00,0.00,42480.00,'Pending Payment','2026-09-25 06:23:34','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leads` (
  `id` varchar(50) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `contact_name` varchar(150) NOT NULL,
  `mobile` varchar(50) DEFAULT '',
  `email` varchar(150) DEFAULT '',
  `source` varchar(100) DEFAULT '',
  `value` decimal(12,2) DEFAULT 0.00,
  `status` varchar(50) DEFAULT 'Hot',
  `assigned_employee_id` varchar(50) DEFAULT '',
  `notes` text DEFAULT NULL,
  `date_created` varchar(50) DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
INSERT INTO `leads` VALUES ('L001','Nexus Retailers','Ananya Sharma','9876543210','contact@nexusretail.com','Website Inquiry',45000.00,'Hot','E002','Very interested in Meta Ads packages.','2026-06-15','2026-09-25 07:36:45','2026-09-25 07:36:45'),('L002','Apex Wellness Cafe','Rohan Verma','9812345678','info@apexwellness.in','Instagram DM',30000.00,'Warm','E003','Needs logo and local SEO optimization.','2026-06-20','2026-09-25 07:36:45','2026-09-25 07:36:45'),('L003','Trident Logistics','Vikram Malhotra','8888777766','v.malhotra@tridentlog.com','LinkedIn Outreach',120000.00,'Cold','E001','Sent agency pitch deck. Waiting for reply.','2026-06-10','2026-09-25 06:48:48','2026-09-25 06:48:48'),('L004','Saffron Spices Co.','Pooja Patel','7776665554','sales@saffronspices.com','Referral',85000.00,'Hot','E004','Needs Website development and SEO package.','2026-06-25','2026-09-25 06:48:48','2026-09-25 06:48:48'),('L005','Zenith Realties','Kabir Mehta','9900990099','info@zenithrealty.in','Google Search',200000.00,'Warm','E002','Inquired about Meta + Google Ads lead generation.','2026-06-22','2026-09-25 06:48:48','2026-09-25 06:48:48');
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_allocations`
--

DROP TABLE IF EXISTS `leave_allocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leave_allocations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` varchar(50) NOT NULL,
  `allocation_type` varchar(50) DEFAULT 'monthly',
  `allowance` int(11) DEFAULT 4,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_alloc_emp` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_allocations`
--

LOCK TABLES `leave_allocations` WRITE;
/*!40000 ALTER TABLE `leave_allocations` DISABLE KEYS */;
INSERT INTO `leave_allocations` VALUES (1,'E001','monthly',4,'2026-09-25 06:23:34','2026-09-25 06:23:34'),(2,'E002','monthly',4,'2026-09-25 06:23:34','2026-09-25 06:23:34'),(3,'E003','monthly',4,'2026-09-25 06:23:34','2026-09-25 06:23:34'),(4,'E004','monthly',4,'2026-09-25 06:23:34','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `leave_allocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leaves`
--

DROP TABLE IF EXISTS `leaves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leaves` (
  `id` varchar(50) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `leave_type` varchar(100) NOT NULL,
  `start_date` varchar(50) NOT NULL,
  `end_date` varchar(50) NOT NULL,
  `total_days` int(11) DEFAULT 1,
  `reason` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_leave_emp` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaves`
--

LOCK TABLES `leaves` WRITE;
/*!40000 ALTER TABLE `leaves` DISABLE KEYS */;
INSERT INTO `leaves` VALUES ('L01','E002','Sick Leave','2026-06-12','2026-06-13',2,'Viral fever','Approved','2026-09-25 06:23:34','2026-09-25 06:23:34'),('L02','E004','Casual Leave','2026-06-29','2026-06-30',2,'Family event out of town','Approved','2026-09-25 06:23:34','2026-09-25 06:23:34'),('L03','E001','Privilege Leave','2026-07-15','2026-07-20',5,'Summer vacation trip','Pending','2026-09-25 06:23:34','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `leaves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meta_ads`
--

DROP TABLE IF EXISTS `meta_ads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meta_ads` (
  `id` varchar(50) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `campaign_name` varchar(255) NOT NULL,
  `objective` varchar(100) DEFAULT 'Lead Generation',
  `package_amount` decimal(12,2) DEFAULT 0.00,
  `ad_budget` decimal(12,2) DEFAULT 0.00,
  `start_date` varchar(50) DEFAULT '',
  `end_date` varchar(50) DEFAULT '',
  `renewal_date` varchar(50) DEFAULT '',
  `status` varchar(50) DEFAULT 'Running',
  `assigned_employee_id` varchar(50) DEFAULT '',
  `remarks` text DEFAULT NULL,
  `daily_performance` longtext DEFAULT NULL,
  `payments` longtext DEFAULT NULL,
  `notes` longtext DEFAULT NULL,
  `followups` longtext DEFAULT NULL,
  `timeline` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meta_ads`
--

LOCK TABLES `meta_ads` WRITE;
/*!40000 ALTER TABLE `meta_ads` DISABLE KEYS */;
INSERT INTO `meta_ads` VALUES ('MC001','RIG Fabrication','Earthing Leads','Lead Generation',15000.00,10000.00,'2026-07-01','2026-07-31','2026-07-31','Running','E002','Good response so far','[{\"date\":\"2026-07-01\",\"adSpend\":350,\"reach\":2850,\"clicks\":78,\"leads\":6,\"remarks\":\"Good response\"},{\"date\":\"2026-07-02\",\"adSpend\":420,\"reach\":3420,\"clicks\":95,\"leads\":9,\"remarks\":\"CPL improved\"},{\"date\":\"2026-07-03\",\"adSpend\":380,\"reach\":3100,\"clicks\":82,\"leads\":7,\"remarks\":\"Stable performance\"}]','[{\"date\":\"2026-07-01\",\"amount\":5000,\"mode\":\"UPI\",\"transactionId\":\"TXN123\",\"remarks\":\"Advance\"},{\"date\":\"2026-07-10\",\"amount\":5000,\"mode\":\"Bank Transfer\",\"transactionId\":\"TXN155\",\"remarks\":\"Second Payment\"},{\"date\":\"2026-07-28\",\"amount\":5000,\"mode\":\"Cash\",\"transactionId\":\"TXN199\",\"remarks\":\"Final Payment\"}]','[{\"id\":\"MN101\",\"title\":\"Budget Adjustment\",\"description\":\"Increased daily budget limit to capture peak hour traffic.\",\"date\":\"2026-07-02 10:00\",\"createdBy\":\"Neha Sharma\",\"priority\":\"Medium\",\"tags\":\"Budget\"},{\"id\":\"MN102\",\"title\":\"Creative Refresh\",\"description\":\"Uploaded new Earth-rod product display banners.\",\"date\":\"2026-07-05 14:30\",\"createdBy\":\"Neha Sharma\",\"priority\":\"Low\",\"tags\":\"Creative\"}]','[{\"id\":\"MF101\",\"date\":\"2026-07-01\",\"nextFollowup\":\"2026-07-05\",\"type\":\"WhatsApp\",\"summary\":\"Sent onboarding checklist for Meta campaign\",\"assignedEmployeeId\":\"E002\",\"status\":\"Completed\"},{\"id\":\"MF102\",\"date\":\"2026-07-05\",\"nextFollowup\":\"2026-07-15\",\"type\":\"Phone Call\",\"summary\":\"Reviewed week 1 leads sheet with client\",\"assignedEmployeeId\":\"E002\",\"status\":\"Completed\"}]','[{\"timestamp\":\"2026-07-01 09:00:00\",\"text\":\"Campaign Created\",\"icon\":\"fa-plus\",\"eventType\":\"create\"},{\"timestamp\":\"2026-07-01 18:30:00\",\"text\":\"Daily Performance Added\",\"icon\":\"fa-chart-line\",\"eventType\":\"performance\"},{\"timestamp\":\"2026-07-02 10:00:00\",\"text\":\"Budget Increased to Ôé╣500/day\",\"icon\":\"fa-arrow-up\",\"eventType\":\"budget\"},{\"timestamp\":\"2026-07-05 12:00:00\",\"text\":\"Ôé╣5,000 Payment Received\",\"icon\":\"fa-receipt\",\"eventType\":\"payment\"}]','2026-09-25 06:23:34','2026-09-25 06:23:34'),('MC002','RIG Fabrication','Lightning Arrestor','WhatsApp Leads',20000.00,12000.00,'2026-06-15','2026-07-15','2026-07-15','Completed','E002','High conversions','[{\"date\":\"2026-06-15\",\"adSpend\":400,\"reach\":3100,\"clicks\":88,\"leads\":8,\"remarks\":\"Launched successfully\"},{\"date\":\"2026-06-16\",\"adSpend\":410,\"reach\":3200,\"clicks\":90,\"leads\":9,\"remarks\":\"Consistent response\"}]','[{\"date\":\"2026-06-15\",\"amount\":10000,\"mode\":\"UPI\",\"transactionId\":\"TXN150\",\"remarks\":\"50% Advance\"},{\"date\":\"2026-07-15\",\"amount\":10000,\"mode\":\"UPI\",\"transactionId\":\"TXN151\",\"remarks\":\"Final Settlement\"}]','[]','[]','[{\"timestamp\":\"2026-06-15 09:30:00\",\"text\":\"Campaign Created\",\"icon\":\"fa-plus\",\"eventType\":\"create\"}]','2026-09-25 06:23:34','2026-09-25 06:23:34'),('MC003','RIG Fabrication','GI Strip Campaign','Messages',10000.00,7000.00,'2026-08-01','2026-08-31','2026-08-31','Scheduled','E002','Banners approved by client','[]','[{\"date\":\"2026-06-25\",\"amount\":5000,\"mode\":\"UPI\",\"transactionId\":\"TXN180\",\"remarks\":\"Initial token booking amount\"}]','[]','[]','[{\"timestamp\":\"2026-06-25 11:00:00\",\"text\":\"Campaign Scheduled & Token Received\",\"icon\":\"fa-calendar\",\"eventType\":\"schedule\"}]','2026-09-25 06:23:34','2026-09-25 06:23:34'),('MC004','Indus Dental Care','Dental Implants Campaign','Lead Generation',12000.00,8000.00,'2026-02-01','2026-02-28','2026-02-28','Completed','E002','Satisfactory cost per lead','[{\"date\":\"2026-02-01\",\"adSpend\":300,\"reach\":2100,\"clicks\":60,\"leads\":5,\"remarks\":\"Initial launch\"},{\"date\":\"2026-02-02\",\"adSpend\":320,\"reach\":2400,\"clicks\":72,\"leads\":6,\"remarks\":\"Cost per lead stable\"}]','[{\"date\":\"2026-02-01\",\"amount\":6000,\"mode\":\"UPI\",\"transactionId\":\"TXN201\",\"remarks\":\"First Milestone\"},{\"date\":\"2026-02-20\",\"amount\":6000,\"mode\":\"Bank Transfer\",\"transactionId\":\"TXN202\",\"remarks\":\"Final Settlement\"}]','[]','[]','[{\"timestamp\":\"2026-02-01 10:00:00\",\"text\":\"Campaign Created\",\"icon\":\"fa-plus\",\"eventType\":\"create\"}]','2026-09-25 06:23:34','2026-09-25 06:23:34'),('MC005','Indus Dental Care','Teeth Whitening Promo','WhatsApp Leads',13000.00,9000.00,'2026-03-01','2026-03-31','2026-03-31','Completed','E002','Full advance paid','[{\"date\":\"2026-03-01\",\"adSpend\":250,\"reach\":1800,\"clicks\":50,\"leads\":4,\"remarks\":\"Good response\"}]','[{\"date\":\"2026-03-01\",\"amount\":13000,\"mode\":\"Bank Transfer\",\"transactionId\":\"TXN301\",\"remarks\":\"Full Advance Package Cost\"}]','[]','[]','[{\"timestamp\":\"2026-03-01 09:00:00\",\"text\":\"Campaign Created\",\"icon\":\"fa-plus\",\"eventType\":\"create\"}]','2026-09-25 06:23:34','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `meta_ads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notes` (
  `id` varchar(50) NOT NULL,
  `client_id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `tags` longtext DEFAULT NULL,
  `created_by_id` varchar(50) DEFAULT '',
  `date_created` varchar(50) DEFAULT '',
  `pinned` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES ('N001','C001','B2B Meta Ads Strategy','Targeting CEOs, CTOs, and HR heads. Ad creative must emphasize efficiency gains.','[\"Strategy\", \"Ads\"]','E002','2026-06-18 10:20:00',1,'2026-09-25 07:36:45','2026-09-25 07:36:45'),('N002','C001','SEO Keyword Refinement','Include terms like AI staff augmentation and cloud consulting firms explicitly in future blog briefs.','[\"SEO\", \"Content\"]','E004','2026-06-22 14:15:00',0,'2026-09-25 07:36:45','2026-09-25 07:36:45'),('N003','C003','Website Styling Preferences','Amit prefers minimal layout, white backgrounds with blue accents, and responsive maps widget.','[\"WebDev\", \"Styling\"]','E001','2026-05-15 16:45:00',1,'2026-09-25 07:36:45','2026-09-25 07:36:45');
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT 'info',
  `date` varchar(50) DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('N1','RIG Fabrication Expired','Hosting for RIG Fabrication expired on May 15, 2024.','danger','May 15','2026-09-25 06:23:34'),('N2','Payment Received','Ôé╣3,800 received from Arun (Agtechnosolutions).','success','June 6','2026-09-25 06:23:34'),('N3','Leave Request','Ankit Kumar requested 5 days leave starting July 15.','info','June 25','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` varchar(50) NOT NULL,
  `invoice_no` varchar(100) DEFAULT '',
  `client_id` varchar(50) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `date` varchar(50) NOT NULL,
  `payment_mode` varchar(100) DEFAULT 'Bank Transfer',
  `transaction_id` varchar(100) DEFAULT '',
  `received_by_id` varchar(50) DEFAULT '',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES ('PAY001','INV-2026-001','C001',30000.00,'2026-01-12','Bank Transfer','TXN987654321A','E001','First advance payment for Meta Ads Setup','2026-09-25 07:36:45','2026-09-25 07:36:45'),('PAY002','INV-2026-001','C001',25000.00,'2026-02-15','UPI / GPay','TXN123456789B','E001','Final settlement for invoice 001','2026-09-25 07:36:45','2026-09-25 07:36:45'),('PAY003','INV-2026-002','C001',50000.00,'2026-01-20','Bank Transfer','TXN345678901C','E001','First milestone payment for Enterprise SEO','2026-09-25 07:36:45','2026-09-25 07:36:45'),('PAY004','INV-2026-003','C002',15000.00,'2026-03-18','UPI / PhonePe','TXN555666777D','E003','Social Media branding start budget','2026-09-25 07:36:45','2026-09-25 07:36:45'),('PAY005','INV-2026-004','C003',70000.00,'2026-05-12','Bank Transfer','TXN777888999E','E001','Advance for WordPress Portal','2026-09-25 07:36:45','2026-09-25 07:36:45');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `id` varchar(50) NOT NULL,
  `client_id` varchar(50) DEFAULT '',
  `project_name` varchar(255) NOT NULL,
  `website_type` varchar(100) DEFAULT 'Custom Website Development',
  `domain` varchar(255) DEFAULT '',
  `hosting` varchar(100) DEFAULT 'Hostinger',
  `start_date` varchar(50) DEFAULT '',
  `delivery_date` varchar(50) DEFAULT '',
  `progress` int(11) DEFAULT 0,
  `assigned_developer_id` varchar(50) DEFAULT '',
  `status` varchar(50) DEFAULT 'Running',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES ('P001','C003','Nutan Custom Builders Portal','Real Estate Portal','nutanbuilders.com','Hostinger Cloud','2026-05-10','2026-07-15',80,'E001','Running','WordPress setup done, frontend template integrated. Listing API in development.','2026-09-25 07:36:45','2026-09-25 07:36:45');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reminders`
--

DROP TABLE IF EXISTS `reminders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reminders` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `client_id` varchar(50) DEFAULT '',
  `service_id` varchar(50) DEFAULT '',
  `assigned_employee_id` varchar(50) DEFAULT '',
  `reminder_date` varchar(50) NOT NULL,
  `reminder_time` varchar(50) DEFAULT '10:00',
  `priority` varchar(50) DEFAULT 'Medium',
  `status` varchar(50) DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reminders`
--

LOCK TABLES `reminders` WRITE;
/*!40000 ALTER TABLE `reminders` DISABLE KEYS */;
INSERT INTO `reminders` VALUES ('R001','RIG Fabrication Hosting Expired','RIG Fabrication hosting has expired. Follow up with Ravi for payment of Ôé╣2,557.','C008','S003','E001','2026-06-28','11:00','High','Active','2026-09-25 06:23:34','2026-09-25 06:23:34'),('R002','Client Call - Priya Nair','Discuss Salon Meta Ads packages renewal budgets.','C002','S006','E003','2026-06-27','15:30','Medium','Active','2026-09-25 06:23:34','2026-09-25 06:23:34'),('R003','Agtechnosolutions Domain & Hosting Active','Agtechnosolutions domain & hosting active until June 2027.','C010','S004','E001','2026-07-12','10:00','High','Active','2026-09-25 06:23:34','2026-09-25 06:23:34'),('R004','Generate Monthly SEO Report','Publish monthly IT keywords report card.','C001','S002','E004','2026-07-01','18:00','Medium','Active','2026-09-25 06:23:34','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `reminders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seo`
--

DROP TABLE IF EXISTS `seo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `seo` (
  `id` varchar(50) NOT NULL,
  `client_id` varchar(50) DEFAULT '',
  `website_url` varchar(255) DEFAULT '',
  `campaign_name` varchar(255) NOT NULL,
  `package` varchar(100) DEFAULT 'Gold',
  `start_date` varchar(50) DEFAULT '',
  `end_date` varchar(50) DEFAULT '',
  `budget` decimal(12,2) DEFAULT 0.00,
  `status` varchar(50) DEFAULT 'Active',
  `report_date` varchar(50) DEFAULT '',
  `report_frequency` varchar(50) DEFAULT 'Monthly',
  `target_keywords` varchar(255) DEFAULT '',
  `current_ranking` varchar(100) DEFAULT '',
  `articles_published` int(11) DEFAULT 0,
  `backlinks` int(11) DEFAULT 0,
  `report_file` varchar(255) DEFAULT '',
  `assigned_employee_id` varchar(50) DEFAULT '',
  `progress` int(11) DEFAULT 0,
  `notes` text DEFAULT NULL,
  `keywords` longtext DEFAULT NULL,
  `weekly_log` longtext DEFAULT NULL,
  `uploaded_reports` longtext DEFAULT NULL,
  `ga4` longtext DEFAULT NULL,
  `gsc` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seo`
--

LOCK TABLES `seo` WRITE;
/*!40000 ALTER TABLE `seo` DISABLE KEYS */;
INSERT INTO `seo` VALUES ('SEO002','C009','https://www.indusdentalcare.com','Indus Dental Care SEO','Silver','2026-02-15','2026-08-15',35000.00,'Active','2026-07-02','Weekly','Target Keywords','Page 1 - Rank 10+',0,0,'','',0,'Auto-synchronized from Service Contract.','[{\"id\":\"KW004\",\"keyword\":\"Target Keywords\",\"targetUrl\":\"https://www.indusdentalcare.com\",\"searchEngine\":\"Google\",\"location\":\"Local\",\"device\":\"Mobile\",\"currentRank\":11,\"previousRank\":15,\"searchVolume\":500,\"difficulty\":32,\"status\":\"Improved\"}]','[{\"weekDate\":\"2026-06-20\",\"keyword\":\"Target Keywords\",\"prevRank\":15,\"currRank\":11,\"rankChange\":4,\"status\":\"Improved\",\"remarks\":\"Local business listing verified.\"}]','[]','{\"users\":1200,\"sessions\":1600,\"engagedSessions\":950,\"views\":2800,\"bounceRate\":40.5,\"avgEngagementTime\":98,\"conversions\":45}','{\"totalClicks\":320,\"totalImpressions\":9500,\"avgCtr\":3.37,\"avgPosition\":22.8,\"topQueries\":[{\"query\":\"best dentist in location\",\"clicks\":120,\"impressions\":1800},{\"query\":\"indus dental care appointments\",\"clicks\":95,\"impressions\":500}],\"topPages\":[{\"page\":\"/\",\"clicks\":210,\"impressions\":3800},{\"page\":\"/book-appointment\",\"clicks\":90,\"impressions\":2500}]}','2026-09-25 06:23:34','2026-09-25 06:23:34'),('SEO01','C001','https://www.zenithlabs.com','Zenith Tech Labs SEO','Gold','2026-01-10','2026-07-10',60000.00,'Active','2026-06-30','Monthly','enterprise it consulting services, offshore cloud developer','Page 1 - Rank 4, Page 1 - Rank 8',14,120,'zenith_labs_seo_may_2026.pdf','E004',75,'Organic traffic increased by 22% month-on-month.','[{\"id\":\"KW001\",\"keyword\":\"enterprise it consulting services\",\"targetUrl\":\"https://www.zenithlabs.com/services\",\"searchEngine\":\"Google\",\"location\":\"Global\",\"device\":\"Desktop\",\"currentRank\":4,\"previousRank\":7,\"searchVolume\":1200,\"difficulty\":65,\"status\":\"Improved\"},{\"id\":\"KW002\",\"keyword\":\"offshore cloud developer\",\"targetUrl\":\"https://www.zenithlabs.com/cloud\",\"searchEngine\":\"Google\",\"location\":\"US\",\"device\":\"Desktop\",\"currentRank\":8,\"previousRank\":8,\"searchVolume\":850,\"difficulty\":58,\"status\":\"No Change\"},{\"id\":\"KW003\",\"keyword\":\"it outsourcing solutions\",\"targetUrl\":\"https://www.zenithlabs.com/outsourcing\",\"searchEngine\":\"Google\",\"location\":\"Global\",\"device\":\"Mobile\",\"currentRank\":12,\"previousRank\":9,\"searchVolume\":1500,\"difficulty\":72,\"status\":\"Dropped\"}]','[{\"weekDate\":\"2026-06-15\",\"keyword\":\"enterprise it consulting services\",\"prevRank\":7,\"currRank\":6,\"rankChange\":1,\"status\":\"Improved\",\"remarks\":\"Backlink index update helped.\"},{\"weekDate\":\"2026-06-15\",\"keyword\":\"offshore cloud developer\",\"prevRank\":8,\"currRank\":8,\"rankChange\":0,\"status\":\"Stable\",\"remarks\":\"No rank fluctuations.\"},{\"weekDate\":\"2026-06-22\",\"keyword\":\"enterprise it consulting services\",\"prevRank\":6,\"currRank\":4,\"rankChange\":2,\"status\":\"Improved\",\"remarks\":\"New article indexed.\"},{\"weekDate\":\"2026-06-22\",\"keyword\":\"it outsourcing solutions\",\"prevRank\":9,\"currRank\":12,\"rankChange\":-3,\"status\":\"Dropped\",\"remarks\":\"Competitors bids increased.\"}]','[{\"uploadDate\":\"2026-05-31\",\"fileName\":\"zenith_labs_seo_may_2026.pdf\",\"fileSize\":\"1.8 MB\",\"notes\":\"Monthly executive summary report\",\"type\":\"ga4\"},{\"uploadDate\":\"2026-06-15\",\"fileName\":\"gsc_clicks_mid_june.csv\",\"fileSize\":\"450 KB\",\"notes\":\"Mid-month click index raw dump\",\"type\":\"gsc\"}]','{\"users\":4800,\"sessions\":6200,\"engagedSessions\":3900,\"views\":12500,\"bounceRate\":37.5,\"avgEngagementTime\":145,\"conversions\":310}','{\"totalClicks\":2100,\"totalImpressions\":48000,\"avgCtr\":4.38,\"avgPosition\":12.4,\"topQueries\":[{\"query\":\"enterprise cloud consulting\",\"clicks\":420,\"impressions\":3200},{\"query\":\"hire offshore developers\",\"clicks\":310,\"impressions\":4500},{\"query\":\"it outsourcing services global\",\"clicks\":180,\"impressions\":2100}],\"topPages\":[{\"page\":\"/services/cloud-consulting\",\"clicks\":850,\"impressions\":9800},{\"page\":\"/careers/offshore-developer\",\"clicks\":620,\"impressions\":12000},{\"page\":\"/blog/it-outsourcing-guide\",\"clicks\":410,\"impressions\":8400}]}','2026-09-25 06:23:34','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `seo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `id` varchar(50) NOT NULL,
  `client_id` varchar(50) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `package` varchar(255) DEFAULT '',
  `start_date` varchar(50) DEFAULT '',
  `end_date` varchar(50) DEFAULT '',
  `renewal_date` varchar(50) DEFAULT '',
  `assigned_employee_id` varchar(50) DEFAULT '',
  `cost` decimal(12,2) DEFAULT 0.00,
  `discount` decimal(12,2) DEFAULT 0.00,
  `final_amount` decimal(12,2) DEFAULT 0.00,
  `status` varchar(50) DEFAULT 'Running',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES ('S001','C001','Meta Ads Management','Growth Pro','2026-01-10','2026-07-10','2026-07-10','E002',60000.00,5000.00,55000.00,'Running','Focus on B2B courses.','2026-09-25 07:36:45','2026-09-25 07:36:45'),('S002','C001','SEO Management','Enterprise SEO','2026-01-10','2027-01-10','2027-01-10','E004',120000.00,10000.00,110000.00,'Running','Targeting high value IT keywords globally.','2026-09-25 07:36:45','2026-09-25 07:36:45'),('S003','C008','Hosting Renewal','RIG Earthing Hosting','2023-05-15','2024-05-15','2024-05-15','E001',2557.00,0.00,2557.00,'Expired','Domain: rigearthing.com','2026-09-25 06:23:34','2026-09-25 06:23:34'),('S004','C010','Domain Renewal','Agtechno Domain & Hosting','2026-06-06','2027-06-06','2027-06-06','E001',3800.00,0.00,3800.00,'Running','Domain: agtechnosolutions.in','2026-09-25 06:23:34','2026-09-25 06:23:34'),('S005','C002','Social Media Management','Essential Branding','2026-03-15','2026-09-15','2026-09-15','E003',35000.00,2000.00,33000.00,'Running','12 Posts/month + Reels editing.','2026-09-25 07:36:45','2026-09-25 07:36:45'),('S006','C002','Meta Ads Management','Starter Lead Gen','2026-03-20','2026-06-20','2026-07-20','E003',25000.00,0.00,25000.00,'Expired','Beauty package lead generation.','2026-09-25 07:36:45','2026-09-25 07:36:45'),('S007','C003','Website Development','Custom WordPress Portal','2026-05-10','2026-07-15','2026-07-15','E001',150000.00,15000.00,135000.00,'Running','RERA compliant builder site with inventory listing.','2026-09-25 07:36:45','2026-09-25 07:36:45'),('S008','C011','Hosting Renewal','Indus Concrete Hosting','2024-07-16','2025-07-16','2025-07-16','E001',2440.00,0.00,2440.00,'Expired','Domain: indusconcretepolishing.com','2026-09-25 06:23:34','2026-09-25 06:23:34'),('S009','C012','Domain Renewal','Thynk Domain & Hosting','2024-08-27','2025-08-27','2025-08-27','E001',2440.00,0.00,2440.00,'Expired','Domain: thynkdigitalsolutions.com','2026-09-25 06:23:34','2026-09-25 06:23:34'),('S010','C004','Google Ads Management','B2B Standard','2025-05-05','2026-05-05','2026-05-05','E004',40000.00,4000.00,36000.00,'Expired','Paused since client account inactive.','2026-09-25 07:36:45','2026-09-25 07:36:45');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES ('agencyName','Thynk Digital Solution','2026-09-25 06:23:34'),('currencySymbol','₹','2026-09-25 07:36:45'),('email','contact@thynkdigital.in','2026-09-25 06:23:34'),('gstPercentage','18','2026-09-25 06:23:34'),('phone','9876543210','2026-09-25 06:23:34'),('website','https://www.thynkdigital.in','2026-09-25 06:23:34');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `id` varchar(50) NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `client_id` varchar(50) DEFAULT '',
  `service_id` varchar(50) DEFAULT '',
  `assigned_employee_id` varchar(50) DEFAULT '',
  `priority` varchar(50) DEFAULT 'Medium',
  `start_date` varchar(50) DEFAULT '',
  `due_date` varchar(50) DEFAULT '',
  `est_hours` decimal(6,2) DEFAULT 0.00,
  `progress` int(11) DEFAULT 0,
  `status` varchar(50) DEFAULT 'Pending',
  `comments` longtext DEFAULT NULL,
  `attachments` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_task_emp` (`assigned_employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES ('T001','Set up Nutan builders database schema','Design proper RERA inventory mappings.','C003','S007','E001','High','2026-05-15','2026-06-15',12.00,100,'Completed','[]',0,'2026-09-25 07:36:45','2026-09-25 07:36:45'),('T002','Design site mockups for Amit feedback','Develop mobile prototypes.','C003','S007','E001','High','2026-06-10','2026-06-28',20.00,85,'In Progress','[]',1,'2026-09-25 07:36:45','2026-09-25 07:36:45'),('T003','Review Zenith Lead quality logs','Evaluate target filters optimization.','C001','S001','E002','Medium','2026-06-20','2026-06-28',6.00,60,'In Progress','[]',0,'2026-09-25 07:36:45','2026-09-25 07:36:45'),('T005','Perform audit on Zenith target IT keywords','Determine backlink gap vs main competitors.','C001','S002','E004','High','2026-06-22','2026-06-27',10.00,90,'Review','[]',2,'2026-09-25 07:36:45','2026-09-25 07:36:45');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timeline`
--

DROP TABLE IF EXISTS `timeline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timeline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` varchar(50) NOT NULL,
  `event_type` varchar(50) DEFAULT 'info',
  `icon` varchar(50) DEFAULT 'fa-info-circle',
  `text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeline`
--

LOCK TABLES `timeline` WRITE;
/*!40000 ALTER TABLE `timeline` DISABLE KEYS */;
INSERT INTO `timeline` VALUES (1,'2026-06-26 11:30:00','payment','fa-receipt','Recorded payment of Ôé╣70,000 for Nutan Builders (Invoice #INV-2026-004)','2026-09-25 06:23:34'),(2,'2026-06-26 10:15:00','client','fa-user-plus','Added client Zenith Tech Labs (Rahul Sen)','2026-09-25 06:23:34'),(3,'2026-06-25 15:45:00','service','fa-cube','Created service Meta Ads Management for Zenith Tech Labs','2026-09-25 06:23:34'),(4,'2026-06-24 17:00:00','task','fa-check-double','Ankit Kumar completed task \'Set up Nutan builders database schema\'','2026-09-25 06:23:34'),(5,'2026-06-26 11:30:00','payment','fa-receipt','Recorded payment of ₹70,000 for Nutan Builders (Invoice #INV-2026-004)','2026-09-25 07:36:45'),(6,'2026-06-26 10:15:00','client','fa-user-plus','Added client Zenith Tech Labs (Rahul Sen)','2026-09-25 07:36:45'),(7,'2026-06-25 15:45:00','service','fa-cube','Created service Meta Ads Management for Zenith Tech Labs','2026-09-25 07:36:45'),(8,'2026-06-24 17:00:00','task','fa-check-double','Ankit Kumar completed task \'Set up Nutan builders database schema\'','2026-09-25 07:36:45');
/*!40000 ALTER TABLE `timeline` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-25 13:06:58
