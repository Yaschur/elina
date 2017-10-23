import { Injectable } from '@angular/core';
import { StoreService } from '../../../infra';
import { Company } from '../models/company.model';

@Injectable()
export class CompanyRepository {
	static entityType = 'company';

	constructor(private _storeService: StoreService) { }

	public async store(company: Company) {
		await this._storeService.store(CompanyRepository.entityType, company);
	}

	public async remove(company: Company) {
		await this._storeService.remove(CompanyRepository.entityType, company);
	}

	public async getById(id: string): Promise<Company> {
		const dbItem = await this._storeService.get(CompanyRepository.entityType, id);
		if (!dbItem) {
			return null;
		}
		return new Company(dbItem);
	}

	public async findByName(term: string, exact: boolean = false): Promise<Company[]> {
		const remoteMode = await this._storeService.checkRemoteMode();
		const tTerm = exact ? '^' + StoreService.Utils.escapeForRegex(term) + '$' : StoreService.Utils.escapeForRegex(term);
		const filter = { name: { $regex: remoteMode ? '(?i)' + tTerm : new RegExp(tTerm, 'i') } };
		return await this.findByFilter(filter);
	}

	public async findByFilter(filter: any): Promise<Company[]> {
		return (await this._storeService.find(
			CompanyRepository.entityType,
			filter,
			['name']
		)).map(dbItem => new Company(dbItem));
	}

	public async findAll(): Promise<Company[]> {
		return (await this._storeService.find(
			CompanyRepository.entityType,
			{ name: { $gt: null } },
			['name']
		)).map(dbItem => new Company(dbItem));
	}


}
