import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { WelcomeComponent } from '../../shared/welcome/welcome.component';
import { TrendsComponent } from '../../shared/trends/trends.component';
import { TrailersComponent } from '../../shared/trailers/trailers.component';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';

@Component({
  selector: 'main',
  imports: [
    WelcomeComponent,
    TrendsComponent,
    TrailersComponent,
    IntersectionObserverDirective,
  ],

  template: `
    <app-welcome></app-welcome>
    <app-trends></app-trends>
    <app-trailers></app-trailers>

    <div
      appIntersectionObserver
      (visible)="loadPopular()"
      [rootMargin]="'50px'"
      style="height: 1px;"></div>
    <ng-template #popularContainer></ng-template>

    <div
      appIntersectionObserver
      (visible)="loadFree()"
      [rootMargin]="'25px'"
      style="height: 1px;"></div>
    <ng-template #freeContainer></ng-template>

    <div
      appIntersectionObserver
      (visible)="loadPersons()"
      [rootMargin]="'10px'"
      style="height: 1px;"></div>
    <ng-template #personsContainer></ng-template>
  `,
  styles: ``,
})
export class MainPageComponent {
  @ViewChild('popularContainer', { read: ViewContainerRef })
  popularVcr!: ViewContainerRef;

  @ViewChild('freeContainer', { read: ViewContainerRef })
  freeVcr!: ViewContainerRef;

  @ViewChild('personsContainer', { read: ViewContainerRef })
  personsVcr!: ViewContainerRef;

  private popularLoaded = false;
  private freeLoaded = false;
  private personsLoaded = false;

  async loadPopular() {
    if (this.popularLoaded) return; 
    this.popularLoaded = true;

    const { PopularComponent } = await import(
      '../../shared/popular/popular.component'
    );
    this.popularVcr.createComponent(PopularComponent);
  }

  async loadFree() {
    if (this.freeLoaded) return;
    this.freeLoaded = true;

    const { FreeComponent } = await import('../../shared/free/free.component');
    this.freeVcr.createComponent(FreeComponent);
  }

  async loadPersons() {
    if (this.personsLoaded) return; 
    this.personsLoaded = true;

    const { PopularPersonsComponent } = await import(
      '../../shared/popularpersons/popularpersons.component'
    );
    this.personsVcr.createComponent(PopularPersonsComponent);
  }
}
