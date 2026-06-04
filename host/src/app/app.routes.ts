import { Routes } from '@angular/router';
import { nexusRoute } from '@bimo-dk/nexus-runtime';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  nexusRoute({ path: 'products',    remote: 'catalog',  expose: 'CatalogPage'  }),
  nexusRoute({ path: 'products/:id', remote: 'product',  expose: 'ProductPage'  }),
  nexusRoute({ path: 'cart',        remote: 'cart',     expose: 'CartPage'     }),
  nexusRoute({ path: 'checkout',    remote: 'checkout', expose: 'CheckoutPage' }),
  nexusRoute({ path: 'account',     remote: 'account',  expose: 'AccountPage'  }),
];
