import React, { useEffect, useState, useContext, Fragment } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/component/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/component/UIElements/LoadingSpinner';
import useHttpClient from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const Users = () => {
  const [users, setUsers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);
        setUsers(data.users);
      } catch (error) {}
    };
    getUsers();
  }, [sendRequest]);

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && users && auth.friendStatus && <UsersList items={users} auth={auth} />}
    </Fragment>
  );
};

export default Users;
