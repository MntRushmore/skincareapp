import { Hono } from 'hono';
import type { Handler } from 'hono/types';
import updatedFetch from '../src/__create/fetch';

const API_BASENAME = '/api';
const api = new Hono();

if (globalThis.fetch) {
  globalThis.fetch = updatedFetch;
}

type RouteHandler = (
  request: Request,
  context?: { params: Record<string, string> }
) => Promise<Response> | Response;

type RouteModule = Partial<
  Record<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', RouteHandler>
>;

// Vite bundles these into the server build. A runtime readdir of src/app/api
// breaks once the server is compiled into build/server, because `@/` aliases
// only resolve while Vite is transforming the modules.
const routeModules = import.meta.glob('../src/app/api/**/route.js', {
  eager: true,
}) as Record<string, RouteModule>;

function patternFromKey(key: string): string {
  const relative = key
    .replace(/^\.\.\/src\/app\/api/, '')
    .replace(/\/route\.js$/, '');
  const segments = relative.split('/').filter(Boolean);
  if (segments.length === 0) return '/';
  const parts = segments.map((segment) => {
    const match = segment.match(/^\[(\.{3})?([^\]]+)\]$/);
    if (!match) return segment;
    const dots = match[1];
    const param = match[2];
    return dots === '...' ? `:${param}{.+}` : `:${param}`;
  });
  return `/${parts.join('/')}`;
}

function registerRoutes() {
  api.routes = [];

  const entries = Object.entries(routeModules).sort((a, b) => {
    const patternA = patternFromKey(a[0]);
    const patternB = patternFromKey(b[0]);
    const paramsA = (patternA.match(/:/g) || []).length;
    const paramsB = (patternB.match(/:/g) || []).length;
    if (paramsA !== paramsB) return paramsA - paramsB;
    return patternB.length - patternA.length;
  });

  for (const [key, route] of entries) {
    const honoPath = patternFromKey(key);
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
    for (const method of methods) {
      const handlerFn = route[method];
      if (!handlerFn) continue;
      const handler: Handler = (c) => handlerFn(c.req.raw, { params: c.req.param() });
      api[method.toLowerCase() as 'get'](honoPath, handler);
    }
  }
}

registerRoutes();

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    registerRoutes();
  });
}

export { api, API_BASENAME };
