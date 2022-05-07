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
  imagePath: {
    type: String,
    default: "/images/users/default.png",
  },
  savedPosts: [],
});

const userModel = mongoose.model("user", userSchema);

// ========== save new user signup  ==========
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
// ============================================

// ========== login function  =================
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
// ============================================

// ========== save post function ==============
function savePost(userName, postId) {
  return new Promise((resolve, reject) => {
    connection()
      // ========== get array of saved posts =============
      .then(async () => {
        const savedPosts = await userModel.findOne(
          { userName: userName },
          { savedPosts: 1, _id: 0 }
        );
        return savedPosts.savedPosts;
      })

      // ========= push new post to arrry ===============
      .then(async (savedPosts) => {
        const newPostId = mongoose.Types.ObjectId(postId);
        if (savedPosts.includes(newPostId)) {
          reject("This post is already saved");
        } else {
          savedPosts.push(newPostId);
          await userModel.updateOne(
            { userName: userName },
            { $set: { savedPosts: savedPosts } }
          );
          resolve("post saved successfully");
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// ============================================

// ========== get data of user =============
function getUserData(userName) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const userData = await userModel.findOne({ userName: userName });
        resolve(userData);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// ============================================

exports.saveUser = saveUser;
exports.postLogin = postLogin;
exports.savePost = savePost;
exports.getUserData = getUserData;
