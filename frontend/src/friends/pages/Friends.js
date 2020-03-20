import React, { useEffect, useState, useContext, Fragment } from 'react';
import FriendList from '../FriendList';
import { AuthContext } from '../../shared/context/auth-context';
import useHttpClient from '../../shared/hooks/http-hook';

const Friends = () => {
  const auth = useContext(AuthContext);
  const [receivedFriend, setReceivedFriend] = useState();
  const [friends, setFriends] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/me`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token,
          },
        );

        setReceivedFriend(userData.friendStatus.receivedFriendRequest);
        setFriends(userData.friendStatus.friendsList);
      } catch (error) {}
    };
    getUser();
  }, [sendRequest]);

  const acceptFriendHandler = async id => {
    await setFriends(prevFriends => {
      const acceptedFriend = receivedFriend.find(users => users.userId === id);
      return prevFriends.concat(acceptedFriend);
    });
    setReceivedFriend(prevReceivedFriend => {
      return prevReceivedFriend.filter(users => users.userId !== id);
    });
  };

  const cancelFriendHandler = id => {
    setReceivedFriend(prevReceivedFriend => {
      return prevReceivedFriend.filter(users => users.userId !== id);
    });
  };

  return (
    <Fragment>
      {!isLoading && receivedFriend && friends && (
        <FriendList
          auth={auth}
          receivedFriend={receivedFriend}
          friends={friends}
          acceptFriendHandler={acceptFriendHandler}
          cancelFriendHandler={cancelFriendHandler}
        />
      )}
    </Fragment>
  );
};

export default Friends;
