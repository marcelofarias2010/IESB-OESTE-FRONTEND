-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExpires` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_resetToken_key`(`resetToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSettings` (
    `userId` VARCHAR(191) NOT NULL,
    `workTime` INTEGER NOT NULL,
    `shortBreakTime` INTEGER NOT NULL,
    `longBreakTime` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Remove tarefas antigas sem dono (nova coluna obrigatória userId)
DELETE FROM `Task`;

-- AlterTable
ALTER TABLE `Task` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- DropIndex (substituído por índice composto userId + startDate)
ALTER TABLE `Task` DROP INDEX `Task_startDate_idx`;

-- CreateIndex
CREATE INDEX `Task_userId_startDate_idx` ON `Task`(`userId`, `startDate`);

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSettings` ADD CONSTRAINT `UserSettings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- DropTable
DROP TABLE IF EXISTS `Settings`;
