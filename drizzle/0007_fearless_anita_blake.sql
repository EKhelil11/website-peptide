CREATE TABLE `system_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`scheduleCronTaskUid` varchar(65),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `system_jobs_id` PRIMARY KEY(`id`),
	CONSTRAINT `system_jobs_name_unique` UNIQUE(`name`),
	CONSTRAINT `system_jobs_scheduleCronTaskUid_unique` UNIQUE(`scheduleCronTaskUid`)
);
--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentMethod` varchar(32) DEFAULT 'zelle' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentProvider` varchar(32);--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentProviderReference` varchar(128);--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentProviderStatus` varchar(32);--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentProviderAmountCents` int;--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentProviderPaidAt` bigint;--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentProviderLastCheckedAt` bigint;--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentProviderCheckCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_paymentProviderReference_unique` UNIQUE(`paymentProviderReference`);