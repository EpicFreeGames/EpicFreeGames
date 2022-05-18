import { Tooltip } from "@mantine/core";
import { useHasMounted } from "../../hooks/useHasMounted";
import { Button } from "../Button";
import { Link } from "../Link";

export const HomeButton = () => {
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  const atHome = window.location.pathname === "/";
  if (atHome) return null;

  return (
    <Link to="/">
      <Tooltip label="Go to home" transition={"rotate-right"}>
        <Button p={"0.5rem"} variant="outline">
          Home
        </Button>
      </Tooltip>
    </Link>
  );
};
