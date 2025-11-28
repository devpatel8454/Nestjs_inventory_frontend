import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getProfile as apiGetProfile, login as apiLogin, register as apiRegister } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState(null);
  const logoutTimerRef = useRef(null);

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const parseJwt = (t) => {
    try {
      const base64Url = t.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  const scheduleExpiryLogout = (t) => {
    clearLogoutTimer();
    const payload = parseJwt(t);
    const expSec = payload?.exp; // seconds since epoch
    if (!expSec) return; // token may not be JWT, skip
    const msUntilExp = expSec * 1000 - Date.now();
    if (msUntilExp <= 0) {
      // already expired
      logout();
      return;
    }
    // Add a small buffer (1s) and schedule
    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, msUntilExp + 1000);
  };

  useEffect(() => {
    let active = true;
    const init = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const { data } = await apiGetProfile();
        if (!active) return;
        setUser(data);
        scheduleExpiryLogout(token);
      } catch (e) {
        if (!active) return;
        console.error('Failed to load profile', e);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        if (active) setLoading(false);
      }
    };
    init();
    return () => { active = false; };
  }, [token]);

  // Listen for global auth-logout event from axios interceptor (401)
  useEffect(() => {
    const onForceLogout = () => {
      clearLogoutTimer();
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth-logout', onForceLogout);
    return () => window.removeEventListener('auth-logout', onForceLogout);
  }, []);

  const login = async (credentials) => {
    setError(null);
    const { data } = await apiLogin(credentials);
    const t = data?.access_token || data?.token || data?.accessToken;
    if (!t) throw new Error('No token returned from server');
    localStorage.setItem('token', t);
    setToken(t);
    // fetch profile after login
    const profileResp = await apiGetProfile();
    setUser(profileResp.data);
    scheduleExpiryLogout(t);
    return profileResp.data;
  };

  const register = async (payload) => {
    setError(null);
    const { data } = await apiRegister(payload);
    // some APIs log you in immediately, others not; support both
    const t = data?.access_token || data?.token || data?.accessToken;
    if (t) {
      localStorage.setItem('token', t);
      setToken(t);
      const profileResp = await apiGetProfile();
      setUser(profileResp.data);
      scheduleExpiryLogout(t);
      return profileResp.data;
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    clearLogoutTimer();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, loading, error, login, register, logout }), [user, token, loading, error]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
