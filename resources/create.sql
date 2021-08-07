CREATE TABLE `cases` (
`id` INTEGER PRIMARY KEY AUTOINCREMENT,
`last_name` VARCHAR(100),
`first_name` VARCHAR(100),
`middle_name` VARCHAR(100),
`birthday` VARCHAR(12),
`birth_place` TEXT,
`gender` VARCHAR(12),
`date_recorded` VARCHAR(10),
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