const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const e = require("connect-flash");

const DATABASE_URL =
  "mongodb+srv://admin:admin@influencer-cluster.bcp2q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
function connection() {
  return mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
  });
}
const userSchema = mongoose.Schema({
  fullName: String,
  userName: String,
  password: String,
  plan: String,
  comments: [],
  pinnedPosts: [],
});

const userModel = mongoose.model("user", userSchema);

function saveUser(user) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await userModel.findOne({ userName: user.userName });
      })
      .then(async (userInDB) => {
        if (userInDB) {
          reject("This user alredy exist");
        } else {
          const hashPassword = await bcrypt.hash(user.password, 10);
          user.password = hashPassword;
          const newUser = new userModel(user);
          await newUser.save();
          resolve("regiseration completed successfully");
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

function postLogin(user) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        return await userModel.findOne({ userName: user.userName });
      })
      .then(async (userInDB) => {
        if (!userInDB) {
          reject("This user is not exist");
        } else {
          const checkPassword = await bcrypt.compare(
            user.password,
            userInDB.password
          );
          if (checkPassword) {
            resolve(userInDB);
          } else {
            reject("wrong password ");
          }
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

exports.saveUser = saveUser;
exports.postLogin = postLogin;
