import { useModals } from "@mantine/modals";
import { IGame } from "shared";
import { mutate } from "swr";
import { Check, X } from "tabler-icons-react";
import { useNotConfirmedGames } from "../../hooks/requests";
import { confirmGame, unConfirmGame } from "../../utils/requests/Games";
import { Button } from "../Button";
import { Text } from "../Text";
import { Tooltip } from "../Tooltip";

export const UnconfirmGame = ({ game }: { game: IGame }) => {
  const modals = useModals();
  const { notConfirmedGames } = useNotConfirmedGames();

  const openConfirmModal = () =>
    modals.openConfirmModal({
      title: "Unconfirm game",
      children: (
        <Text>
          Are you sure you want to unconfirm <b>{game.name}</b>?
        </Text>
      ),
      labels: { confirm: "Yes, unconfirm game", cancel: "No, cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        console.log("confirm");
        mutate("/games/not-confirmed", unConfirmGame(game, notConfirmedGames));
      },
    });

  return game.confirmed ? (
    <Button p="0.5rem" color="red" onClick={openConfirmModal} fullWidth>
      <X />
    </Button>
  ) : (
    <Tooltip fullWidth label={`${game.name} is not yet confirmed!`}>
      <Button disabled p="0.5rem" fullWidth>
        <X />
      </Button>
    </Tooltip>
  );
};
