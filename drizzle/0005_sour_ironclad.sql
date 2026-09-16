CREATE TABLE `order_number_sequence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_number_sequence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `order_number_sequence` AUTO_INCREMENT = 100099;
--> statement-breakpoint
ALTER TABLE `customers` ADD `partnerCode` varchar(32);--> statement-breakpoint
ALTER TABLE `customers` ADD `partnerDiscountBps` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `customers` ADD `partnerCodeActivatedAt` timestamp;--> statement-breakpoint
ALTER TABLE `orders` ADD `discountCents` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `discountBps` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `partnerCode` varchar(32);
