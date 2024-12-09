CREATE DATABASE IF NOT EXISTS gestortuga;
USE gestortuga;

CREATE TABLE IF NOT EXISTS `Especies` (
  `id` INT NOT NULL,
  `nombre` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

CREATE TABLE IF NOT EXISTS `Roles` (
  `id` INT NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

CREATE TABLE IF NOT EXISTS `Usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido_pat` VARCHAR(50) NULL DEFAULT NULL,
  `apellido_mat` VARCHAR(50) NULL DEFAULT NULL,
  `email` VARCHAR(100) NOT NULL,
  `usuario` VARCHAR(50) NOT NULL,
  `contraseña` VARCHAR(255) NOT NULL,
  `id_rol` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email` (`email` ASC),
  UNIQUE INDEX `usuario` (`usuario` ASC),
  INDEX `fk_Usuarios_Roles_idx` (`id_rol` ASC),
  CONSTRAINT `fk_Usuarios_Roles`
    FOREIGN KEY (`id_rol`)
    REFERENCES `Roles` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

CREATE TABLE IF NOT EXISTS `Tortugas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sexo` ENUM('Macho', 'Hembra') NOT NULL,
  `ancho` DECIMAL(5,2) NOT NULL,
  `largo` DECIMAL(5,2) NOT NULL,
  `ancho_plasta` DECIMAL(5,2) NOT NULL,
  `largo_plasta` DECIMAL(5,2) NOT NULL,
  `estado_salud` VARCHAR(50) NOT NULL,
  `id_especie` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Tortugas_Especie1_idx` (`id_especie` ASC),
  CONSTRAINT `fk_Tortugas_Especie1`
    FOREIGN KEY (`id_especie`)
    REFERENCES `Especies` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


CREATE TABLE IF NOT EXISTS `Historiales_Medicos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `peso` INT NOT NULL,
  `diagnostico` TEXT NOT NULL,
  `tratamiento` TEXT NOT NULL,
  `id_tortuga` INT NOT NULL,
  `id_usuario` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Registros_Medicos_Tortugas1_idx` (`id_tortuga` ASC),
  INDEX `fk_Historiales_Medicos_Usuarios1_idx` (`id_usuario` ASC),
  CONSTRAINT `fk_Historiales_Medicos_Usuarios1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `Usuarios` (`id`),
  CONSTRAINT `fk_Registros_Medicos_Tortugas1`
    FOREIGN KEY (`id_tortuga`)
    REFERENCES `Tortugas` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

INSERT INTO `Especies` (`id`,`nombre`) VALUES (1,'POCHITOQUE');
INSERT INTO `Especies` (`id`,`nombre`) VALUES (2,'BLANCA');
INSERT INTO `Especies` (`id`,`nombre`) VALUES (3,'TRES LOMOS');
INSERT INTO `Especies` (`id`,`nombre`) VALUES (4,'HICOTEA');
INSERT INTO `Especies` (`id`,`nombre`) VALUES (5,'JOLOCA');

INSERT INTO `Roles` (`id`,`nombre`) VALUES (1,'ADMINISTRADOR');
INSERT INTO `Roles` (`id`,`nombre`) VALUES (2,'EMPLEADO');

INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (1,'Macho',24.40,30.00,30.00,30.00,'SANA',1);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (2,'Hembra',20.00,32.00,35.00,45.00,'SANA',1);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (3,'Macho',27.81,35.10,38.00,47.00,'SANA',3);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (4,'Hembra',37.00,48.00,35.00,46.00,'SANA',4);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (5,'Macho',15.00,18.00,13.00,16.00,'ENFERMA',2);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (6,'Macho',23.00,28.00,22.00,25.00,'SANA',1);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (7,'Macho',39.00,46.00,37.00,44.00,'SANA',4);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (8,'Macho',37.00,42.00,35.00,41.00,'SANA',3);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (9,'Macho',26.00,29.00,24.00,27.00,'ENFERMA',3);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (10,'Macho',48.00,57.00,44.00,55.00,'SANA',1);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (11,'Hembra',20.00,29.00,14.00,18.00,'ENFERMA',2);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (12,'Macho',35.00,45.00,25.00,15.00,'SANA',2);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (13,'Hembra',20.00,35.00,12.00,17.00,'SANA',4);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (14,'Macho',35.00,40.00,30.00,35.00,'SANA',3);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (15,'Hembra',15.00,25.00,12.00,22.00,'SANA',1);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (16,'Macho',40.00,55.00,35.00,46.00,'ENFERMA',2);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (17,'Hembra',14.00,23.00,12.00,20.00,'SANA',3);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (18,'Hembra',12.00,18.00,10.00,16.00,'SANA',5);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (19,'Macho',19.00,25.00,17.00,20.00,'SANA',3);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (20,'Hembra',15.00,23.00,13.00,20.00,'ENFERMA',5);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (21,'Hembra',18.00,25.00,16.00,23.00,'SANA',2);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (22,'Hembra',24.00,37.00,20.00,32.00,'SANA',2);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (23,'Hembra',15.00,20.00,12.00,18.00,'ENFERMA',3);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (24,'Macho',23.00,29.00,19.00,26.00,'SANA',5);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (25,'Hembra',19.00,26.00,15.00,24.00,'ENFERMA',3);
INSERT INTO `Tortugas` (`id`,`sexo`,`ancho`,`largo`,`ancho_plasta`,`largo_plasta`,`estado_salud`,`id_especie`) VALUES (26,'Hembra',25.00,36.00,23.00,30.00,'ENFERMA',2);

INSERT INTO `Usuarios` (`id`,`nombre`,`apellido_pat`,`apellido_mat`,`email`,`usuario`,`contraseña`,`id_rol`) VALUES (1,'PABLO ARTURO','JIMENEZ','DE LA CRUZ','pablojmz123@gmail.com','pablo','b92045235e078a2cf93f165561fab7b3cef3034aa64d5101288c9171bacf857a',1);
INSERT INTO `Usuarios` (`id`,`nombre`,`apellido_pat`,`apellido_mat`,`email`,`usuario`,`contraseña`,`id_rol`) VALUES (2,'EDWIN','LÓPEZ','PEREZ','edwin@gmail.com','edwin','27944092732df96af0311e3e374b751a584e331c2fcf36c24e5b96dd79741c30',2);
INSERT INTO `Usuarios` (`id`,`nombre`,`apellido_pat`,`apellido_mat`,`email`,`usuario`,`contraseña`,`id_rol`) VALUES (3,'JESUS ANTONIO','MAGAÑA','CASTILLO','jesus.antonio@gmail.com','jesus','27944092732df96af0311e3e374b751a584e331c2fcf36c24e5b96dd79741c30',2);
INSERT INTO `Usuarios` (`id`,`nombre`,`apellido_pat`,`apellido_mat`,`email`,`usuario`,`contraseña`,`id_rol`) VALUES (4,'ALY JARED','DOMINGUEZ','ESCALANTE','aly@gmail.com','aly','210e9caa27cb4f7b6d1372f27138353255d85690ecc6cb72b8175dd8ddaa3c79',2);
