'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-adapter-node-websql'));
PouchDB.plugin(require('pouchdb-find'));
PouchDB.plugin(require('pouchdb-upsert'));

const path = require('path');
const dbPath = path.join(__dirname, 'database.db');
var pouchDb = new PouchDB(dbPath, { adapter: 'websql' });

app.route('/__dump')
	.get((req, res) => {
		pouchDb.allDocs({ include_docs: true })
			.then(r => res.json(r))
			.catch(e => console.log(e));
	});

app.route('/__index')

	.get((req, res) =>
		pouchDb.getIndexes()
			.then(inds => res.json(inds))
			.catch(e => console.log(e))
	)

	.post((req, res) =>
		pouchDb.createIndex(req.body)
			.then(() => res.sendStatus(200))
			.catch(e => console.log(e))
	)

	.delete((req, res) =>
		pouchDb.deleteIndex(req.body)
			.then(() => res.sendStatus(200))
			.catch(e => console.log(e))
	);

app.route('/:type/:id')

	.get((req, res) => {
		const id = req.params.type + '_' + req.params.id;
		pouchDb.get(id)
			.then(doc => res.json(toDomain(doc)))
			.catch((e) => res.status(404).json({ error: e.message }));
	})

	.put((req, res) => {
		let id = req.params.type + '_' + req.params.id;
		pouchDb.upsert(id, doc => {
			let item = req.body;
			item._id = id;
			item._rev = doc._rev;
			return item;
		}).then(() => res.sendStatus(200))
			.catch((e) => res.status(500).json({ error: e.message }))
	})

	.delete((req, res) => {
		let id = req.params.type + '_' + req.params.id;
		pouchDb.get(id).then(doc => {
			return pouchDb.remove(doc)
		}).then(() => res.sendStatus(200))
			.catch(e => res.status(500).json({ error: e.message }))
	});

app.route('/:type')

	.post((req, res) => {
		const extFilter = req.body.filter;
		const typeFilter = { type: { $eq: req.params.type } };
		let selector = {};
		Object.assign(selector, typeFilter, extFilter);
		let query = { selector: selector };
		if (req.body.sort) {
			query.sort = req.body.sort;
		}
		if (req.body.skip) {
			query.skip = req.body.skip;
		}
		if (req.body.limit) {
			query.limit = req.body.limit
		}
		pouchDb.find(query)
			.then(result => {
				let items = result.docs;
				items.forEach(item => toDomain(item));
				res.json(items)
			}).catch(e => {
				console.log(e);
				res.status(500).json({ error: e.message });
			})
	});

const server = app.listen(3235, () => {
	var host = server.address().address
	var port = server.address().port

	console.log("api is listening at http://%s:%s", host, port)
})

function toDomain(item) {
	const idSplit = item._id.split('_');
	item._id = idSplit[1];
	delete item._rev;
	return item;
}
