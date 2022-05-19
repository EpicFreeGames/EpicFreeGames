import { useHasMounted } from "../../hooks/useHasMounted";
import { Button } from "../Button";
import { ButtonLink } from "../Link";

export const HomeButton = () => {
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  const atHome = window.location.pathname === "/";
  if (atHome) return null;

  return (
    <ButtonLink to="/">
      <Button p={"0.5rem"} variant="outline">
        Home
      </Button>
    </ButtonLink>
  );
};
