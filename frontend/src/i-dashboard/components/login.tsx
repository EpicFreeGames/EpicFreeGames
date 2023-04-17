"use client";

import { useRouter } from "next/navigation";

import { useSession } from "@/i-dashboard/queries/auth/session";

export function Login() {
	const router = useRouter();
	const { isLoading, error, data } = useSession();

	if (!isLoading && !error && data) {
		router.push("/i-dashboard/");
	}

	return (
		<div className="flex flex-col gap-2">
			<h1 className="text-2xl">Login</h1>
		</div>
	);
}
