import { FC } from "react";
import { Menu2 } from "tabler-icons-react";
import { Button } from "../../Button";

export const NavButton: FC<{ setOpen: (open: boolean) => void }> = ({ setOpen }) => {
  return (
    <Button onClick={() => setOpen(true)} p={"0.5rem"}>
      <Menu2 />
    </Button>
  );
};
