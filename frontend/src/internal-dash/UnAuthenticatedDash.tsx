import { Navigate, Route, Routes } from "react-router-dom";
import { AuthIndexPage } from "./components/Auth/AuthIndexPage";
import { AuthCallbackPage } from "./components/Auth/AuthCallbackPage";

export function UnAuthenticatedDash() {
	return (
		<Routes>
			<Route path="/dash/auth">
				<Route path="login" element={<AuthIndexPage />} />
				<Route path="callback" element={<AuthCallbackPage />} />

				<Route path="*" element={<Navigate to="/dash/auth/login" />} />
			</Route>

			<Route path="*" element={<Navigate to="/dash/auth/login" />} />
		</Routes>
	);
}
