import decode from 'jwt-decode';
import Cookies from 'js-cookie';
const hostServer = 'https://pure-meadow-61870-2db53a3c769f.herokuapp.com/';

class AuthService {
  getProfile() {
    return decode(this.getToken());
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  loggedIn() {
    const userId = this.getUserId();

    return !!userId;
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return Cookies.get('token');
  }

  // login(idToken, loginStep2VerificationToken = null) {
  //   if (!loginStep2VerificationToken) {
  //     // Login without 2FA
  //     Cookies.set('token', idToken);
  //     window.location.assign('/');
  //   } else {
  //     // Login with 2FA
  //     Cookies.set('login_step2_verification_token', loginStep2VerificationToken);
  //     window.location.assign('/login-step2');
  //   }
  // }
  
  async login(credentials) {
    const response = await fetch(`${hostServer}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });
  
    const data = await response.json();
  
    if (response.ok) {
      // Save token to cookie and return userId and token
      Cookies.set('token', data.token);
      return { userId: data.userId, token: data.token };
    } else {
      // Throw an error if login was unsuccessful
      console.error('Server response:', data);
      throw new Error(data.error);
    }
  }

  loginStep2(twofaToken) {
    const loginStep2VerificationToken = this.getLoginStep2VerificationToken();
    fetch(`${hostServer}/api/auth/loginStep2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        twofaToken,
        loginStep2VerificationToken,
        credentials: 'include',
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to verify login step 2');
        }
      })
      .then((data) => {
        const { token } = data;
        if (token) {
          Cookies.set('token', token);
          window.location.assign('/');
        } else {
          throw new Error('Login Step 2 verification failed');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  getLoginStep2VerificationToken() {
    return Cookies.get('login_step2_verification_token');
  }

  removeLoginStep2VerificationToken() {
    Cookies.remove('login_step2_verification_token');
  }

  logout() {
    localStorage.removeItem('userId');
    Cookies.set('token', null);
    Cookies.remove('login_step2_verification_token');
    window.location.assign('/');
  }
}

const AuthServiceInstance = new AuthService();

export default AuthServiceInstance;
