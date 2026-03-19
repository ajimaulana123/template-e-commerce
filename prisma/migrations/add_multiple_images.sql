-- Migration: Convert single image to multiple images array
-- This migration converts the 'image' column to 'images' array

-- Step 1: Add new images column as array
ALTER TABLE "products" ADD COLUMN "images" TEXT[];

-- Step 2: Copy existing image data to images array
UPDATE "products" SET "images" = ARRAY["image"]::TEXT[] WHERE "image" IS NOT NULL;

-- Step 3: Drop old image column
ALTER TABLE "products" DROP COLUMN "image";

-- Step 4: Make images column NOT NULL with default empty array
ALTER TABLE "products" ALTER COLUMN "images" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "images" SET DEFAULT '{}';
