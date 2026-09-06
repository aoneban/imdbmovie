import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import 'zone.js/node';
import '@angular/compiler';
import { TestBed, TestComponentRenderer } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';

await mkdir(resolve('.angular'), { recursive: true });
const folder = await mkdtemp(resolve('.angular/url-loading-'));
try {
  const outfile = resolve(folder, 'components.mjs');
  await build({
    stdin: {
      contents: [
        "export { MovieComponent } from './src/app/pages/movie/movie.component';",
        "export { AllActorsComponent } from './src/app/pages/all-actors/all-actors.component';",
        "export { AllReviewsComponent } from './src/app/pages/movie/block-review/review/all-reviews/all-reviews.component';",
        "export { SingleReviewComponent } from './src/app/pages/movie/block-review/review/single-review/single-review.component';",
        "export { MovieService } from './src/app/services/movie.service';",
        "export { MovieStoreService } from './src/app/services/movie-store.service';",
        "export { MediaTypeService } from './src/app/services/media-type.service';",
      ].join('\n'),
      resolveDir: process.cwd(),
      loader: 'ts',
    },
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    outfile,
    tsconfig: 'tsconfig.json',
  });
  const app = await import(pathToFileURL(outfile).href);
  TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );

  for (const type of ['movie', 'tv']) {
    for (const name of [
      'MovieComponent',
      'AllActorsComponent',
      'AllReviewsComponent',
      'SingleReviewComponent',
    ]) {
      await test(type + ' direct visit: ' + name, () => {
        TestBed.resetTestingModule();
        const params = new BehaviorSubject(
          convertToParamMap({ id: '42', movieId: '42', reviewId: 'review' })
        );
        const query = new BehaviorSubject(
          convertToParamMap(type === 'tv' ? { type } : {})
        );
        const route = {
          paramMap: params,
          queryParamMap: query,
          snapshot: {
            url: [
              {
                path:
                  name === 'MovieComponent'
                    ? type
                    : name === 'AllActorsComponent'
                      ? 'cast'
                      : name === 'AllReviewsComponent'
                        ? 'all-reviews'
                        : 'single-review',
              },
            ],
            queryParamMap: query.value,
            params: { movieId: '42', reviewId: 'review' },
          },
        };
        const calls = [];
        const service = {
          getDataMovie(api, suffix, id) {
            calls.push({ api, suffix, id });
            if (id === 500)
              return throwError(() => new Error('API unavailable'));
            return of({
              id,
              title: 'Loaded from URL',
              cast: [],
              crew: [],
              results: [],
            });
          },
          getDataImage() {
            return of({ backdrops: [] });
          },
        };
        TestBed.configureTestingModule({
          providers: [
            { provide: DOCUMENT, useValue: { body: {}, defaultView: null } },
            {
              provide: TestComponentRenderer,
              useValue: { removeAllRootElements() {} },
            },
            { provide: ActivatedRoute, useValue: route },
            { provide: app.MovieService, useValue: service },
          ],
        });
        // Deliberately leave the movie store empty and set the opposite media type.
        TestBed.inject(app.MediaTypeService).setMediaType(
          type === 'movie' ? 'tv' : 'movie'
        );
        let component;
        TestBed.runInInjectionContext(() => {
          if (name === 'MovieComponent') {
            component = new app.MovieComponent(
              service,
              TestBed.inject(app.MovieStoreService)
            );
          } else if (name === 'SingleReviewComponent') {
            component = new app.SingleReviewComponent(route, service);
            component.ngOnInit();
          } else {
            component = new app[name]();
          }
        });
        TestBed.flushEffects();
        assert.ok(calls.length > 0);
        assert.ok(
          calls.every(
            call => call.api.endsWith('/' + type + '/') && call.id === 42
          )
        );
        assert.equal(
          typeof component.movieData === 'function'
            ? component.movieData().id
            : component.movieData.id,
          42
        );
        if (name === 'AllActorsComponent' || name === 'AllReviewsComponent') {
          const originalError = console.error;
          try {
            console.error = () => {};
            params.next(convertToParamMap({ id: '500' }));
            assert.equal(component.movieData(), undefined);
          } finally {
            console.error = originalError;
          }
          params.next(convertToParamMap({ id: '99' }));
          assert.equal(component.movieData().id, 99);
        }
      });
    }
  }
  TestBed.resetTestingModule();
} finally {
  await rm(folder, { recursive: true, force: true });
}
