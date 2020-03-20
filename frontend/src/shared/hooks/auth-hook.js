import { useState, useEffect, useCallback } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [friendStatus, setFriendStatus] = useState({
    friendsList: [],
    receivedFriendRequest: [],
    sentFriendRequest: [],
  });

  const login = useCallback((uid, token, expirationDate, friendDetails) => {
    setToken(token);
    setUserId(uid);
    setFriendStatus(friendDetails);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token,
        expiration: tokenExpirationDate.toISOString(),
        friendStatus: friendDetails,
      }),
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setFriendStatus({
      friendsList: [],
      receivedFriendRequest: [],
      sentFriendRequest: [],
    });

    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration),
        storedData.friendStatus,
      );
    }
  }, [login]);
  return { token, login, logout, userId, friendStatus };
};
