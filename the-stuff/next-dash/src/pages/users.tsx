import { Layout } from "~components/Layout/Layout";
import { StatusCard } from "~components/StatusCard";
import { AddUser } from "~components/User/AddUser";
import { User } from "~components/User/User";
import { Flags } from "~utils/api/flags";
import { useUsers } from "~utils/api/users/getUsers";
import { Page } from "~utils/types";

const UsersPage: Page = () => {
  return (
    <Layout title="Users" titleButtons={[AddUser]}>
      <Users />
    </Layout>
  );
};

const Users = () => {
  const { data: users, error, isLoading } = useUsers();

  if (isLoading) return <StatusCard>Loading...</StatusCard>;

  if (error) return <StatusCard error>Error loading users</StatusCard>;

  return (
    <div className="flex flex-col gap-2">
      {users && users.length ? (
        users.map((user) => <User user={user} key={user.id} />)
      ) : (
        <StatusCard>No users</StatusCard>
      )}
    </div>
  );
};

UsersPage.requireAuth = true;
UsersPage.requiredFlags = [Flags.GetUsers];

export default UsersPage;
