const express = require('express')
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json());

const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-adapter-node-websql'))
PouchDB.plugin(require('pouchdb-find'))

var pouchDb = new PouchDB('mydatabase.db', { adapter: 'websql' })

app.get('/', function (req, res) {
	// try {
	// 	let result = await pouchDb.info()
	// 	res.send(result)
	// } catch(e) {
	// 	res.send(e)
	// }
	//res.send('Hello World!')
	pouchDb.allDocs({include_docs: true})
		.then(r => res.json(r))
		.catch(e => res.send(e))
})

app.get('/:type/:id', function (req, res) {
	id = req.params.type + '_' + req.params.id
	pouchDb.get(id)
		.then(doc => {
			doc._id = req.params.id
			res.json(doc)
		}).catch(() => res.status(404).end())
})

app.put('/:type/:id', function (req, res) {

	//console.log(req.body)
	item = req.body
	id = req.params.type + '_' + req.params.id
	item._id = id

	pouchDb.get(id)
		.then(doc => {
			item._rev = doc._rev
			pouchDb.put(item)
				.then(() => res.status(200).end())
				.catch((e) => res.status(500).end())
		}).catch(() => 
			pouchDb.put(item)
				.then(() => res.status(200).end())
				.catch((e) => res.status(500).end())
		)
})

app.delete('/:type/:id', function (req, res) {
	id = req.params.type + '_' + req.params.id
	pouchDb.get(id).then(doc => {
		return pouchDb.remove(doc)
	}).then(() => res.status(200).end())
	.catch(e => res.status(500).end())
})

// const exItem = await this._db.get(item._id)
// 	.catch(() => null);
// if (exItem && exItem.type == item.type) {
// 	item._rev = exItem._rev;
// }
// await this._db.put(item);
// });

const server = app.listen(3235, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("api is listening at http://%s:%s", host, port)
})
