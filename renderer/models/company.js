class Company {
	constructor(name, country, phone, url) {
		this._id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
		this.name = name;
		this.country = country;
		this.phone = phone;
		this.url = url;
	}
}