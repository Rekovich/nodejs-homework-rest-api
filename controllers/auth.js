const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const fs = require("fs/promises");
const path = require("path");

const { ctrlWrapper } = require("../utils");

const { User } = require("../models/user");

const { HttpError } = require("../helpers");

const avatarDir = path.join(__dirname, "../", "public", "avatars")

const {SECRET_KEY} = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already exist");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);


  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User. findOne({email});
    if(!user){
        throw HttpError(401, "Email or password invalid");  // throw HttpError(401, "Email invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password invalid");  // throw HttpError(401, "Password invalid");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token})

    res.json({
        token,
    })
};

const getCurrent = async (req, res) => {
    const {name, email} = req.user;

    res.json({
        name,
        email,
    })
}

const logout = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""})

    res.json({
        message: "Logout success"
    })
}

const updateAvatar = async(req, res) => {
    const {path: tempUpload, filename} = req.file;
    const {_id} = req.user;
    const savename = `${_id}_${filename}`
    const resultUpload = path.join(avatarDir, savename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", savename);
    await User.findByIdAndUpdate(_id, {avatarURL});

    res.json({
        avatarURL,
    })
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
