export const auth = {
  isAuthenticated: () => !!localStorage.getItem("user"),
  isAdmin: () => JSON.parse(localStorage.getItem("user"))?.role === "admin",
  login: (user) => localStorage.setItem("user", JSON.stringify(user)),
  logout: () => localStorage.removeItem("user"),
  getUser: () => JSON.parse(localStorage.getItem("user")),
};