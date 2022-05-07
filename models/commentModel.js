const mongoose = require("mongoose");

const DATABASE_URL =
  "mongodb+srv://admin:admin@influencer-cluster.bcp2q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
function connection() {
  return mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
  });
}
const commentSchema = mongoose.Schema({
  userName: String,
  comment: String,
  postId: String,
  date: String,
  dateTime: String,
  fullName: String,
  userImage: String,
  replies: [],
});

const comment = mongoose.model("comment", commentSchema);

// ======== create a new comment ===========
function addNewComment(commntData) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
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

        var newComment = new comment({
          userName: commntData.userName,
          postId: commntData.id,
          comment: commntData.comment,
          data: fullDate,
          dateTime: dateTime,
          fullName: commntData.fullName,
          userImage: commntData.userImage,
        });
        await newComment.save();
        resolve("comment added successfully");
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// ==========================================

// ======== get comments of post =============
function getPostCommnts(postId) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const postCommnts = await comment.find({
          postId: postId,
        });
        resolve(postCommnts);
      })
      .catch((error) => reject(error));
  });
}
// ==========================================

exports.addNewComment = addNewComment;
exports.getPostCommnts = getPostCommnts;
