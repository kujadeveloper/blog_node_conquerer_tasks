const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const User = require('../../models/user'); 

exports.register = async (req, res) => {
  const { username, password, repassword, name, lastname, email } = req.body;

  try {
    const existingUser = await User.findOne({ where: {username:username, is_delete:false} });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Username already exists',  message: 'Username already exists'});
    }

    if(password!=repassword){
      return res.status(409).json({ success: false, error: 'Your password does not match', message: 'Your password does not match' });
    }

    const isValid = User.validatePassword(password);
    if (!isValid) {
      return res.status(500).json({ success: false, error: 'Password is not valid', message: 'Password is not valid' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({name:name, 
                        lastname:lastname,
                        username:username, 
                        password: hashedPassword, 
                        email:email})
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error, message:'An error occurred'});
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: {username:username, is_delete:false} });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.generateToken({ userId: user.id });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
