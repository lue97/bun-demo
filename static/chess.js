const body = document.querySelector('body');

const gameId = body.dataset.gameid
const orientation = body.dataset.orientation

console.info(gameId, orientation)

const onDrop = (src, dest, piece) => {
    console.info(src, dest, piece)
    const move = {src, dest, piece}
    fetch(`/chess/${gameId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(move),
    })
    .then(resp => console.info("resp: ", resp))
    .catch(err => console.err("err: ", err))
}

const config = {
    draggable: true,
    position: 'start',
    orientation,
    onDrop
}

const chess = Chessboard('chess', config)

const sse = new EventSource('/chess/stream')
sse.addEventListener(gameId, msg => {
    console.info(`>>> SSE msg: `, msg)
    const {src, dest, piece} = JSON.parse(msg.data)
    chess.move(`${src}-${dest}`)
})