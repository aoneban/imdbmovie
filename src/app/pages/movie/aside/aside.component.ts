import { Component, Input } from '@angular/core';
import { SingleMovie } from '../../../interfaces/interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside',
  imports: [CommonModule],
  template: `
    <aside class="ml-14">
      <h3 class="font-bold">Status</h3>
      <p>{{ props?.status }}</p>
      <h3 class="font-bold">Original language</h3>
      <p>{{ language(props?.original_language) }}</p>
      <h3 class="font-bold">Budget</h3>
      <p>&dollar;{{ reduceNumber(props?.budget) }}.00</p>
      <h3 class="font-bold">Revenue</h3>
      <p>&dollar;{{ reduceNumber(props?.revenue) }}.00</p>
    </aside>
  `,
  styles: ``,
})
export class AsideComponent {
  @Input() props: SingleMovie | undefined;

  reduceNumber(item: string | number | undefined): string | undefined {
    if (item == null) {
      return '-';
    }

    const str: string[] = [];
    const str2 = item.toString().split('').reverse();

    str2.forEach((elem, id) => {
      str.push(elem);
      if ((id + 1) % 3 === 0) {
        str.push(',');
      }
    });

    if (str.at(-1) === ',') {
      str.pop();
    }

    return str.reverse().join('');
  }

  language(item: string | undefined): string | undefined {
    if (item == null) return '-';
    if (item.toLowerCase() === 'en') return 'English';
    return item;
  }
}
