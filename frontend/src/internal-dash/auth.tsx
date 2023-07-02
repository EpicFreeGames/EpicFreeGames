import { type ReactNode, useEffect, useState } from "react";
import { createCtx } from "../shared/createCtx";
import { z } from "zod";
import { safeJsonParse } from "../shared/safeJsonParse";

const authSchema = z.object({
	email: z.string(),
});

export type Auth = z.infer<typeof authSchema>;

const [useContextInner, Context] = createCtx<ReturnType<typeof useContextValue>>();
export const useAuthContext = useContextInner;

export function useAuth() {
	return useAuthContext().auth!;
}

export function AuthProvider(props: { children: ReactNode }) {
	const contextValue = useContextValue();

	return (
		<Context.Provider value={contextValue}>
			{!contextValue.isLoading && props.children}
		</Context.Provider>
	);
}

function useContextValue() {
	const [_auth, _setAuth] = useState<Auth | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	function setAuth(auth: Auth) {
		localStorage.setItem("auth", JSON.stringify(auth));
		_setAuth(auth);
	}

	function checkAuth() {
		const auth = authSchema.safeParse(safeJsonParse(localStorage.getItem("auth") ?? ""));

		if (auth.success) {
			setAuth(auth.data);
		} else {
			_setAuth(null);
			localStorage.clear();
		}
	}

	async function logout() {
		_setAuth(null);
		localStorage.clear();
	}

	useEffect(() => {
		setIsLoading(true);
		checkAuth();
		setIsLoading(false);

		window.addEventListener("storage", checkAuth);
		window.addEventListener("focus", checkAuth);
		window.addEventListener("blur", checkAuth);

		return () => {
			window.removeEventListener("storage", checkAuth);
			window.removeEventListener("focus", checkAuth);
			window.removeEventListener("blur", checkAuth);
		};
	}, []);

	return {
		isLoading,
		auth: _auth,
		setAuth,
		logout,
	};
}
