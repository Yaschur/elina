var pouchDb = new PouchDB('test');
var company = new Company('name', 'rus', '123', 'http://');

pouchDb.put(company);
pouchDb.find({
	selector: {_id: '123'}
});

pouchDb.info().then((info) => console.log(info));
