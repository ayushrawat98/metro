const sqlite = require('better-sqlite3')


let db = sqlite('./data/database/metro.db')
db.pragma('journal_mode = WAL')
db.exec(
	`
                ALTER TABLE posts ADD COLUMN username text ;
			`)