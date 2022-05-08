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
  actualDAte: Date,
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
          date: fullDate,
          dateTime: dateTime,
          fullName: commntData.fullName,
          userImage: commntData.userImage,
          actualDAte: date,
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
        const postCommnts = await comment
          .find({
            postId: postId,
          })
          .sort({ actualDAte: -1 });
        resolve(postCommnts);
      })
      .catch((error) => reject(error));
  });
}
// ==========================================

// ======== delete a comment =============
function deleteComment(commentId) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const newCommentId = mongoose.Types.ObjectId(commentId);
        await comment.deleteOne({ _id: newCommentId });
        resolve("comment deleted successfully");
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// ==========================================

// ======== delete all comments of posts ====
function deletePostComments(postId) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const newPostId = mongoose.Types.ObjectId(postId);
        try {
          await comment.deleteMany({ postId: newPostId });
          resolve("all comments comment deleted successfully");
        } catch (error) {
          resolve(error);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// ==========================================

// ======== edit comment ====================
function editComment(commentId, newComment) {
  return new Promise((resolve, reject) => {
    connection()
      .then(async () => {
        const newCommentId = mongoose.Types.ObjectId(commentId);
        await comment.updateOne(
          { _id: newCommentId },
          { $set: { comment: newComment } }
        );
        resolve("comment updated successfully");
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// ==========================================

exports.addNewComment = addNewComment;
exports.getPostCommnts = getPostCommnts;
exports.deleteComment = deleteComment;
exports.deletePostComments = deletePostComments;
exports.editComment = editComment;
