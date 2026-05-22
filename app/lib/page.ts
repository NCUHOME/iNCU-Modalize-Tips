import { routeManifest } from '~/generated/pages';

export function getPageData(categoryId: string, pageId: string) {
  return routeManifest.categories
    .find((c) => c.id === categoryId)
    ?.pages.find((p) => p.id === pageId);
}

export function getPageMeta(categoryId: string, pageId: string) {
  const page = getPageData(categoryId, pageId);
  return [{ title: page?.title }, { name: 'description', content: page?.description }];
}
