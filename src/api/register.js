export async function register(userData) {
  try{
    const response = await fetch('http://localhost:5000/registration', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(userData)
    })
    console.log('fetch registration: ', response)

    return response
  } catch(e) {
    console.log('фетч регистрации - неудача')
  }
}