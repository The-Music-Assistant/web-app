const express = require("express")
const cors = require('cors')
const AnalysisComparer = require("./AnalysisComparer")

let app = express()
app.use(express.json())
app.use(cors())

app.post('/', async (req, res) => {
    if (req.body.fileName) {
        AnalysisComparer.play(req.body.fileName)
    }
    res.status(200).send()
})

app.listen(1234, () => {
    console.log("Listening:", 1234)
})