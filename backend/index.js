const express = require('express')
const boardRoutes = require('./routes/board.routes')
const threadRoutes = require('./routes/thread.routes')
const cors = require('cors')
const path = require('path')

const app = express()

//comment this in prod
app.use('/files', express.static(path.join(__dirname, 'data', 'files')));
app.use(cors())
// app.use(express.json())

app.use('/boards', boardRoutes)
app.use('/threads', threadRoutes)

app.listen(3000, () => {
    console.log("Server running at Port 3000.")
})