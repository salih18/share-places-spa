import React from 'react';
import { FriendItem, ReceivedFriendRequestItem } from './FriendItem';
import Card from '../shared/component/UIElements/Card';

const FriendList = ({ auth }) => {
  console.log(auth.friendStatus.receivedFriendRequest);
  if (auth.friendStatus.friendsList === 0) {
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
      {auth.friendStatus.friendsList.map(user => (
        <FriendItem user={user} key={user.id} />
      ))}
      {auth.friendStatus.receivedFriendRequest.map(user => (
        <ReceivedFriendRequestItem user={user} auth={auth} key={user.id} />
      ))}
    </ul>
  );
};

export default FriendList;
