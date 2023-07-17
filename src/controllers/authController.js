const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const response = require('../utils/response');
const User = require('../../models/user'); 

exports.register = async (req, res) => {
  const { password, repassword, fullname, email } = req.body;

  try {
    const existingUser = await User.findOne({ where: {email:email, is_delete:false} });
    if (existingUser) {
      return res.status(409).json(response.error('Username already exists'));
    }

    if(password!=repassword){
      return res.status(409).json(response.error('Your password does not match'));
    }

    const isValid = User.validatePassword(password);
    if (!isValid) {
      return res.status(409).json(response.error('Password is not valid'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({fullname:fullname, 
                        password: hashedPassword, 
                        email:email})
    res.status(201).json(response.success('User registered successfully'));
  } catch (error) {
    res.status(500).json(response.error(error.message));
  }
};


exports.update = async (req, res) => {
  const { fullname, birtdate, username} = req.body;
  const { userId } = req;

  try {
    const is_user = await User.findOne({ where: {id:userId, is_delete:false} });
    if (!is_user) {
      return res.status(401).json(response.error('invalid user'));
    }

    const resp = await is_user.update({fullname:fullname, birtdate:birtdate, fullname:username})
    res.status(200).json(response.success('ok',resp));
  } catch (error) {
    console.error(error);
    res.status(500).json(response.error('An error occurred'));
  }
};


exports.updatePass = async (req, res) => {
  const { password, repassword} = req.body;
  const { userId } = req;

  try {

    if(password!=repassword){
      return res.status(409).json(response.error('Your password does not match'));
    }

    const isValid = User.validatePassword(password);
    if (!isValid) {
      return res.status(409).json(response.error('Password is not valid'));
    }

    const is_user = await User.findOne({ where: {id:userId, is_delete:false} });
    if (!is_user) {
      return res.status(401).json(response.error('invalid user'));
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const resp = await is_user.update({password: hashedPassword})
    res.status(200).json(response.success('ok',resp));
  } catch (error) {
    console.error(error);
    res.status(500).json(response.error('An error occurred'));
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const is_user = await User.findOne({ where: {email:email, is_delete:false} });
    if (!is_user) {
      return res.status(401).json(response.error('Invalid username or password'));
    }

    const passwordMatch = await bcrypt.compare(password, is_user.password);
    if (!passwordMatch) {
      return res.status(401).json(response.error('Invalid username or password'));
    }
    const token = jwt.generateToken({id:is_user.id, email:is_user.email, fullname: is_user.fullname});

    res.status(200).json(response.success('ok',{token: token}));
  } catch (error) {
    console.error(error);
    res.status(500).json(response.error('An error occurred'));
  }
};
