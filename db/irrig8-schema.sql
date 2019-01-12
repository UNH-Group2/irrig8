-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema irrig8_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema irrig8_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `irrig8_db` DEFAULT CHARACTER SET utf8 ;
USE `irrig8_db` ;

-- -----------------------------------------------------
-- Table `irrig8_db`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `irrig8_db`.`User` (
  `ID` INT(10) NOT NULL,
  `FULL_NAME` VARCHAR(50) NULL,
  `EMAIL` VARCHAR(50) NULL,
  `USER_NAME` VARCHAR(50) NOT NULL,
  `PASSWORD` VARCHAR(50) NOT NULL,
  `RACHIO_OAUTH_TOKEN` VARCHAR(255) NULL,
  `RACHIO_USER_ID` VARCHAR(50) NULL,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `irrig8_db`.`Device`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `irrig8_db`.`Device` (
  `ID` INT(10) NOT NULL,
  `NAME` VARCHAR(100) NULL,
  `TIME_ZONE` VARCHAR(50) NULL,
  `SERIAL_NUMBER` VARCHAR(50) NULL,
  `MAC_ADDRESS` VARCHAR(50) NULL,
  `LOCATION_LATITUDE` INT(15) NULL,
  `LOCATION_LONGITUDE` INT(15) NULL,
  `RACHIO_DEVICE_ID` VARCHAR(50) NULL,
  `USER_ID` INT(10) NULL,
  PRIMARY KEY (`ID`),
  INDEX `USER_ID_idx` (`USER_ID` ASC) VISIBLE,
  CONSTRAINT `USER_ID`
    FOREIGN KEY (`USER_ID`)
    REFERENCES `irrig8_db`.`User` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `irrig8_db`.`Zone`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `irrig8_db`.`Zone` (
  `ID` INT(10) NOT NULL,
  `ZONE_NAME` VARCHAR(100) NULL,
  `ZONE_NUMBER` INT(3) NULL,
  `IMAGE_URL` VARCHAR(255) NULL,
  `DEVICE_ID` INT(10) NULL,
  PRIMARY KEY (`ID`),
  INDEX `DEVICE_ID_idx` (`DEVICE_ID` ASC) VISIBLE,
  CONSTRAINT `DEVICE_ID`
    FOREIGN KEY (`DEVICE_ID`)
    REFERENCES `irrig8_db`.`Device` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `irrig8_db`.`Zone_Usage`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `irrig8_db`.`Zone_Usage` (
  `ID` INT(10) NOT NULL,
  `START_DATETIME` DATETIME NULL,
  `STOP_DATETIME` DATETIME NULL,
  `ZONE_ID` INT(10) NULL,
  PRIMARY KEY (`ID`),
  INDEX `ZONE_ID_idx` (`ZONE_ID` ASC) VISIBLE,
  CONSTRAINT `ZONE_ID`
    FOREIGN KEY (`ZONE_ID`)
    REFERENCES `irrig8_db`.`Zone` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
