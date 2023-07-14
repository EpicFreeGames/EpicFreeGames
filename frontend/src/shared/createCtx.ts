import { createContext, useContext } from "react";

export const createCtx = <ContextType>() => {
	const ctx = createContext<ContextType | undefined>(undefined);

	const useCtx = () => {
		const c = useContext(ctx);

		if (c === undefined) throw new Error("useCtx must be inside a Provider with a value");

		return c;
	};

	return [useCtx, ctx] as const;
};
