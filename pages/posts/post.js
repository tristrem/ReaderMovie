var postData = require("../../data/post-data.js");
Page({
  data: {

  },
  onReady: function () {
    // Do something when page ready. 
    this.setData({
      post_contents: postData.postList
    })
  },
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    //传递postId给post-detail/post-detail页面
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  }
})