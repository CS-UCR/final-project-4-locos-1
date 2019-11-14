export const SIGNUP = "SIGNUP"
export const LOGIN = "LOGIN"
export const LOGOUT = "LOGOUT"

export const signup = (email, password) => {
  return async dispatch => {
    const response =  await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC5Byo69WNfFYywwOHquvCpUxGJ45xu5UU',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      })
  
  
  
    if (!response.ok) {
      const errorData = await response.json();
      const errorId = errorData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'Email Already Exists!';
      }
      throw new Error(message);
    }
  
    const accountData = await response.json()
    dispatch({ type: SIGNUP, token: accountData.idToken, userId: accountData.localId });
  }
}


export const login = (email, password) => {
  return async dispatch => {
    const response =  await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC5Byo69WNfFYywwOHquvCpUxGJ45xu5UU',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      })

      if (!response.ok) {
        const errorData = await response.json();
        const errorId = errorData.error.message;
        let message = 'Something went wrong!';
        if (errorId === 'EMAIL_NOT_FOUND') {
          message = 'Invalid Email!';
        } 
        else if (errorId === 'INVALID_PASSWORD') {
          message = 'Invalid Password!';
        }
        throw new Error(message);
      }

      const accountData = await response.json()
      dispatch({ type: LOGIN, token: accountData.idToken, userId: accountData.localId });
  }
}

export const logout = () => {
  return {type: LOGOUT};
}