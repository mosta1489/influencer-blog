const mongoose = require("mongoose");
const fs = require("fs");

const DATABASE_URL =
  "mongodb+srv://admin:admin@influencer-cluster.bcp2q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
function connection() {
  return mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
  });
}
const postSchema = mongoose.Schema({
  userName: String,
  title: String,
  imagePath: String,
  date: String,
  dateTime: String,
});

const post = mongoose.model("post", postSchema);

// ================ get all posts to home page ===============
function getAllPosts() {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const allPosts = await post.find({});
        resolve(allPosts);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// ===========================================================

// ========== add new post admin and user ====================
function addPost(postData, image) {
  return new Promise((resolve, reject) => {
    connection()
      // ======= theck if premium user has mor than 3 posts ========
      .then(async () => {
        if (postData.userName !== "admin") {
          const userPosts = await post.find(
            { userName: postData.userName },
            { _id: 1 }
          );
          if (userPosts.length >= 3) {
            reject("You can only post 3 posts");

            return false;
          } else return true;
        } else return true;
      })
      // ==========================================================
      .then(async (savePost) => {
        if (savePost) {
          // ========= get date and time =========
          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          const date = new Date();
          const fullDate = ` ${
            monthNames[date.getMonth()]
          } ${date.getDate()}, ${date.getFullYear()}`;
          const dateTime = ` ${date.getHours()}:${date.getMinutes()}`;
          // ======================================
          const newPost = new post({
            userName: postData.userName,
            title: postData.title,
            date: fullDate,
            dateTime: dateTime,
          });
          // ========= save image in files =========
          if (image) {
            const imagenameList = image.name.split(".");
            const imageType = imagenameList[imagenameList.length - 1];
            const imageName = `${newPost.id}.${imageType}`;
            const fullPath = `./public/images/posts/${imageName}`;
            const imagePath = `/images/posts/${imageName}`;
            fs.writeFileSync(fullPath, image.data);
            newPost.imagePath = imagePath;
          }
          // =======================================
          await newPost.save();
          resolve("Post creatd successfully");
        }
      })
      // ==========================================================
      .catch((err) => {
        reject(err);
      });
  });
}
// ===========================================================

exports.addPost = addPost;
exports.getAllPosts = getAllPosts;
