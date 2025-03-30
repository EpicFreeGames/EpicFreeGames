import { Navigate, Route, Routes } from "react-router-dom";
import { AppGamesPage } from "./components/App/AppGamesPage/AppGamesPage";
import { AppLayout } from "./components/App/AppLayout";
import { AppSendsPage } from "./components/App/AppSendsPage/AppSendsPage";
import { AppSupportPage } from "./components/App/AppSupportPage";

export function AuthenticatedDash() {
	return (
		<Routes>
			<Route path="/dash/app" element={<AppLayout />}>
				<Route path="games" element={<AppGamesPage />} />
				<Route path="sends" element={<AppSendsPage />} />
				<Route path="support" element={<AppSupportPage />} />

				<Route path="*" element={<Navigate to="/dash/app" />} />
			</Route>

			<Route path="*" element={<Navigate to="/dash/app" />} />
		</Routes>
	);
}
