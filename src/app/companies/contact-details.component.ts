import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Company } from './models/company.model';
import { Contact } from './models/contact.model';
import { CompanyRepository } from './repositories/company.repository';
import { DirectoryService } from '../directories/services/directory.service';

@Component({
  moduleId: module.id,
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
  domainCompany: Company;
  company;
  contact;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _companyRepo: CompanyRepository,
    private _dirSrv: DirectoryService
  ) {
    this.company = {};
    this.contact = {};
  }

  ngOnInit() {
    let contactId = '';
    this._route.params
      .switchMap(params => {
        const company = this._companyRepo.getById(params['company_id']);
        contactId = params['contact_id'];
        return company;
      })
      .subscribe(item => {
        this.domainCompany = item;
        this.mapContact(contactId);
      });
  }

  gotoEdit(): void {
    this._router.navigate(['contact/edit', this.domainCompany._id, this.contact.id]);
  }

  mapContact(contactId) {
    // TODO: comapny mapping
    const contact = this.domainCompany.contacts
      .find(c => c._id == contactId);
    this.contact.id = contact._id;
    this.contact.name = contact.name;
    this.contact.jobTitle = contact.jobTitle;
    this.contact.phone = contact.phone;
    this.contact.mobile = contact.mobile;
    this.contact.email = contact.email;
    this.contact.active = contact.active;
    this.contact.created = contact.created;
    this.contact.updated = contact.updated;
    this._dirSrv.getDir('jobresponsibility').data
      .subscribe(jrs => {
        this.contact.jobResponsibilities = jrs
          .filter(a => contact.jobResponsibilities.includes(a._id))
          .map(a => a.name)
          .join(', ');
      });
    this._dirSrv.getDir('contentresponsibility').data
      .subscribe(crs => {
        this.contact.buyContents = crs
          .filter(a => contact.buyContents.includes(a._id))
          .map(a => a.name)
          .join(', ');
        this.contact.sellContents = crs
          .filter(a => contact.sellContents.includes(a._id))
          .map(a => a.name)
          .join(', ');
      });
  }
}
