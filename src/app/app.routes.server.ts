import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'recoveries/:id/edit',
    renderMode: RenderMode.Client
  },
  {
    path: 'recoveries/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'treaties/:id/edit',
    renderMode: RenderMode.Client
  },
  {
    path: 'treaties/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'reinsurers/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
