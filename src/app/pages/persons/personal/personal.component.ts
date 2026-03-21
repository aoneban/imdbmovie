import { Component, Input } from '@angular/core';
import { SinglePerson } from '../../../interfaces/interface';

@Component({
  selector: 'app-personal',
  imports: [],
  template: `
    <div>
      <h3 class="font-medium text-xl mb-3 mt-[7rem]">Personal Info</h3>
      <div>
        <h4 class="font-bold mt-3">Known for</h4>
        <p>{{ data?.known_for_department }}</p>
      </div>
      <div>
        <h4 class="font-bold mt-3">Gender</h4>
        <p>{{ data?.gender === 1 ? 'female' : 'male' }}</p>
      </div>
      <div>
        <h4 class="font-bold mt-3">Birthday</h4>
        <p>
          {{ formatDate(data?.birthday) }}
          @if (!data?.deathday) {
            <span>({{ actorAge(data?.birthday) }} years old)</span>
          }
        </p>
      </div>
      @if (data?.deathday) {
        <div>
          <h4 class="font-bold mt-3">Day of Death</h4>
          <p>
            {{ formatDate(data?.deathday)
            }}<span>
              (died at
              {{
                actorDeath(data?.birthday, data?.deathday)
              }})</span
            >
          </p>
        </div>
      }
      <div>
        <h4 class="font-bold mt-3">Place of Birth</h4>
        <p>{{ data?.place_of_birth }}</p>
      </div>
    </div>
  `,
  styles: ``,
})
export class PersonalComponent {
  @Input() data: SinglePerson | undefined

  formatDate(dateStr: string | undefined | null): string {
    if (dateStr) {
      const [year, month, day] = dateStr.split('-');
      return `${new Date(2000, Number(month) - 1, 1).toLocaleString('en-US', {
        month: 'long',
      })} ${day}, ${year}`;
    } else {
      return 'Date unknown';
    }
  }

  actorAge(dateStr: string | undefined | null): string {
    const yearNow = new Date().getFullYear();
    if (dateStr) {
      const year = dateStr.slice(0, 4);
      const yearToday = yearNow - Number(year);
      return yearToday.toString();
    }
    return '';
  }

  actorDeath(
    dateOne: string | undefined | null,
    dateTwo: string | undefined | null
  ): string {
    if (dateOne && dateTwo) {
      const [year, month, day] = dateOne.split('-');
      const [year1, month1, day1] = dateTwo.split('-');
      const allYears = +year1 - +year;
      if (month1 < month) {
        const finalYear = allYears - 1;
        return finalYear.toString();
      } else {
        return allYears.toString();
      }
    }
    return '';
  }
}
