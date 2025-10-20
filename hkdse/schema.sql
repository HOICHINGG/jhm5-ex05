-- HKDSE Table 3F Schema
CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  row_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  day_school_number INTEGER,
  day_school_cumulative INTEGER,
  all_candidates_number INTEGER,
  all_candidates_cumulative INTEGER
);

CREATE INDEX idx_description ON results(description);
CREATE INDEX idx_type ON results(type);
CREATE INDEX idx_row_number ON results(row_number);
