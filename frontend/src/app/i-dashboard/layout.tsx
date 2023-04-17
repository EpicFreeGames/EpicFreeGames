"use client";

import { QueryClient, QueryClientProvider } from "react-query";

import "./globals.css";

const queryClient = new QueryClient();

export default function IDashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
			</body>
		</html>
	);
}
