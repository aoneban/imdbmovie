import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { SinglePerson } from '../../interfaces/interface';
import { PersonService } from '../../services/person.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'persons',
  imports: [HeaderComponent, NavbarComponent],
  template: `
    <app-header></app-header>
    <app-navbar></app-navbar>
    <p>persons works!</p>
    <p>Name: {{ personData()?.name }}</p>
    <p>persons works!</p>
  `,
  styles: ``,
})
export class PersonsComponent implements OnInit {
  personId: number | undefined;
  personData = signal<SinglePerson | undefined>(undefined);
  constructor(
    private route: ActivatedRoute,
    private personService: PersonService
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
        this.personData.set(data);
        console.log('Person data: ', this.personData());
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }
}
