import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch((err) => console.error('[remote-account] Federation init failed:', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('[remote-account] Bootstrap failed:', err));

