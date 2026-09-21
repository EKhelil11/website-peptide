ALTER TABLE `orders` ADD `checkoutIdempotencyKey` varchar(64);--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentProviderCheckoutUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `system_jobs` ADD `leaseExpiresAt` bigint;--> statement-breakpoint
ALTER TABLE `system_jobs` ADD `lastRunAt` bigint;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_checkoutIdempotencyKey_unique` UNIQUE(`checkoutIdempotencyKey`);