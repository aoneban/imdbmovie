import { Component, Input } from '@angular/core';
import { SingleMovie } from '../../../interfaces/interface';

@Component({
  selector: 'app-rating',
  standalone: true,
  template: `
    <div class="rating-block flex items-center mb-3">
      <div class="rating-circle">
        <svg width="40" height="40">
          <!-- Background circle -->
          <circle
            class="bg"
            cx="20"
            cy="20"
            r="16"
            stroke-width="3">
          </circle>

          <!-- Progress -->
          <circle
            class="progress"
            cx="20"
            cy="20"
            r="16"
            stroke-width="3"
            [attr.stroke]="color"
            [attr.stroke-dasharray]="circumference"
            [attr.stroke-dashoffset]="dashOffset">
          </circle>

          <!-- Text -->
          <text
            x="50%"
            y="50%"
            text-anchor="middle"
            dy=".3em"
            fill="white"
            font-size="12"
            transform="rotate(90, 20, 20)">
            {{ (percent / 10).toFixed(1) }}
          </text>
        </svg>
      </div>

      <div class="rating-name ml-2">
        <p>IMDB</p>
      </div>
    </div>
  `,
  styles: `
    .rating-circle {
      position: relative;
      display: inline-block;

      svg {
        transform: rotate(-90deg);
      }

      circle {
        fill: #000;
        stroke-linecap: round;
      }

      .bg {
        stroke: #555;
      }

      .progress {
        transition:
          stroke-dashoffset 0.5s ease,
          stroke 0.3s ease;
      }
    }
  `,
})
export class RatingComponent {
  @Input() rat: SingleMovie | undefined;

  radius = 16;
  circumference = 2 * Math.PI * this.radius;

  get percent(): number {
    return (this.rat?.vote_average ?? 0) * 10;
  }

  get dashOffset(): number {
    return this.circumference - (this.percent / 100) * this.circumference;
  }

  get color(): string {
    const rating = this.rat?.vote_average ?? 0;

    if (rating >= 7) return '#21d07a';   // green
    if (rating >= 5) return '#d2d531';   // yellow
    if (rating === 0) return '#db2360';   // red
    return '#db2360';                    
  }
}
