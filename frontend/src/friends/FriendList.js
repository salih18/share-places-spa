import React from 'react';
import { FriendItem, ReceivedFriendRequestItem } from './FriendItem';
import Card from '../shared/component/UIElements/Card';

const FriendList = ({
  auth,
  receivedFriend,
  friends,
  acceptFriendHandler,
  cancelFriendHandler,
}) => {
  if (friends.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No friend found.</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {friends.map(user => (
        <FriendItem user={user} key={user.id} />
      ))}
      {receivedFriend.map(user => (
        <ReceivedFriendRequestItem
          user={user}
          auth={auth}
          acceptFriendHandler={acceptFriendHandler}
          cancelFriendHandler={cancelFriendHandler}
          key={user.id}
        />
      ))}
    </ul>
  );
};

export default FriendList;
