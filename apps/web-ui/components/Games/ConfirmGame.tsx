import { useModals } from "@mantine/modals";
import { IGame } from "shared";
import { mutate } from "swr";
import { Check } from "tabler-icons-react";
import { useNotConfirmedGames } from "../../hooks/requests";
import { confirmGame } from "../../utils/requests/Games";
import { Button } from "../Button";
import { Text } from "../Text";
import { Tooltip } from "../Tooltip";

export const ConfirmGame = ({ game }: { game: IGame }) => {
  const modals = useModals();
  const { notConfirmedGames } = useNotConfirmedGames();

  const openConfirmModal = () =>
    modals.openConfirmModal({
      title: "Confirm game",
      children: (
        <Text>
          Are you sure you want to confirm <b>{game.name}</b>?
        </Text>
      ),
      labels: { confirm: "Yes, confirm game", cancel: "No, cancel" },
      confirmProps: { color: "blue" },
      onConfirm: () => mutate("/games/not-confirmed", confirmGame(game, notConfirmedGames)),
    });

  return game.confirmed ? (
    <Tooltip fullWidth label={`${game.name} is already confirmed`}>
      <Button disabled p="0.5rem" fullWidth>
        <Check />
      </Button>
    </Tooltip>
  ) : (
    <Button p="0.5rem" onClick={openConfirmModal} fullWidth>
      <Check />
    </Button>
  );
};
