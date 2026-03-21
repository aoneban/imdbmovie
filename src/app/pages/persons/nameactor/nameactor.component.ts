import { Component, Input } from '@angular/core';
import { SinglePerson } from '../../../interfaces/interface';

@Component({
  selector: 'app-nameactor',
  imports: [],
  template: `
    <h1 class="text-3xl font-bold text-gray-800 pt-10">
      {{ actorName?.name }}
    </h1>
  `,
  styles: ``,
})
export class NameActorComponent {
  @Input() actorName: SinglePerson | undefined
}
