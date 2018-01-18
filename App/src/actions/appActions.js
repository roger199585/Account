/* action type */
export const TOKEN = 'TOKEN';
export const USERLOGIN = 'USERLOGIN'

/* action creator */
export function setToken(token) {
  return {
    type: TOKEN,
    token
  }
}

export function setLogin(status) {
  return {
    type: USERLOGIN,
    status
  }
}
