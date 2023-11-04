import express from 'express'
import morgan from 'morgan'
import { engine } from 'express-handlebars'
import { v4 as uuid, v4 } from 'uuid'
import { EventSource } from 'express-ts-sse'

const port = process.env.PORT || 3000;
const app = express()

const sse = new EventSource()

app.engine("html", engine({ defaultLayout: false }))
app.set("view engine", "html")

app.use(morgan('combined'))
app.use(express.static(__dirname + "/static"))

app.patch("/chess/:gameId", express.json(), (req, resp) => {
    const gameId = req.params.gameId
    const move = req.body
    sse.send({event: gameId, data: move})
    resp.status(200).json({ timestamp: (new Date()).getTime() })
})

app.get("/chess", (req, resp) => {
    const gameId = req.query.gameId
    const orientation = "black"
    resp.status(200).render("chess", { gameId, orientation })
})

app.post("/chess", express.urlencoded({ extended: true }), (req, resp) => {
    const gameId = v4().substring(0, 8)
    const orientation = "white"
    resp.status(200).render("chess", { gameId, orientation })
})

app.get("/chess/stream", sse.init)

app.listen(port, () => {

})
