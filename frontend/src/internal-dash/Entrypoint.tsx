import { AuthenticatedDash } from "./AuthenticatedDash";
import { useAuth } from "./auth";
import { UnAuthenticatedDash } from "./UnAuthenticatedDash";

export function Entrypoint() {
	const auth = useAuth();

	return auth ? <AuthenticatedDash /> : <UnAuthenticatedDash />;
}
