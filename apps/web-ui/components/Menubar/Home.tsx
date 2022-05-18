import { useHasMounted } from "../../hooks/useHasMounted";
import { Button } from "../Button";
import { Link } from "../Link";
import { Tooltip } from "../Tooltip";

export const HomeButton = () => {
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  const atHome = window.location.pathname === "/";
  if (atHome) return null;

  return (
    <Link to="/">
      <Tooltip label="Go to home">
        <Button p={"0.5rem"} variant="outline">
          Home
        </Button>
      </Tooltip>
    </Link>
  );
};
