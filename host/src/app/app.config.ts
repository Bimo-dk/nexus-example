import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { LocalNexusService } from './local-nexus.service';

const REGISTRY_URL = '/api';
const NEXUS_TOKEN = 'dev-token-change-in-production';

// Note: USER_CONTEXT demo user is registered in app.component.ts (AppShell),
// because in federation mode the gateway only loads ./AppShell, not this config.

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
