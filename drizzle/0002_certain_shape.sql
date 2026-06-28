CREATE TABLE `order_status_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`fromStatus` varchar(64),
	`toStatus` varchar(64) NOT NULL,
	`changedBy` varchar(64) DEFAULT 'system',
	`note` text,
	`createdAt` bigint NOT NULL,
	CONSTRAINT `order_status_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `status` enum('pending_payment','paid','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending_payment';--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `shipState` varchar(4);--> statement-breakpoint
ALTER TABLE `order_items` ADD `variantLabel` varchar(128);--> statement-breakpoint
ALTER TABLE `order_items` ADD `unitPriceCents` int NOT NULL;--> statement-breakpoint
ALTER TABLE `order_items` ADD `lineTotalCents` int NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `orderNumber` varchar(32);--> statement-breakpoint
ALTER TABLE `orders` ADD `subtotalCents` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `shippingCents` int DEFAULT 700 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `taxCents` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `totalCents` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `zellePhone` varchar(32) DEFAULT '(310) 975-9289';--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentConfirmedAt` bigint;--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentConfirmedBy` int;--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentNotes` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `shipAddress2` varchar(256);--> statement-breakpoint
ALTER TABLE `orders` ADD `shipCountry` varchar(4) DEFAULT 'US';--> statement-breakpoint
ALTER TABLE `orders` ADD `shipstationOrderKey` varchar(256);--> statement-breakpoint
ALTER TABLE `orders` ADD `shipstationSyncedAt` bigint;--> statement-breakpoint
ALTER TABLE `orders` ADD `trackingCarrier` varchar(64);--> statement-breakpoint
ALTER TABLE `orders` ADD `trackingService` varchar(128);--> statement-breakpoint
ALTER TABLE `orders` ADD `shippedAt` bigint;--> statement-breakpoint
ALTER TABLE `orders` ADD `estimatedDelivery` bigint;--> statement-breakpoint
ALTER TABLE `orders` ADD `adminNotes` text;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`);--> statement-breakpoint
ALTER TABLE `order_items` DROP COLUMN `unitPrice`;--> statement-breakpoint
ALTER TABLE `order_items` DROP COLUMN `lineTotal`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `paymentStatus`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `paymentMethod`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `totalAmount`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `notes`;