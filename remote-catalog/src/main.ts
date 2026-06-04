import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch((err) => console.error('[remote-catalog] Federation init failed:', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('[remote-catalog] Bootstrap failed:', err));

