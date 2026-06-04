import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNexusRemote } from '@bimo-dk/nexus-runtime';
import { routes } from './app.routes';
import { ProductPageComponent } from './remote-entry/entry.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNexusRemote({
      entry: ProductPageComponent,
      configDefaults: {
        registryUrl: 'http://registry:3000',
        nexusToken: 'dev-token',
      },
    }),
  ],
};
