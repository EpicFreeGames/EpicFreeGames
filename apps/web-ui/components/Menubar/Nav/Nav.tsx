import { useState } from "react";
import { NavButton } from "./NavButton";
import { NavDrawer } from "./NavDrawer";

export const Nav = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NavButton setOpen={setOpen} />
      <NavDrawer open={open} setOpen={setOpen} />
    </>
  );
};
