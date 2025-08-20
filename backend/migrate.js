const sqlite = require('better-sqlite3')


let db = sqlite('./data/database/metro.db')
db.pragma('journal_mode = WAL')
db.exec(
	`
                ALTER TABLE posts ADD COLUMN updated_at text default '2025-08-20T16:19:43.277Z' ;
			`)