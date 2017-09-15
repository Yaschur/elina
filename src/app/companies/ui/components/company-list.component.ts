import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { XlsxService } from '../../../infra';
import { Company, CompanyRepository } from '../../core';
import { CompanyVmService } from '../services/company-vm.service';
import { CompanyListVm } from '../models/company-list-vm.model';
import { CompanyDetailsVm } from '../models/company-details-vm.model';

import 'rxjs/add/observable/fromPromise';

@Component({
	selector: 'app-company-list',
	templateUrl: 'company-list.component.html'
})
export class CompanyListComponent implements OnInit {
	companies: Observable<Company[]>;
	companyList: Observable<CompanyListVm[]>;
	companyExport: Observable<CompanyDetailsVm[]>;
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
				return this.search ? this._companyRepo.findByName(this.search) : this._companyRepo.findAll();
			});
		this.companyList = this.companies.map(cs => cs.map(c => this._vmSrv.mapToCompanyListVm(c)));
		this.companyExport = this.companies.map(cs => cs.map(c => this._vmSrv.mapToCompanyDetailsVm(c)));
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

	onXlsx(): void {
		const subs = this.companies.map(cs => cs.map(c => this._vmSrv.mapToCompanyDetailsVm(c)))
			.subscribe(cs => {
				this._xlsxSrv.exportToXlsx(
					cs,
					'companies.xlsx',
					'Companies',
					['id', 'name', 'country', 'city', 'description', 'activities', 'phone', 'website', 'isNew', 'created', 'updated']
				);
				subs.unsubscribe();
			});
	}
}
