-- Math Rush Leaderboard Schema
CREATE TABLE IF NOT EXISTS leaderboard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  time_taken INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_score ON leaderboard(score DESC);
CREATE INDEX idx_difficulty ON leaderboard(difficulty);
CREATE INDEX idx_created_at ON leaderboard(created_at DESC);
