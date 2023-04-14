export type Translations = { [key: string]: string } & { __type: "Translations" };
export type TFunction = ((key: string) => string) & { __type: "TFunction" };

export const useT = (translations: Translations): TFunction => {
	return ((key: string, vars: { [key: string]: string }) => {
		const translation = translations?.[key];

		if (!translation) {
			return key;
		}

		const varKeys = Object.keys(vars);

		const fullTranslation = varKeys.length
			? varKeys.reduce((acc, key) => {
					return acc.replace(`{${key}}`, vars[key]);
			  }, translation)
			: translation;

		return fullTranslation;
	}) as TFunction;
};
