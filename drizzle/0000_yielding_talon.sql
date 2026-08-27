CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` varchar(128) NOT NULL,
	`productName` varchar(256) NOT NULL,
	`productCategory` varchar(128),
	`quantity` int NOT NULL DEFAULT 1,
	`unitPrice` decimal(10,2) NOT NULL,
	`lineTotal` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`status` enum('pending','confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`paymentStatus` enum('awaiting_payment','paid','refunded') NOT NULL DEFAULT 'awaiting_payment',
	`paymentMethod` varchar(64) DEFAULT 'pending',
	`totalAmount` decimal(10,2) NOT NULL,
	`shipName` varchar(256),
	`shipEmail` varchar(320),
	`shipPhone` varchar(32),
	`shipAddress` text,
	`shipCity` varchar(128),
	`shipState` varchar(64),
	`shipZip` varchar(20),
	`shipstationOrderId` varchar(128),
	`trackingNumber` varchar(256),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	`phone` varchar(32),
	`shippingAddress` text,
	`shippingCity` varchar(128),
	`shippingState` varchar(64),
	`shippingZip` varchar(20),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
