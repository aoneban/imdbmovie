import { Component, input } from '@angular/core';
import { SinglePerson } from '../../../interfaces/interface';

@Component({
  selector: 'app-nameactor',
  imports: [],
  host: { class: 'block min-w-0' },
  template: `
    <h1
      class="break-words text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
      {{ personData()?.name }}
    </h1>
  `,
  styles: ``,
})
export class NameActorComponent {
  personData = input<SinglePerson | null>(null);
}
