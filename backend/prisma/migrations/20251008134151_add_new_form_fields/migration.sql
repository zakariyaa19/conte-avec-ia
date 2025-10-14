/*
  Warnings:

  - You are about to drop the column `shippingCountry` on the `orders` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW_ORDER',
    "ageRange" TEXT NOT NULL,
    "generalTheme" TEXT NOT NULL,
    "customTheme" TEXT,
    "specificSubject" TEXT NOT NULL,
    "customSubject" TEXT,
    "centralMessage" TEXT NOT NULL,
    "customMessage" TEXT,
    "illustrationStyle" TEXT NOT NULL,
    "protagonistName" TEXT NOT NULL,
    "protagonistAge" TEXT,
    "protagonistGender" TEXT,
    "eyeColor" TEXT,
    "hairColor" TEXT,
    "photoUrl" TEXT,
    "language" TEXT,
    "hobbies" TEXT,
    "favoriteDish" TEXT,
    "specialEvents" TEXT,
    "religion" TEXT,
    "customReligion" TEXT,
    "secondaryCharacterName" TEXT,
    "secondaryCharacterAge" TEXT,
    "creatorName" TEXT,
    "productType" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "shippingFirstName" TEXT,
    "shippingLastName" TEXT,
    "shippingAddress" TEXT,
    "shippingCity" TEXT,
    "shippingPostalCode" TEXT,
    "stripePaymentIntentId" TEXT,
    "paidAt" DATETIME,
    "ebookUrl" TEXT,
    "generatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("ageRange", "centralMessage", "createdAt", "ebookUrl", "eyeColor", "generalTheme", "generatedAt", "hairColor", "id", "illustrationStyle", "paidAt", "photoUrl", "price", "productType", "protagonistAge", "protagonistName", "secondaryCharacterAge", "secondaryCharacterName", "shippingAddress", "shippingCity", "shippingFirstName", "shippingLastName", "shippingPostalCode", "specificSubject", "status", "stripePaymentIntentId", "updatedAt", "userId") SELECT "ageRange", "centralMessage", "createdAt", "ebookUrl", "eyeColor", "generalTheme", "generatedAt", "hairColor", "id", "illustrationStyle", "paidAt", "photoUrl", "price", "productType", "protagonistAge", "protagonistName", "secondaryCharacterAge", "secondaryCharacterName", "shippingAddress", "shippingCity", "shippingFirstName", "shippingLastName", "shippingPostalCode", "specificSubject", "status", "stripePaymentIntentId", "updatedAt", "userId" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
