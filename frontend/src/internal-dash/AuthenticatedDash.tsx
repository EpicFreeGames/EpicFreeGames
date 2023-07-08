import { Navigate, Route, Routes } from "react-router-dom";
import { AppIndexPage } from "./components/App/AppIndexPage/AppIndexPage";
import { AppGamesPage } from "./components/App/AppGamesPage/AppGamesPage";
import { AppLayout } from "./components/App/AppLayout";
import { AppSendsPage } from "./components/App/AppSendsPage/AppSendsPage";

export function AuthenticatedDash() {
	return (
		<Routes>
			<Route path="/dash/app" element={<AppLayout />}>
				<Route index element={<AppIndexPage />} />
				<Route path="games" element={<AppGamesPage />} />
				<Route path="sends" element={<AppSendsPage />} />

				<Route path="*" element={<Navigate to="/dash/app" />} />
			</Route>

			<Route path="*" element={<Navigate to="/dash/app" />} />
		</Routes>
	);
}
