DROP TABLE IF EXISTS `cart`;
DROP TABLE IF EXISTS `space`;

CREATE TABLE `space` (
  `id` int NOT NULL AUTO_INCREMENT,
  `space_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `capacity` int NOT NULL,
  `url_image` varchar(255) NOT NULL,
  `price_unit` decimal(10,2) NOT NULL,
  `space_type` varchar(45) NOT NULL,
  `space_category` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `space` VALUES 
(1,'L\'Atrium','Openspace lumineux à capacité réduite, idéal pour celles et ceux qui recherchent un environnement de travail plus calme tout en bénéficiant de la vie du Local.',20,'/assets/images/spaces/openspace/atrium.png',8.00,'Coworking','Openspace'),
(2,'Le Parvis','Openspace accueillant et accessible, proposant une ambiance sereine et un nombre limité de postes pour un confort de travail optimal.',20,'/assets/images/spaces/openspace/parvis.png',8.00,'Coworking','Openspace'),
(3,'L\'Agora','Openspace pensé pour accueillir les coworkers dans un environnement ouvert, dynamique et propice aux échanges.',50,'/assets/images/spaces/openspace/agora.png',8.00,'Coworking','Openspace'),
(4,'L\'Hémicycle','Grande salle de réunion du Local, conçue pour accueillir des présentations, séminaires, ateliers et rencontres professionnelles dans un cadre confortable et fonctionnel.',40,'/assets/images/spaces/meeting-room/hemicycle.png',80.00,'Coworking','Salle de réunion'),
(5,'La Rotonde','Salle de réunion à taille humaine offrant un cadre propice aux discussions, à la prise de décision et aux réunions de travail en petit groupe.',8,'/assets/images/spaces/meeting-room/rotonde.png',40.00,'Coworking','Salle de réunion'),
(6,'Le Sénat','Salle de réunion dédiée aux échanges professionnels, idéale pour les comités de pilotage, réunions d\'équipe et rendez-vous avec des partenaires ou clients.',10,'/assets/images/spaces/meeting-room/senat.png',60.00,'Coworking','Salle de réunion'),
(7,'Le Forum','Openspace spacieux et modulable offrant de nombreuses places de travail dans un cadre confortable favorisant la collaboration et la convivialité.',50,'/assets/images/spaces/openspace/forum.png',8.00,'Coworking','Openspace'),
(8,'L\'Annexe I','Local vide de 30 m² permettant d\'accueillir une activité professionnelle, associative, artisanale ou commerciale selon vos besoins.',1,'/assets/images/spaces/empty-space/annexe-1.png',450.00,'Coworking','Local vide'),
(9,'L\'Annexe II','Local vide de 30 m² offrant un espace flexible pour développer vos projets et activités.',1,'/assets/images/spaces/empty-space/annexe-2.png',450.00,'Coworking','Local vide'),
(10,'Le Pavillon I','Local vide de 60 m² permettant l\'installation d\'une activité, d\'un bureau, d\'un showroom ou d\'un espace de travail personnalisé.',1,'/assets/images/spaces/empty-space/pavillon-1.png',700.00,'Coworking','Local vide'),
(11,'Le Pavillon II','Local vide de 60 m² offrant un espace modulable adapté aux entreprises, associations et porteurs de projets.',1,'/assets/images/spaces/empty-space/pavillon-2.png',700.00,'Coworking','Local vide'),
(12,'L\'Odéon','Salle de concert du Local pouvant accueillir jusqu\'à 250 personnes pour des spectacles, concerts, conférences et événements culturels.',250,'/assets/images/spaces/events/odeon.png',500.00,'Evenements','Salle de concert'),
(13,'L\'Amphithéâtre','Amphithéâtre conçu pour les conférences, formations, projections et présentations publiques dans un cadre adapté aux grands rassemblements.',150,'/assets/images/spaces/events/amphitheatre.png',100.00,'Evenements','Amphithéâtre'),
(14,'L\'Atelier Voltaire','Espace dédié à l\'impression 3D, au prototypage et à la fabrication numérique.',5,'/assets/images/workshop/voltaire.png',10.00,'Ateliers','Atelier'),
(15,'L\'Atelier des Couleurs','Espace créatif dédié à la peinture, aux arts plastiques et aux activités artistiques.',8,'/assets/images/workshop/couleurs.png',10.00,'Ateliers','Atelier'),
(16,'L\'Atelier des Étoffes','Espace équipé pour la couture, la création textile et les travaux de confection.',6,'/assets/images/workshop/etoffes.png',15.00,'Ateliers','Atelier'),
(17,'L\'Atelier Gutenberg','Espace dédié à l\'impression, à la reprographie et à la production de documents.',10,'/assets/images/workshop/atelier.png',2.00,'Ateliers','Atelier'),
(18,'L\'Acoustique','Studio d\'enregistrement conçu pour les prises de son, les répétitions et les productions audio dans un cadre confortable et performant.',1,'/assets/images/spaces/studio/acoustique.png',250.00,'Ateliers','Studio d\'enregistrement'),
(19,'Le Conservatoire','Studio d\'enregistrement premium du Local, équipé pour la production musicale, les podcasts et les créations audio professionnelles dans un environnement haut de gamme.',1,'/assets/images/spaces/studio/conservatoire.png',500.00,'Ateliers','Studio d\'enregistrement'),
(20,'La Chambre Noire','Studio photo équipé pour les séances de prise de vue, la création de contenus visuels et les projets photographiques professionnels ou créatifs.',1,'/assets/images/spaces/studio/chambre-noire.png',50.00,'Ateliers','Studio photo'),
(21,'L\'Escale','Espace détente du Local, pensé comme une bulle de calme et de lumière, idéal pour se reposer, échanger informellement ou faire une pause entre deux temps de travail dans un cadre apaisant.',50,'/assets/images/spaces/break-room/escale.png',0,'Détente','Salle détente'),
(22,'La Serre','Espace détente du Local, chaleureux et végétalisé, offrant un environnement calme et ressourçant pour se relaxer, discuter ou simplement souffler au cœur de la journée.',50,'/assets/images/spaces/break-room/serre.png',0,'Détente','Salle détente');

DROP TABLE IF EXISTS `time_slot`;

CREATE TABLE `time_slot` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slot` varchar(255) NOT NULL,
  `start_hour` time NOT NULL,
  `end_hour` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `time_slot` VALUES (1,'Matin','08:00:00','14:00:00'),(2,'Après-midi','14:00:00','20:00:00'),(3,'Soir','20:00:00','00:00:00'),(4,'Journée','8:00:00','20:00:00');

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(45) NOT NULL,
  `email` varchar(150) NOT NULL,
  `lastname` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fortgot_password` varchar(255) NOT NULL,
  `city` varchar(150) DEFAULT NULL,
  `adress` varchar(255) DEFAULT NULL,
  `role` varchar(20) NOT NULL,
  `profile_image` text,
  `firstname` varchar(150) NOT NULL,
  `signing_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `phone_number_UNIQUE` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO users VALUES 
(1,'0123456789','nina.richard@lelocal.fr','Richard','$argon2id$v=19$m=65536,t=3,p=4$q6gf2x4DZqzG+fcle0NyOQ$XVkebpNys34lZ2D1sF3TtisOMrJ8X6/vneDss45GSjk','',NULL,NULL,'admin',NULL,'Nina','2026-05-01 00:00:00'),
(2,'0611223344','admin2@lelocal.fr','Dupont','$argon2id$v=19$m=65536,t=3,p=4$Wvw6//w0PwWbnsFTAP1G9w$Om9jgcbU2XRQf5SFeukUdnDVy0+RusLrHcnI94apilc','',NULL,NULL,'admin',NULL,'Julie','2026-06-22 00:00:00');

DROP TABLE IF EXISTS `activity`;

CREATE TABLE `activity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `time_slot_id` int NOT NULL,
  `space_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `description` text,
  `price_unit` int DEFAULT '0',
  `url_image` varchar(255) NULL,
  `name` varchar(155) DEFAULT NULL,
  `users_id` int ,
  `status` VARCHAR(20) NOT NULL DEFAULT 'approved', 
  PRIMARY KEY (`id`),
  KEY `fk_time_slot_has_space_space_idx` (`space_id`),
  KEY `fk_time_slot_has_space_time_slot_idx` (`time_slot_id`),
  CONSTRAINT `fk_time_slot_has_space_space` FOREIGN KEY (`space_id`) REFERENCES `space` (`id`),
  CONSTRAINT `fk_time_slot_has_space_time_slot` FOREIGN KEY (`time_slot_id`) REFERENCES `time_slot` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `activity` VALUES 
(1,2,13,'2026-05-12','2026-05-12','Pitchez votre projet en 3 minutes devant la communaute Le Local.',0,'/assets/images/events/20261205_pitch_biere.webp','Soiree Pitch et Biere', 2, 'approved'),
(2,2,13,'2026-04-15','2026-04-15','Concert de jazz dans un cadre intimiste et chaleureux.',8,'/assets/images/events/20260415_concert_jazz.webp','Jazz en soiree', 2, 'approved'),
(3,2,12,'2026-03-20','2026-03-20','Projection suivie d un debat sur le cinema independant.',5,'/assets/images/events/20260320_cinedebat.webp','Cine-debat mars', 2, 'approved'),
(4,2,13,'2026-06-25','2026-06-25','Rencontre mensuelle des makers et bricoleurs du 11e.',0,'/assets/images/events/20260625_makers.webp','Rencontres Makers', 2, 'approved'),
(5,2,12,'2026-07-10','2026-07-10','Grande soiree musicale avec plusieurs artistes locaux.',12,'/assets/images/events/20260710_festival.webp','Festival local juillet', 2, 'approved'),
(6,1,13,'2026-08-05','2026-08-05','Atelier d ecriture creative ouvert a tous les niveaux.',0,'/assets/images/events/20260805_atelier_ecriture.webp','Atelier ecriture aout', 2, 'approved'),
(7,1,3,'2026-05-05','2026-05-05','Session de travail matinale dans un espace calme.',8,'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&auto=format','Coworking matin - Atrium', 2, 'approved'),
(8,2,3,'2026-05-20','2026-05-20','Session de travail apres-midi dans un espace calme.',8,'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&auto=format','Coworking apres-midi - Atrium', 2, 'approved'),
(9,1,2,'2026-04-10','2026-04-10','Session de travail matinale dans un grand espace collaboratif.',8,'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop&auto=format','Coworking matin - Forum', 2, 'approved'),
(10,2,2,'2026-06-20','2026-06-20','Session de travail apres-midi dans un grand espace collaboratif.',8,'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop&auto=format','Coworking apres-midi - Forum', 2, 'approved'),
(11,1,14,'2026-07-15','2026-07-15','Session d impression 3D pour prototypage rapide.',10,'https://images.unsplash.com/photo-1631087060254-7c0f8e04c885?w=800&h=600&fit=crop&auto=format','Atelier impression 3D', 2, 'approved'),
(12,2,18,'2026-08-12','2026-08-12','Session d enregistrement en studio premium.',50,'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop&auto=format','Studio enregistrement', 2, 'approved'),
(13,1,12,'2026-09-10','2026-09-10','Soiree cinema en plein air avec projection sur grand ecran.',5,'/assets/images/events/20260910-cine.webp','Cinema plein air septembre', 2, 'approved'),
(14,2,13,'2026-09-25','2026-09-25','Concert acoustique avec artistes emergents du quartier.',8,'/assets/images/events/20260925_concert_acoustique.webp','Concert acoustique septembre', 2, 'approved'),
(15,1,3,'2026-07-22','2026-07-22','Session de coworking matinale en ete.',8,'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&auto=format','Coworking ete - Atrium', 2, 'approved'),
(16,2,14,'2026-08-20','2026-08-20','Session d impression 3D avancee pour makers.',15,'https://images.unsplash.com/photo-1631087060254-7c0f8e04c885?w=800&h=600&fit=crop&auto=format','Atelier 3D avance aout', 2, 'approved');


DROP TABLE IF EXISTS `booking`;

CREATE TABLE `booking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `bills_number` varchar(45) NOT NULL UNIQUE,
  `quantity` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `id_activity` int NOT NULL,
  `payment_status` VARCHAR(20) NOT NULL DEFAULT 'paid',
  PRIMARY KEY (`id`),
  UNIQUE KEY `bills_number_UNIQUE` (`bills_number`),
  KEY `fk_booking_users_idx` (`users_id`),
  CONSTRAINT `fk_booking_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- drop table if exists en haut du doc, doit intervenir avant drop users
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `price_unit` decimal(10,2) DEFAULT NULL,
  `users_id` int NOT NULL,
  `id_activity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cart_users_idx` (`users_id`),
  CONSTRAINT `fk_cart_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `claim`;

CREATE TABLE `claim` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `category` varchar(150) NOT NULL,
  `message` TEXT NOT NULL,
  `claim_date` varchar(100) NOT NULL,
  `users_id` int NOT NULL,
  `activity_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_claim_users_idx` (`users_id`),
  KEY `fk_claim_activity_idx` (`activity_id`),
  CONSTRAINT `fk_claim_activity` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`id`),
  CONSTRAINT `fk_claim_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `claim` VALUES 
(1, 'Enceinte défectueuse', 'Équipement', 'Bonjour, lors de ma session du 5 mai matin, l enceinte de la salle était défectueuse. Le son grésillait constamment, ce qui a rendu le travail difficile.', '2026-05-06', 2, 7),
(2, 'Remboursement festival', 'Événement', 'Bonjour, étant tombée malade, je n ai pas pu assister au Festival local de juillet. Serait-il possible d obtenir un remboursement ou un avoir ?', '2026-06-01', 2, 5),
(3, 'Facture incorrecte', 'Facturation', 'Bonjour, j ai été facturée deux fois pour la session de coworking du 20 mai après-midi. Merci de vérifier et de corriger cette erreur.', '2026-05-21', 2, 8),
(4, 'Test connexion BDD', 'Autre', 'Ceci est un test', '2026-06-15', 2, 1);



