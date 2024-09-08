/*
  Warnings:

  - You are about to alter the column `application_date` on the `lecture_applications` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date` on the `lectures` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `lecture_applications` MODIFY `application_date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `lectures` MODIFY `date` DATETIME NOT NULL;
