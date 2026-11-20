import { club } from '@club/shared/club';

/** Title, description and link-preview tags for a page. Pass no title for the home page. */
export function pageMeta(title: null | string, description: string) {
  const fullTitle = title ? `${title} | ${club.name}` : club.name;
  return [
    { title: fullTitle },
    { content: description, name: 'description' },
    { content: fullTitle, property: 'og:title' },
    { content: description, property: 'og:description' },
    { content: 'website', property: 'og:type' },
  ];
}
