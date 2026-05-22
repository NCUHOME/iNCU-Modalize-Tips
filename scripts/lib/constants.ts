import path from 'node:path';

export const ROOT = path.resolve(import.meta.dirname, '../..');
export const PAGES_FILE = path.join(ROOT, 'app', 'pages.ts');
export const ROUTES_DIR = path.join(ROOT, 'app', 'routes');

export const EXIT = '<exit>' as const;
export const BACK = '<back>' as const;
