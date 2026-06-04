import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch((err) => console.error('[remote-checkout] Federation init failed:', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('[remote-checkout] Bootstrap failed:', err));

