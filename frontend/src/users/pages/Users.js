import React, { useEffect, useState, useContext, Fragment } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/component/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/component/UIElements/LoadingSpinner';
import useHttpClient from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

// user token la get yapilacak ki user objelerimiz gelsin

const Users = () => {
  const [users, setUsers] = useState();
  const [user, setUser] = useState({});
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  useEffect(() => {
    const getUsers = async () => {
      try {
        if (!auth.token) {
          const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);
          setUsers(data.users);
        } else {
          const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);
          setUsers(data.users);
          const userData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/users/me`,
            'GET',
            null,
            {
              Authorization: 'Bearer ' + auth.token,
            },
          );

          setUser(userData);
        }
      } catch (error) {}
    };
    getUsers();
  }, [sendRequest]);

  const sendFriendRequestHandler = id => {
    const { _id, name, image, email } = users.find(users => users._id == id);
    const sentUserObj = {
      userId: _id,
      name,
      image,
      email,
    };
    setUser(prevUsers => {
      const newUserState = {
        ...prevUsers,
        friendStatus: {
          sentFriendRequest: [{ ...sentUserObj }],
          friendsList: [...prevUsers.friendStatus.friendsList],
          receivedFriendRequest: [...prevUsers.friendStatus.receivedFriendRequest],
        },
      };
      return newUserState;
    });
  };
  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && users && user && (
        <UsersList
          items={users}
          userData={user}
          auth={auth}
          sendFriendRequestHandler={sendFriendRequestHandler}
        />
      )}
    </Fragment>
  );
};

export default Users;
