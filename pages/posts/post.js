var postData = require("../../data/post-data.js");
Page({
  data: {

  },
  onReady: function() {
    // Do something when page ready. 
    this.setData({
      post_contents:postData.postList
    })
  }
  
})