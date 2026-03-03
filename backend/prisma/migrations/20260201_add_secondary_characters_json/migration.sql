-- Migration pour ajouter le champ secondaryCharactersJson
-- Permet de stocker jusqu'a 5 personnages secondaires en JSON

ALTER TABLE "orders" ADD COLUMN "secondaryCharactersJson" TEXT;
