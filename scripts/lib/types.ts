export type PageEntry = { id: string; enabled: boolean };

export type CategoryEntry = {
  id: string;
  title: string;
  description: string;
  order: number;
  pages: PageEntry[];
};
