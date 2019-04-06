const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  postID: {
    type: String,
    required: true
  },
  categoryID: {
    type: String,
    required: true
  },
  remarks: {
    type: String,
    required: true
  },
 

});
module.exports = Post = mongoose.model("posts", PostSchema);