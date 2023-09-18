import {Router} from 'express'
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';

import User from '../db/models/User.js'

export const router = Router()

router.post('/registration',
  [
    check('email','Некорректный e-mail').isEmail(),
    check('password','Пароль должен содержать не менее 3-х символов, но не более 12-ти символов').isLength({min:3,max:12})
  ],
  async (req, res)=>{
    console.log('registration endpoint')
    console.log('request: ', req.body)

    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:'Некорректные данные при регистрации', errors:errors.array()})
      }

      const {email, password, name} = req.body
      const candidate = await User.findOne({email})
      if (candidate){
        return res.status(400).json({message:`Пользователь с e-mail (${email}) уже существует.`})
      }
      const hashPassword = await bcrypt.hash(password, 7)

      const user = new User({email, password:hashPassword, name})
      await user.save()

      return res.status(200).json({message:'Пользователь создан.'})
    }catch (e){
      console.log(e)
      res.send({message: 'Server error... sad...'})
    }
  }
)
router.post('/login', async(req, res)=>{
  try{
    const {email, password} = req.body
    const user = await User.findOne({email})

    if(!user){
      return res.status(404).json({message:'Пользователь с таким e-mail не найден'})
    }

    const isPasswordValid = bcrypt.compareSync(password,user.password)
    if(!isPasswordValid){
      return res.status(400).json({message:'Неверный пароль.'})
    }

    const token = jwt.sign({id: user.id, roles: user.roles}, config.get('secretKey'),{expiresIn: '12h'})
console.log(token)
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
      message: 'Вход в аккаунт - успешно!'
    })
  }catch (e){
    console.log(e)
    res.send({message: 'Server error... sad...'})
  }
})
