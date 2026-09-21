CREATE TABLE `order_number_counters` (
	`name` varchar(64) NOT NULL,
	`lastIssuedNumber` int NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `order_number_counters_name` PRIMARY KEY(`name`)
);

-- Keep the already-paid LAP-160002 immutable; the next new order resumes the
-- owner-approved consecutive series at LAP-130003.
INSERT INTO `order_number_counters` (`name`, `lastIssuedNumber`)
VALUES ('orders', 130002);
