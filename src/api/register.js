export async function register(userData) {
  try{
    const response = await fetch('http://localhost:5000/registration', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(userData)
    })
    return response
  } catch(e) {
    return null
  }
}