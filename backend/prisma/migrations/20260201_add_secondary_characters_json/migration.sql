-- Migration pour ajouter le champ secondaryCharactersJson
-- Permet de stocker jusqu'à 5 personnages secondaires en JSON

ALTER TABLE "orders" ADD COLUMN "secondaryCharactersJson" TEXT;

-- Commentaire pour documentation
COMMENT ON COLUMN "orders"."secondaryCharactersJson" IS 'Tableau JSON de personnages secondaires (max 5)';
