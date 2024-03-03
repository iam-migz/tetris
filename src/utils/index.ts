export const get = <T extends HTMLElement>(
  query: string,
  parent?: HTMLElement,
) => (parent || document).querySelector<T>(query)!;

export const create = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: Partial<HTMLElementTagNameMap[K]> = {},
): HTMLElementTagNameMap[K] => Object.assign(document.createElement(tagName), options);
