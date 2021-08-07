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
`others` TEXT);
CREATE INDEX byfirst ON cases(`first_name`);
CREATE INDEX bylast ON cases(`last_name`);

CREATE TABLE `auth` (
`user` VARCHAR(20) PRIMARY KEY NOT NULL,
`pass` VARCHAR(60)
);
INSERT INTO `auth` (`user`,`pass`) VALUES ("admin", "UCDMOzHjLRTMaCbBSkvfLOzF/5CWhDivPGUWYGucl57tXlgCH/atu");