const mongoose = require("mongoose");
const userModel = require("./userModel");
const commentModel = require("./commentModel");
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
  userImage: String,
  fullName: String,
  actualDAte: Date,
  commentsNum: { type: Number, default: 0 },
});

const post = mongoose.model("post", postSchema);

// ================ get all posts to home page ===============
function getAllPosts() {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const allPosts = await post.find({}).sort({ actualDAte: -1 });
        resolve(allPosts);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// ===========================================================

// ========== create new post admin and user ====================
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
            userImage: postData.userImage,
            fullName: postData.fullName,
            date: fullDate,
            dateTime: dateTime,
            actualDAte: date,
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

// ======== delete post data and all comments on post ===========
function deletePost(postId) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const posttId = mongoose.Types.ObjectId(postId);
        await post.deleteOne({ _id: posttId });
        resolve("Post deleted successfully");
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// ===========================================================

// ======== get post data and all comments on post ===========
function getPostData(postData) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const postId = mongoose.Types.ObjectId(postData.id);
        const postInDB = await post.findOne({ _id: postId });
        return postInDB;
      })
      .then(async (postInDB) => {
        const comments = await commentModel.getPostCommnts(postInDB.id);
        postInDB.comments = comments;
        resolve(postInDB);
      })
      .catch((error) => reject(error));
  });
}
// ===========================================================

// ======== get saved posts to user ==========================
function getSavedPosts(savedPosts) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const posts = await post.find({ _id: { $in: savedPosts } });
        resolve(posts);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// ===========================================================

// ======== edit post ========================================
function editPost(postId, newPost) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const newPostId = mongoose.Types.ObjectId(postId);
        await post.updateOne({ _id: newPostId }, { $set: { title: newPost } });
        resolve("post updated successfully");
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// ===========================================================

// ====== update userImage and name of post ==================
function updatePostsOfUser(userName, fullName, userImage) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        await post.updateMany(
          { userName: userName },
          { $set: { fullName: fullName, userImage: userImage } }
        );
        resolve("post updated successfully");
      })
      .catch((error) => reject(error));
  });
}
// ===========================================================

// =============== get all posts of users =======================
function getUserPosts(userName) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const userPosts = await post
          .find({ userName: userName })
          .sort({ actualDAte: -1 });
        resolve(userPosts);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
// ===========================================================

// ========== count of users =================================
function contOfPost() {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        await post.aggregate(
          [
            {
              $group: {
                _id: 0,
                contOfPost: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                contOfPost: 1,
              },
            },
          ],
          async function (error, result) {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// ===========================================================

// ============ updata count of comments =====================
function updateComments(postId) {
  return new Promise((resolve, reject) => {
    const newPostId = mongoose.Types.ObjectId(postId);
    connection()
      .then(async () => {
        const comments = await post.findOne(
          { _id: newPostId },
          { _id: 0, commentsNum: 1 }
        );
        return comments.commentsNum;
      })
      .then(async (oldComments) => {
        const newComments = oldComments + 1;
        await post.updateOne(
          { _id: newPostId },
          { $set: { commentsNum: newComments } }
        );
        resolve("number of comments updated successfully");
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// ===========================================================

// ============ get the post with the most comments ==========
function getLargePost() {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const largePost = await post.find().sort({ commentsNum: -1 }).limit(1);
        resolve(largePost[0].id);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
// ===========================================================

// =============== get all ID of posts of users ==============
function getUserPostsId(userName) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const userPosts = await post.find({ userName: userName }, { _id: 1 });
        resolve(userPosts);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
// ===========================================================
// ======== delete post data and all comments on post ===========
function deleteUserPosts(userName) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        await post.deleteMany({ userName: userName });
        resolve("Posts deleted successfully");
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// ===========================================================

exports.addPost = addPost;
exports.getAllPosts = getAllPosts;
exports.getPostData = getPostData;
exports.deletePost = deletePost;
exports.getSavedPosts = getSavedPosts;
exports.editPost = editPost;
exports.updatePostsOfUser = updatePostsOfUser;
exports.getUserPosts = getUserPosts;
exports.contOfPost = contOfPost;
exports.updateComments = updateComments;
exports.getLargePost = getLargePost;
exports.getUserPostsId = getUserPostsId;
exports.deleteUserPosts = deleteUserPosts;
