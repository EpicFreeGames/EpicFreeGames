import { useHasMounted } from "../../hooks/useHasMounted";
import { Button } from "../Button";
import { ButtonLink } from "../Link";
import { Tooltip } from "../Tooltip";

export const HomeButton = () => {
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  const atHome = window.location.pathname === "/";
  if (atHome) return null;

  return (
    <ButtonLink to="/">
      <Tooltip label="Go to home">
        <Button p={"0.5rem"} variant="outline">
          Home
        </Button>
      </Tooltip>
    </ButtonLink>
  );
};
