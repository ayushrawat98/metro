export type thread = {
    id : number,
    boardname : string,
    content : string,
	ogfilename : string,
    file : string,
    mimetype : string,
    replycount : number,
    created_at : string
}

export type reply = {
    id : number,
    threadid : number,
    replyto : number,
    content : string,
	ogfilename : string,
    file : string,
    mimetype : string,
    created_at : string
    replyList? : reply[]
}