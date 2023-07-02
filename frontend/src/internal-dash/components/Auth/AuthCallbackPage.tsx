import { useEffect } from "react";
import { trpc } from "../../trpc";
import { useAuthContext } from "../../auth";

export function AuthCallbackPage() {
	const verifyCode = trpc.auth.verifyCode.useMutation();
	const auth = useAuthContext();

	useEffect(() => {
		(async () => {
			const code = new URLSearchParams(window.location.search).get("code");
			if (code) {
				const res = await verifyCode.mutateAsync({ code });

				if (res) {
					auth.setAuth({ email: res.email });
				}
			}
		})();
	}, []);

	return (
		<main className="fixed h-full w-full">
			<div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
				<div className="text-2xl font-bold">Auth</div>

				{verifyCode.isLoading ? (
					<div>Logging in...</div>
				) : verifyCode.error ? (
					<div>Error: {verifyCode.error.message}</div>
				) : verifyCode.data ? (
					<div>Logged in!</div>
				) : null}
			</div>
		</main>
	);
}
