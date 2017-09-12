import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { XlsxService } from '../../../infra';
import { Company, CompanyRepository } from '../../core';
import { CompanyVmService } from '../services/company-vm.service';
import { CompanyBaseVm } from '../models/company-base-vm.model';

import 'rxjs/add/observable/fromPromise';

@Component({
	selector: 'app-company-list',
	templateUrl: 'company-list.component.html'
})
export class CompanyListComponent implements OnInit {
	companies: Observable<CompanyBaseVm[]>;
	search = '';

	constructor(
		private _companyRepo: CompanyRepository,
		private _vmSrv: CompanyVmService,
		private _xlsxSrv: XlsxService,
		private _router: Router,
		private _route: ActivatedRoute
	) { }

	ngOnInit() {
		this.companies = this._route.paramMap
			.switchMap(async params => {
				if (params.has('search')) {
					this.search = params.get('search');
				}
				const companies = await (this.search ? this._companyRepo.findByName(this.search) : this._companyRepo.findAll());
				return companies.map(c => this._vmSrv.mapToCompanyBaseVm(c));
			});
	}

	gotoNew(): void {
		this._router.navigate(['company/edit', '__new__']);
	}

	gotoDetails(id): void {
		this._router.navigate(['company/details', id]);
	}

	onSearch(term: string) {
		this.search = term.trim();
		const navArray: Array<any> = ['company'];
		if (this.search) {
			navArray.push({ 'search': this.search });
		}
		this._router.navigate(navArray);
	}

	async onXlsx() {
		const companies = (await (this.search ? this._companyRepo.findByName(this.search) : this._companyRepo.findAll()))
			.map(c => this._vmSrv.mapToCompanyDetailsVm(c));
		await this._xlsxSrv.exportToXlsx(
			companies,
			'companies.xlsx',
			'Companies',
			[
				{ key: 'id', name: 'id' },
				{ key: 'name', name: 'name' },
				{ key: 'country', name: 'country' },
				{ key: 'city', name: 'city' },
				{ key: 'description', name: 'description' },
				{ key: 'contactsNum', name: 'number of contacts' },
				{ key: 'activities', name: 'activities' },
				{ key: 'phone', name: 'phone' },
				{ key: 'website', name: 'website' },
				{ key: 'isNew', name: 'is new' },
				{ key: 'created', name: 'created' },
				{ key: 'updated', name: 'updated' }
			]
		);
	}
}
