import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch((err) => console.error('[remote-cart] Federation init failed:', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('[remote-cart] Bootstrap failed:', err));

