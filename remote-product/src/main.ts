import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch((err) => console.error('[remote-product] Federation init failed:', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('[remote-product] Bootstrap failed:', err));

