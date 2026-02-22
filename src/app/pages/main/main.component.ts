import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { WelcomeComponent } from '../../shared/welcome/welcome.component';
import { PopularComponent } from '../../shared/popular/popular.component';
import { TrailersComponent } from '../../shared/trailers/trailers.component';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';

@Component({
  selector: 'main',
  imports: [
    WelcomeComponent,
    PopularComponent,
    TrailersComponent,
    IntersectionObserverDirective,
  ],

  template: `
    <app-welcome></app-welcome>

    <app-popular 
    [config]="{
      link1: 'https://api.themoviedb.org/3/trending/all/day?language=en-US',
      link2: 'https://api.themoviedb.org/3/trending/all/week?language=en-US',
      type: ['Top Today', 'Top Week',],
      title: 'Trending',
      bgData: true,
    }"></app-popular>

    <app-trailers></app-trailers>

    <div
      appIntersectionObserver
      (visible)="loadPopular()"
      [rootMargin]="'50px'"
      style="height: 1px;"></div>
    <ng-template #popularContainer ></ng-template>

    <div
      appIntersectionObserver
      (visible)="loadPopular2()"
      [rootMargin]="'25px'"
      style="height: 1px;"></div>
    <ng-template #popularContainer2></ng-template>

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
  @ViewChild('trendsContainer', { read: ViewContainerRef })
  trendsVcr!: ViewContainerRef;

  @ViewChild('popularContainer', { read: ViewContainerRef })
  popularVcr!: ViewContainerRef;

  @ViewChild('popularContainer2', { read: ViewContainerRef })
  popularVcr2!: ViewContainerRef;

  @ViewChild('personsContainer', { read: ViewContainerRef })
  personsVcr!: ViewContainerRef;

  private popularLoaded = false;
  private popularLoaded2 = false;
  private personsLoaded = false;

  async loadPopular() {
    if (this.popularLoaded) return; 
    this.popularLoaded = true;

    const { PopularComponent } = await import(
      '../../shared/popular/popular.component'
    );
    const componentRef = this.popularVcr.createComponent(PopularComponent);
    componentRef.setInput('config', {
      link1: 'https://api.themoviedb.org/3/trending/all/day?language=en-US',
      link2: 'https://api.themoviedb.org/3/trending/tv/day?language=en-US',
      link3: 'https://api.themoviedb.org/3/movie/top_rated?language=en-US',
      link4: 'https://api.themoviedb.org/3/trending/movie/day?language=en-US',
      type: ['Popular', 'Now', 'Top Rated', 'Upcoming'],
      title: "What's Popular",
      bgData: false,
    });
  }

    async loadPopular2() {
    if (this.popularLoaded2) return; 
    this.popularLoaded2 = true;

    const { PopularComponent } = await import(
      '../../shared/popular/popular.component'
    );
    const componentRef = this.popularVcr2.createComponent(PopularComponent);
    componentRef.setInput('config', {
      link1: 'https://api.themoviedb.org/3/tv/airing_today',
      link2: 'https://api.themoviedb.org/3/tv/on_the_air',
      type: ['Airing', 'Tv'],
      title: 'Free to watch',
      mediaType: 'tv',
      bgData: false,
    });
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
