import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { XlsxService } from '../../../infra';
import { Company, CompanyRepository } from '../../core';
import { CompanyVmService } from '../services/company-vm.service';
import { CompanyListVm } from '../models/company-list-vm.model';
import { CompanyDetailsVm } from '../models/company-details-vm.model';

@Component({
	selector: 'app-company-list',
	templateUrl: 'company-list.component.html'
})
export class CompanyListComponent implements OnInit {
	private companies: BehaviorSubject<Company[]> = new BehaviorSubject<Company[]>([]);
	private searchTerms: Subject<string> = new Subject<string>();

	companyList: Observable<CompanyListVm[]>;

	constructor(
		private _companyRepo: CompanyRepository,
		private _vmSrv: CompanyVmService,
		private _xlsxSrv: XlsxService,
		private _router: Router,
		private _route: ActivatedRoute
	) { }

	ngOnInit() {
		this._companyRepo.findAll()
			.then(cs => this.companies.next(cs));
		this.searchTerms
			.debounceTime(500)
			.distinctUntilChanged((x, y) => x.trim().toUpperCase() === y.trim().toUpperCase())
			.subscribe(async term => {
				const search = term.trim();
				const cs = await (search ? this._companyRepo.findByName(search) : this._companyRepo.findAll());
				this.companies.next(cs);
			});
		this.companyList = this.companies.map(cs => cs.map(c => this._vmSrv.mapToCompanyListVm(c)));
	}

	gotoNew(): void {
		this._router.navigate(['company/edit', '__new__']);
	}

	gotoDetails(id): void {
		this._router.navigate(['company/details', id]);
	}

	search(term: string): void {
		this.searchTerms.next(term);
	}

	onXlsx(): void {
		const subs = this.companies
			.map(cs => cs.map(c => this._vmSrv.mapToCompanyDetailsVm(c)))
			.subscribe(cs => {
				this._xlsxSrv.exportToXlsx(
					cs,
					'companies.xlsx',
					'Companies',
					['id', 'name', 'country', 'city', 'description', 'activities', 'phone', 'website', 'isNew', 'created', 'updated']
				);
			});
		subs.unsubscribe();
	}
}
