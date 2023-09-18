import VueCookies from 'vue-cookies'

const TOKEN_KEY = 'auth_token';

export function setAuthTokenToCookies(token) {
  VueCookies.set(TOKEN_KEY, token)
}
export function getAuthTokenFromCookies(token) {
  return VueCookies.get(TOKEN_KEY, token)
}
export function removeAuthTokenFromCookies() {
  VueCookies.remove(TOKEN_KEY)
}

export function isAuthenticated() {
  const token = getAuthTokenFromCookies();

  return !(!token || token === 'null');
}

export async function login(userData) {
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(userData)
    })
    console.log('fetch login: ', response)
    return response
  } catch(e) {
    console.log('не получился логин')
  }
}