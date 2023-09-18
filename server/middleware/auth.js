import jwt from 'jsonwebtoken';
import config from 'config';

export default function (req, res, next) {
  if (req.method === 'OPTIONS') {
    return next()
  }
  try{
    // console.log('try! block')
    console.log(req.headers)
    const token = req.headers.authorization.split(' ')[1]

    if (!token) { return res.status(401).json({message:'пользователь не авторизован! хихи'}) }

    const decodeData = jwt.verify(token,config.get('secretKey'))
    req.user = decodeData
    next()
  }catch (e){
    console.log(e)
    return res.status(401).json({message:'пользователь не авторизован! хихи'})
  }
}