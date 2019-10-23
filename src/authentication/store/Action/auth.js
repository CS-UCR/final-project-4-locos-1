export const SIGNUP = "SIGNUP"
export const LOGIN = "LOGIN"

export const signup = (email, password) => {
  fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC5Byo69WNfFYywwOHquvCpUxGJ45xu5UU',
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
    .then((response) => response.json())
    .then((res => {
      console.log(res)
    }
    ))
    .done()
}


export const login = (email, password) => {
  console.log("Email before setup: ", email)
  console.log("Password before setup: ", password)

  fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC5Byo69WNfFYywwOHquvCpUxGJ45xu5UU',
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
    .then((response) => response.json())
    .then((res => {
      console.log(res)
    }
    ))
    .done()
} 