import db from './_database'
import uuidv4 from 'uuid/v4'

export async function get(req, res, next) {
    const index = await getCurrentIndex()
    const bugs = await Promise.all(
        index.map(async id => {
            return JSON.parse(await db.get(id))
        })
    )
    const responseBody = JSON.stringify(bugs)
    res.end(responseBody)
}

export async function post(req, res, next) {
    if (req.body === {}) {
        res.writeHead(400)
        res.end('Body cannot be empty.')
    }
    const currentIndex = await getCurrentIndex()
    const newBugId = uuidv4()
    const updatedIndex = currentIndex.concat([newBugId])
    await db.batch()
        .put('index', JSON.stringify(updatedIndex))
        .put(newBugId, JSON.stringify(req.body))
        .write()
    res.end(JSON.stringify(newBugId))
}

async function getCurrentIndex() {
    return new Promise(resolve => {
        db.get('index', (err, value) => {
            if(err && err.type === 'NotFoundError') {
                resolve([])
            } else if (err) {
                console.log('big oof')
            } else {
                resolve(JSON.parse(value))
            }
        })
    })
}