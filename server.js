// Get our dependencies
const express = require('express')
const app = express()
const mysql = require('mysql')
const util = require('util')

const pool = mysql.createPool({
  host: "sqlservertemp2.mysql.database.azure.com",
  user: "jalcina@sqlservertemp2",
  password: "Chucoclave123",
  database: "mydb"
})
pool.query = util.promisify(pool.query)

// Implement the movies API endpoint
app.get('/movies', async function (req, res) {
  try {
    const rows = await pool.query(
      'select m.title, m.release_year, m.score, r.name as reviewer, p.name as publication from movies m,' +
      'reviewers r, publications p where r.publication=p.name and m.reviewer=r.name'
    )
    res.json(rows)
  } catch (err) {
    console.error('API Error:', err)
    res.status(500).send({'msg': 'Internal server error'})
  }
})

app.get('/reviewers', async function (req, res) {
  try {
    const rows = await pool.query('select r.name, r.publication, r.avatar from reviewers r')
    res.json(rows)
  } catch (err) {
    console.error('API Error:', err)
    res.status(500).send({'msg': 'Internal server error'})
  }
})

app.get('/publications', async function (req, res) {
  try {
    const rows = await pool.query('select r.name, r.publication, r.avatar from reviewers r')
    res.json(rows)
  } catch (err) {
    console.error('API Error:', err)
    res.status(500).send({'msg': 'Internal server error'})
  }
})

app.get('/pending', async function (req, res) {
  try {
    const rows = await pool.query(
      'select m.title, m.release, m.score, r.name as reviewer, p.name as publication' +
      'from movie_db.movies m, movie_db.reviewers r, movie_db.publications p where' +
      'r.publication=p.name and m.reviewer=r.name and m.release>=2017'
    )
    res.json(rows)
  } catch (err) {
    console.error('API Error:', err)
    res.status(500).send({'msg': 'Internal server error'})
  }
})

app.get('/', function (req, res) {
  res.status(200).send({'service_status': 'Up'})
})

app.get('/health-check', async (req, res) => {
  try {
    res.send("service up")
  } catch (err) {
    console.error('API Error:', err)
    res.status(500).send({'msg': 'Internal server error'})
  }
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/ready-check', async (req, res) => {
  try {
    await sleep(5000);
    res.send("service ready")
  } catch (err) {
    console.error('API Error:', err)
    res.status(500).send({'msg': 'Internal server error'})
  }
})


console.log('server listening through port: ' + 3000)
app.listen(3000)
module.exports = app
