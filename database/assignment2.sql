-- rebuild_database.sql
-- Fichier pour reconstruire la base (Tâche 2)
-- Crée le type, les tables et insère des données de démonstration.
-- IMPORTANT: à la fin du fichier, on a copié les requêtes 4 et 6 (issues de Task 1)
-- comme demandé (elles doivent être les dernières à s'exécuter dans le rebuild).

-- 1) Si le type existe déjà, on le supprime (utile pour reruns)
DROP TYPE IF EXISTS account_type CASCADE;

-- 2) Création d'un type ENUM pour account_type
CREATE TYPE account_type AS ENUM ('Customer', 'Admin', 'Employee');

-- 3) Création des tables

-- Table account
DROP TABLE IF EXISTS account CASCADE;
CREATE TABLE account (
  account_id   SERIAL PRIMARY KEY,
  first_name   VARCHAR(100) NOT NULL,
  last_name    VARCHAR(100) NOT NULL,
  account_email VARCHAR(255) UNIQUE NOT NULL,
  account_password VARCHAR(255) NOT NULL,
  account_type account_type NOT NULL DEFAULT 'Customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table classification
DROP TABLE IF EXISTS classification CASCADE;
CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(100) UNIQUE NOT NULL,
  classification_description TEXT
);

-- Table inventory
DROP TABLE IF EXISTS inventory CASCADE;
CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  inv_description TEXT,
  classification_id INTEGER REFERENCES classification(classification_id) ON DELETE SET NULL,
  inv_image VARCHAR(500),
  inv_thumbnail VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4) Peupler la table classification (exemples)
INSERT INTO classification (classification_name, classification_description) VALUES
('Economy', 'Petites berlines et citadines'),
('Sport', 'Véhicules de catégorie sport et performance'),
('Truck', 'Camions et utilitaires'),
('Luxury', 'Véhicules de luxe');

-- 5) Peupler la table inventory (exemples). Assurez-vous que les classification_id correspondent.
--    Nous utilisons des insertions simples en assumant que les classification_id sont 1..4 comme ci-dessus.
INSERT INTO inventory (make, model, inv_description, classification_id, inv_image, inv_thumbnail)
VALUES
('GM', 'Hummer', 'Robust offroad vehicle with small interiors and strong chassis', 3, '/images/hummer.jpg', '/images/hummer-thumb.jpg'),
('Porsche', '911', 'Classic sport car - high performance and sleek design', 2, '/images/porsche-911.jpg', '/images/porsche-911-thumb.jpg'),
('Mazda', 'RX-7', 'Lightweight sport car with rotary engine', 2, '/images/mazda-rx7.jpg', '/images/mazda-rx7-thumb.jpg'),
('Toyota', 'Corolla', 'Reliable economy sedan', 1, '/images/toyota-corolla.jpg', '/images/toyota-corolla-thumb.jpg'),
('Ford', 'F-150', 'Popular light truck', 3, '/images/ford-f150.jpg', '/images/ford-f150-thumb.jpg');

-- 6) (Optionnel) peupler account avec des comptes de test
INSERT INTO account (first_name, last_name, account_email, account_password, account_type)
VALUES
('Alice','Dupont','alice@example.com','password123','Customer'),
('Bob','Martin','bob@example.com','password456','Employee');

-- ------------------------------
-- IMPORTANT : Les 2 requêtes demandées (4 et 6 de Task 1) doivent être
-- les DERNIÈRES dans ce rebuild file — on les ajoute ci-dessous.
-- ------------------------------

-- Copie de la requête 4 : remplacer 'small interiors' par 'a huge interior' pour GM Hummer
UPDATE inventory
SET inv_description = replace(inv_description, 'small interiors', 'a huge interior')
WHERE make = 'GM' AND model = 'Hummer';

-- Copie de la requête 6 : insérer '/vehicles' dans le chemin des images
UPDATE inventory
SET inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = replace(inv_thumbnail, '/images/', '/images/vehicles/');
