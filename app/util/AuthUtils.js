/**
 * a util function that checks if the saved token is valid
 * @returns boolean indicating if the token is still valid
 */
export function isAuthTokenValid() {
  if (localStorage.getItem('jwtToken')) {
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
  
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('jwtToken');
      return false;
    } else {
      return true;
    }
  }
  return false;
}
