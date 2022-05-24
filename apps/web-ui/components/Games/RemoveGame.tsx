import { useModals } from "@mantine/modals";
import { useSession } from "next-auth/react";
import { IGame } from "shared";
import { Trash } from "tabler-icons-react";
import { removeGame } from "../../utils/requests/Games";
import { Button } from "../Button";
import { Text } from "../Text";

export const RemoveGame = ({ game }: { game: IGame }) => {
  const modals = useModals();

  const { data: session } = useSession();

  if (!session?.user.isAdmin) return null;

  const openConfirmModal = () =>
    modals.openConfirmModal({
      title: "Remove game",
      children: (
        <Text>
          Are you sure you want to remove <b>{game.name}</b>?
        </Text>
      ),
      labels: { confirm: "Yes, remove", cancel: "No, cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => removeGame(game),
    });

  return (
    <Button color="red" p="0.5rem" onClick={openConfirmModal}>
      <Trash />
    </Button>
  );
};
