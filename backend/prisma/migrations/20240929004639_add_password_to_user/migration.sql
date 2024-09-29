/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" TEXT;
UPDATE "users" SET "password" = 'default_password' WHERE "password" IS NULL;
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;