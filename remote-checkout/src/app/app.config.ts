import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNexusRemote } from '@bimo-dk/nexus-runtime';
import { routes } from './app.routes';
import { CheckoutPageComponent } from './remote-entry/entry.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNexusRemote({
      entry: CheckoutPageComponent,
      configDefaults: {
        registryUrl: 'http://localhost:8669/api',
        nexusToken: 'dev-token',
      },
    }),
  ],
};
