import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { LocalNexusService } from './local-nexus.service';

// Demo config — in a real deployment these would come from /assets/config.json
// generated at container start. Keeping them inline here keeps the demo simple.
const REGISTRY_URL = '/api';
const NEXUS_TOKEN = 'dev-token-change-in-production';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(async () => {
      await inject(LocalNexusService).initialize(REGISTRY_URL, NEXUS_TOKEN);
    }),
  ],
};
