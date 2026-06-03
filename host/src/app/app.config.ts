import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { LocalNexusService } from './local-nexus.service';

// Runtime config (registry URL etc.) — could be loaded from /assets/config.json,
// hardcoded here for the demo
const REGISTRY_URL = '/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(async () => {
      await inject(LocalNexusService).initialize(REGISTRY_URL);
    }),
  ],
};
