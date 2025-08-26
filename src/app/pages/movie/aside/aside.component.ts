import { Component, Input } from '@angular/core';
import { SingleMovie } from '../../../interfaces/interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside',
  imports: [CommonModule],
  template: `
    <aside class="aside">
      <h3>Status</h3>
      <p>{{ props?.status }}</p>
      <h3>Original language</h3>
      <p>{{ props?.original_language }}</p>
      <h3>Budget</h3>
      <p>{{ props?.budget }}</p>
      <h3>Revenue</h3>
      <p>{{ props?.revenue }}</p>
    </aside>
  `,
  styles: ``,
})
export class AsideComponent {
  @Input() props: SingleMovie | undefined;
}
