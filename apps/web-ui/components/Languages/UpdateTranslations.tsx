import { updateTranslations } from "../../utils/requests/Languages";
import { Button } from "../Button";

export const UpdateTranslations = () => (
  <Button onClick={() => updateTranslations()}>Update translations</Button>
);
