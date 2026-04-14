import { Component, input, Input } from '@angular/core';
import { SinglePerson } from '../../../interfaces/interface';

@Component({
  selector: 'app-nameactor',
  imports: [],
  template: `
    <h1 class="text-3xl font-bold text-gray-800 pt-10">
      {{ personData()?.name }}
    </h1>
  `,
  styles: ``,
})
export class NameActorComponent {
  personData = input< SinglePerson | null>(null)
}
