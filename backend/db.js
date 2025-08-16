const sqlite = require('better-sqlite3')

class DB{
    db;
    queries;
    constructor(){
        this.db = sqlite('./data/database/metro.db')
        this.db.pragma('journal_mode = WAL')
        this.db.exec(
            `
                create table if not exists posts (
                    id integer primary key autoincrement,
                    boardname text not null,
					threadid integer,
                    replyto integer,
                    content text not null,
					ogfilename text not null,
                    file text not null,
                    mimetype text not null,
                    replycount integer default 0,
                    created_at text not null
                );

				
				CREATE INDEX if not exists idx_threads_board_date
				ON posts(boardname, created_at DESC)
				WHERE threadid IS NULL;


				CREATE INDEX if not exists idx_replies_thread_date
				ON posts(threadid, created_at ASC)
				WHERE threadid IS NOT NULL;

            `
        )
        this.queries = {
            getThreads : this.db.prepare('select * from posts where boardname = ? and threadid is null order by created_at desc'),
            getThread : this.db.prepare('select * from posts where id = ?'),
            createThread : this.db.prepare('insert into posts (boardname, content, ogfilename, file, mimetype, created_at) values (?,?,?,?, ?,?)'),
            getReplies : this.db.prepare('select * from posts where threadid = ?'),
            createReply : this.db.prepare('insert into posts (boardname, threadid, content, ogfilename, file, mimetype, created_at, replyto) values (?,?,?,?,?, ?,?,?)'),
            updateReplyCount : this.db.prepare('update posts set replycount = replycount + 1 where id = ?')
        }
    }

    getThreads(boardName){
        return this.queries.getThreads.all(boardName)
    }

    getThread(threadId){
        return this.queries.getThread.get(threadId)
    }

    createThread(data){
        return this.queries.createThread.run(data.boardName, data.content, data.ogfilename, data.file, data.mimetype, data.createdat)
    }

    getReplies(threadId){
		let thread = this.getThread(threadId)
        let replies = this.queries.getReplies.all(threadId)
		return [thread, ...replies]
    }

    createReply(data){
        let result =  this.queries.createReply.run(data.boardname, data.threadId, data.content, data.ogfilename, data.file, data.mimetype, data.createdat, data.replyto)
        if(result){
            this.queries.updateReplyCount.run(data.threadId)
        }
        return result
    }
}

const instance = new DB()
module.exports = instance