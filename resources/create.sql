CREATE TABLE `cases` (
`id` INTEGER PRIMARY KEY AUTOINCREMENT,
`lastName` VARCHAR(100),
`firstName` VARCHAR(100),
`middleName` VARCHAR(100),
`birthday` VARCHAR(12),
`birthPlace` TEXT,
`gender` VARCHAR(12),
`dateRecorded` VARCHAR(10),
`case` TEXT,
`action` TEXT,
`status` VARCHAR(15),
`priority` VARCHAR(10),
`officer` VARCHAR(100),
`others` TEXT);
CREATE INDEX byfirst ON cases(`lastName`);
CREATE INDEX bylast ON cases(`firstName`);

CREATE TABLE `auth` (
`id` INTEGER PRIMARY KEY AUTOINCREMENT,
`user` VARCHAR(20) NOT NULL,
`pass` VARCHAR(60) NOT NULL,
`lastName` VARCHAR(100) NOT NULL,
`firstName` VARCHAR(100) NOT NULL
);
INSERT INTO `auth` (`user`,`pass`,`lastName`,`firstName`) VALUES ("admin", "UCDMOzHjLRTMaCbBSkvfLOzF/5CWhDivPGUWYGucl57tXlgCH/atu", "Admin", "Admin");