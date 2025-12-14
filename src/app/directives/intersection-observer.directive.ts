// intersection-observer.directive.ts
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[appIntersectionObserver]',
  standalone: true,
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Output() visible = new EventEmitter<void>();
  @Input() rootMargin = '0px';
  @Input() once = true;

  private observer?: IntersectionObserver;
  private triggered = false;

  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              if (this.once && this.triggered) return;
              this.triggered = true;
              this.ngZone.run(() => this.visible.emit());
              if (this.once) this.observer?.disconnect();
            }
          }
        },
        { rootMargin: this.rootMargin }
      );

      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
