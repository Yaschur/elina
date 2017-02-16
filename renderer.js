var pouchDb = new PouchDB('test');

var tObj = {
	_id: '123',
	name: 'alpha'
};

pouchDb.put(tObj);
pouchDb.find({
	selector: {_id: '123'}
});

pouchDb.info().then((info) => console.log(info));
