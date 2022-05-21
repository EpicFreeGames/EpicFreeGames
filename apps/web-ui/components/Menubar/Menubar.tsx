import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";
import { FlexDiv } from "../FlexDiv";
import { HomeButton } from "./Home";
import { useMenuBarStyles } from "./Menubar.styles";
import { Nav } from "./Nav/Nav";
import { Profile } from "./Profile";

export const Menubar = () => {
  const { classes } = useMenuBarStyles();

  return (
    <div className={classes.outer}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <FlexDiv justifyBetween fullWidth>
            <FlexDiv gap05>
              <Nav />
              <HomeButton />
            </FlexDiv>

            <FlexDiv gap05>
              <ColorSchemeToggle />
              <Profile />
            </FlexDiv>
          </FlexDiv>
        </div>
      </div>
    </div>
  );
};
