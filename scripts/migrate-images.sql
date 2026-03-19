-- Safe migration: Convert single image to multiple images array
-- Run this before prisma db push

-- Step 1: Add new images column as array (allow NULL first)
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "images" TEXT[];

-- Step 2: Copy existing image data to images array
UPDATE "products" 
SET "images" = ARRAY["image"]::TEXT[] 
WHERE "image" IS NOT NULL AND "images" IS NULL;

-- Step 3: Set default for NULL images
UPDATE "products" 
SET "images" = ARRAY[]::TEXT[] 
WHERE "images" IS NULL;

-- Step 4: Make images column NOT NULL
ALTER TABLE "products" ALTER COLUMN "images" SET NOT NULL;

-- Step 5: Drop old image column
ALTER TABLE "products" DROP COLUMN IF EXISTS "image";

-- Verify migration
SELECT id, name, array_length(images, 1) as image_count 
FROM "products" 
LIMIT 5;
