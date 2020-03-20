import React, { useEffect, useState, useContext, Fragment } from 'react';
import FriendList from '../FriendList';
import { AuthContext } from '../../shared/context/auth-context';

const Friends = () => {
  const auth = useContext(AuthContext);
  console.log({ auth });
  //   useEffect(() => {
  //   const getUsers = async () => {
  //     try {
  //       const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);
  //       setUsers(data.users);
  //     } catch (error) {}
  //   };
  //   getUsers();
  // }, [sendRequest]);
  return <Fragment>{<FriendList auth={auth} />}</Fragment>;
};

export default Friends;
