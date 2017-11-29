require("babel-core").transform("code")

const http = require('http'),
    express = require('express'),
		pug = require('pug'),
    serveStatic = require('serve-static'),
		bodyParser = require('body-parser'),
		multer = require('multer'),
		morgan = require('morgan'),
		Promise = require('promise'),
		mongoose = require('mongoose'),
		pageBuilder = require('./controllers/page-builder')

const port = 8000,
		app = express()

app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/pages', serveStatic(__dirname + '/pages'))
app.use('/navs', serveStatic(__dirname + '/navs'))
app.use('/static', serveStatic(__dirname + '/static'))

app.all('/*', morgan('tiny'))

app.get('/', (req, res) => {
  var full, pages
  pageBuilder.getFullData().then((data) => {
    full = pageBuilder.transformPages(data)

    return pageBuilder.getActives()
  }).catch((err) => {
    console.log(err)
  }).then((data) => {
    pages = data

    res.render(__dirname + '/index.pug', {
      data: full,
      pages: pages
    })
  }).catch((err) => {
    console.log(err)
  })
})

app.get('/admin', (req, res) => {
	pageBuilder.getFullData().then((data) => {
		res.render(__dirname + '/pages/admin/admin.pug', {
			data: data
		})
	}).catch((err) => {
		console.log(err)
	})
})

app.get('/updatePage', (req, res) => {
	Page.update({elements: req.query.elements}).then(() => {
		res.sendStatus(200)
	}).catch((err) => {
		res.sendStatus(418)
		console.log(err)
	})
})

http.createServer(app).listen(port)

console.log('WEB: Started at http://localhost:'+port+'/')
