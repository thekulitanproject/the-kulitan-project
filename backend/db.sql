CREATE TABLE IF NOT EXISTS words (
  id SERIAL PRIMARY KEY,
  kulitan TEXT NOT NULL,
  romanized TEXT NOT NULL,
  meaning TEXT NOT NULL,
  audio TEXT
);

INSERT INTO words (kulitan, romanized, meaning) VALUES
('𐔰𐔭𐔧', 'Pusu', 'Heart'),
('𐔮𐔰𐔭', 'Alaya', 'Sun'),
('𐔠𐔮𐔩', 'Ilog', 'River');

