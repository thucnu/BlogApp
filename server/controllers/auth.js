import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  //check
  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json("Internal Server Error");
    }
    if (data.length) {
      return res.status(409).json("Email or username already exists");
    }

    //insert
    //Hash password

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    if (req.body.username && req.body.email && hash) {
      const q =
        "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
      const values = [req.body.username, req.body.email, hash];

      db.query(q, [values], (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json("Internal Server Error");
        }
        return res.status(200).json("User created");
      });
    }
  });
};
export const login = (req, res) => {
  //check user
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json("Internal Server Error");
    }
    if (data.length === 0) {
      return res.status(401).json("User not found");
    }

    //check password
    const validPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!validPassword) {
      return res.status(400).json("Wrong password");
    }

    //create token
    const token = jwt.sign({ id: data[0].id }, "jwtkey");
    const { password, ...other } = data[0];
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(other);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("Logged out");
};
