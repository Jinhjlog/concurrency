-- CreateTable
CREATE TABLE `users` (
    `user_id` VARCHAR(26) NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lectures` (
    `lecture_id` VARCHAR(26) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `max_capacity` INTEGER NOT NULL,
    `current_capacity` INTEGER NOT NULL,
    `date` DATETIME NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`lecture_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lecture_applications` (
    `lecture_application_id` VARCHAR(26) NOT NULL,
    `user_id` VARCHAR(26) NOT NULL,
    `lecture_id` VARCHAR(26) NOT NULL,
    `application_date` DATETIME NOT NULL,

    UNIQUE INDEX `lecture_applications_user_id_key`(`user_id`),
    PRIMARY KEY (`lecture_application_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lecture_applications` ADD CONSTRAINT `lecture_applications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lecture_applications` ADD CONSTRAINT `lecture_applications_lecture_id_fkey` FOREIGN KEY (`lecture_id`) REFERENCES `lectures`(`lecture_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
