"use client";

import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "react-query";

import { IDashboardNav } from "@/i-dashboard/components/nav";
import { useSession } from "@/i-dashboard/queries/auth/session";

import "./globals.css";

const queryClient = new QueryClient();

export default function IDashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<QueryClientProvider client={queryClient}>
					<IDashboardChildren>{children}</IDashboardChildren>
				</QueryClientProvider>
			</body>
		</html>
	);
}

function IDashboardChildren({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { isLoading, error, data } = useSession();

	if (isLoading) {
		return null;
	}

	if (error || !data) {
		router.push("/i-dashboard/login");
		return null;
	}

	return <main className="mx-auto max-w-[800px]">{children}</main>;
}
