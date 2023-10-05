import { Router } from "express";
import { userModel } from "../dao/models/userModel.js";

const uRouter  = Router()

uRouter.post('/signup',async(req,res)=>{
    const {first_name,last_name, age, password} = req.body
    let {email} = req.body
    email = email.toLowerCase()

    const userExists = await userModel.findOne({email})

    if(userExists){
        return res.send('Ya estas registrado')
    }
    await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password,
    })

    req.session.first_name = first_name
    req.session.last_name = last_name
    req.session.email = email
    req.session.age = age
    req.session.isLogged = true
    
    res.redirect('/products')
})

uRouter.post('/login', async(req,res)=>{
    let login_fail = false
    const {password} = req.body
    let {email} = req.body
    email = email.toLowerCase()
    const userExists = await userModel.findOne({email, password}).lean()

    if(!userExists){
        login_fail=true
        res.redirect('/login?login_fail=true')
    }
    else{
        email === "admincoder@coder.com" ? req.session.admin = true : req.session.admin = false
        req.session.first_name = userExists.first_name
        req.session.last_name = userExists.last_name
        req.session.email = userExists.email
        req.session.age = userExists.age
        req.session.isLogged = true

        res.redirect('/products')
    }
})

uRouter.get('/logout', async (req,res)=>{
    req.session.destroy()
    res.redirect('/login')
})

export default uRouter