import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { SinglePerson } from '../../interfaces/interface';
import { PersonService } from '../../services/person.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'persons',
  imports: [HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header></app-header>
    <p>persons works!</p>
    <p>Name: {{ personData?.name }}</p>
    <p>persons works!</p>
  `,
  styles: ``,
})
export class PersonsComponent implements OnInit {
  personId: number | undefined;
  personData: SinglePerson | undefined;
  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.personId = id ? Number(id) : undefined;
      if (this.personId !== undefined) {
        this.fetchPerson(this.personId);
      }
    });
  }

  fetchPerson(id: number): void {
    this.personService.getDataPerson(id).subscribe(
      data => {
        this.personData = data;
        console.log('Person data: ', this.personData);
        this.cdr.markForCheck();
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }
}
