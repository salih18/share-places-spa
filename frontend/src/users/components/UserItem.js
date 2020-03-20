import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../shared/component/UIElements/Avatar';
import Card from '../../shared/component/UIElements/Card';
import './UserItem.css';
import useHttpClient from '../../shared/hooks/http-hook';

const UserItem = ({ user, auth }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { id, image, name, places } = user;
  const Button = () => {
    const isFriend = auth.friendStatus.friendsList.filter(friend => {
      return friend.userId === id;
    });
    const isReceived = auth.friendStatus.receivedFriendRequest.filter(req => req.userId === id);
    const isSent = auth.friendStatus.sentFriendRequest.filter(sendReq => sendReq.userId === id);

    const sendFriendRequest = async () => {
      try {
        await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/send/${id}`, 'POST', null, {
          Authorization: 'Bearer ' + auth.token,
        });
      } catch (error) {}
    };

    if (auth.isLoggedIn) {
      if (isFriend.length > 0) {
        return (
          <p className="text-primary my-1">
            <i className="fas fa-user-friends"></i>
          </p>
        );
      }

      if (isReceived.length > 0) {
        return (
          <p className="text-primary my-1">
            <i className="fab fa-get-pocket"></i>
          </p>
        );
      }

      if (isSent.length > 0) {
        return (
          <p className="text-primary my-1">
            {' '}
            <i className="fas fa-clock"></i>
          </p>
        );
      }

      if (id === auth.userId) {
        return <></>;
      }

      return (
        <button className="btn btn-success" onClick={() => sendFriendRequest(id)}>
          <i className="fas fa-user-plus"></i>Add
        </button>
      );
    }
    return <></>;
  };

  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${id}/places`}>
          <div className="user-item__image">
            <Avatar image={image} alt={name} />
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
            <h3>
              {places.length} {places.length === 1 ? 'Place' : 'Places'}
            </h3>
          </div>
        </Link>
        <Button />
      </Card>
    </li>
  );
};

export default UserItem;
