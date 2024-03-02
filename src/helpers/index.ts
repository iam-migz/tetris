
export const get = <T extends HTMLElement>(query: string, parent?: HTMLElement) => {
	return (parent ? parent : document).querySelector<T>(query)!;
};

export const create = <K extends keyof HTMLElementTagNameMap>(
	tagName: K,
	options: Partial<HTMLElementTagNameMap[K]> = {}
): HTMLElementTagNameMap[K] => {
	return Object.assign(document.createElement(tagName), options);
}