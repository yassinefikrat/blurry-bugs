const level = require('level')

// try creating db connection
const db = level('.bugsdb')

export default db