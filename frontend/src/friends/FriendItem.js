import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../shared/component/UIElements/Avatar';
import Card from '../shared/component/UIElements/Card';
import useHttpClient from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';

const FriendItem = ({ user: { userId, places, name, image, email } }) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${userId}/places`}>
          <div className="user-item__image">
            <Avatar image={image} alt={name} />
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
          </div>
        </Link>
      </Card>
    </li>
  );
};

const ReceivedFriendRequestItem = ({
  user: { userId, places, name, image, email },
  auth,
  acceptFriendHandler,
  cancelFriendHandler,
}) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const acceptFriendRequest = async userID => {
    try {
      const res = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/send/${userId}`,
        'PUT',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        },
      );
      acceptFriendHandler(userID);
    } catch (error) {}
  };
  const cancelFriendRequest = async userID => {
    try {
      const res = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/send/${userId}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        },
      );
      cancelFriendHandler(userID);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${userId}/places`}>
          <div className="user-item__image">
            <Avatar image={image} alt={name} />
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
          </div>
        </Link>
        <button className="btn btn-success" onClick={() => acceptFriendRequest(userId)}>
          <i className="fas fa-check-circle"></i>Accept
        </button>{' '}
        <button className="btn btn-success" onClick={() => cancelFriendRequest(userId)}>
          <i className="fas fa-window-close"></i>Cancel
        </button>
      </Card>
    </li>
  );
};

export { FriendItem, ReceivedFriendRequestItem };
