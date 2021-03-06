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

	public async storeMany(companies: Company[]) {
		companies.forEach(async company =>
			await this._storeService.store(CompanyRepository.entityType, company)
		);
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

	public async findByName(term: string, exact: boolean = false, activeOnly: boolean = true): Promise<Company[]> {
		const remoteMode = await this._storeService.checkRemoteMode();
		const tTerm = exact ? '^' + StoreService.utils.escapeForRegex(term) + '$' : StoreService.utils.escapeForRegex(term);
		const filter: any[] = [{ name: { $regex: remoteMode ? '(*UTF8)(?i)' + tTerm : new RegExp(tTerm, 'i') } }];
		if (activeOnly) {
			filter.push({ active: true });
		}
		return await this.findByFilter(filter.length === 1 ? filter[0] : filter);
	}

	public async findByFilter(filter: any): Promise<Company[]> {
		return (await this._storeService.find(
			CompanyRepository.entityType,
			filter,
			['name']
		)).map(dbItem => new Company(dbItem));
	}

	public async findAll(activeOnly: boolean = true): Promise<Company[]> {
		return (await this._storeService.find(
			CompanyRepository.entityType,
			activeOnly ? [{ name: { $gt: null } }, { active: true }] : { name: { $gt: null } },
			['name']
		)).map(dbItem => new Company(dbItem));
	}


}
