let logoutHandler = null;

export const registerLogoutHandler = (fn) => {
  logoutHandler = fn;
};

export const triggerLogout = () => {
  if (logoutHandler) {
    logoutHandler();
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }
};
