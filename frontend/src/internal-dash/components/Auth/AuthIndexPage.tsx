import { trpc } from "../../trpc";

export function AuthIndexPage() {
	const redirectUrl = trpc.auth.getAuthInitUrl.useQuery();

	return (
		<main className="fixed h-full w-full">
			<div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
				<div className="text-2xl font-bold">Auth</div>

				{redirectUrl.isLoading ? (
					<div>Loading...</div>
				) : redirectUrl.error ? (
					<div>Error: {redirectUrl.error.message}</div>
				) : redirectUrl.data ? (
					<a href={redirectUrl.data}>Login</a>
				) : (
					<div>No redirect url</div>
				)}
			</div>
		</main>
	);
}
