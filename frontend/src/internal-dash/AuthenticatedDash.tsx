import { Navigate, Route, Routes } from "react-router-dom";
import { AppIndexPage } from "./components/App/AppIndexPage/AppIndexPage";
import { AppGamesPage } from "./components/App/AppGamesPage/AppGamesPage";
import { AppLayout } from "./components/App/AppLayout";

export function AuthenticatedDash() {
	return (
		<Routes>
			<Route path="/dash/app" element={<AppLayout />}>
				<Route index element={<AppIndexPage />} />
				<Route path="games" element={<AppGamesPage />} />

				<Route path="*" element={<Navigate to="/dash/app" />} />
			</Route>

			<Route path="*" element={<Navigate to="/dash/app" />} />
		</Routes>
	);
}
