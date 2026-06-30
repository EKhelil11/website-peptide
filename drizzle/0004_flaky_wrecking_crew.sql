ALTER TABLE `orders` MODIFY COLUMN `userId` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `orders` ADD `customerId` int;