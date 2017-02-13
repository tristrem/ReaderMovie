var postData_list = require("../../../data/post-data.js");
var app = getApp();
Page({
    data: {
        musicPlay: false
    },
    onLoad: function (option) {
        var postId = option.id;
        // 把postId赋值给data，以便给外部函数调用
        this.data.currentId = postId;
        var postData = postData_list.postList[postId];
        this.setData({
            postData: postData
        })
        // 首先声明变量获取缓存
        var postCollected_list = wx.getStorageSync('post_collected');
        // 判断是缓存是否存在
        if (postCollected_list) {
            // 如缓存存在，更新数据绑定，图标更换为已收藏
            var postCollected = postCollected_list[postId];
            this.setData({
                collected: postCollected
            })
        } else {
            // 如没有缓存，则设置缓存
            postCollected_list = {};
            postCollected_list[postId] = false;
            wx.setStorageSync('post_collected', postCollected_list);
        }
        this.onAudio();        
        if (app.globalData.g_musicPlay&&app.globalData.g_musicCurrentId===postId) {
            this.setData({
                musicPlay: true
            })
        } else {
            this.setData({
                musicPlay: false
            })
        }
    },

    // 监听音乐播放菜单，更新自定义音乐设置
    onAudio: function () {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                musicPlay: true
            })
            app.globalData.g_musicPlay = true;
            app.globalData.g_musicCurrentId = that.data.currentId;
        });
        wx.onBackgroundAudioPause(function () {
            that.setData({
                musicPlay: false
            })
            app.globalData.g_musicPlay = false;
            app.globalData.g_musicCurrentId = null;
        });
    },
    // 绑定收藏图标点击事件
    onCollectTap: function (event) {
        this.getPostCollectedSync();
    },
    // 异步缓存 收藏
    getPostCollectedAsync: function () {
        var that = this;
        wx.getStorage({
            key: "post_collected",
            success: function (res) {
                var postCollected_list = res.data;
                var postCollected = postCollected_list[that.data.currentId];
                postCollected = !postCollected;
                postCollected_list[that.data.currentId] = postCollected;
                that.showToast(postCollected_list, postCollected);
            }
        })
    },

    // 同步缓存 收藏
    getPostCollectedSync: function () {
        var postCollected_list = wx.getStorageSync('post_collected');
        // 通过this.data获取Id值
        var postCollected = postCollected_list[this.data.currentId];
        // 点击收藏图标取反，重新赋值
        postCollected = !postCollected;
        postCollected_list[this.data.currentId] = postCollected;
        this.showToast(postCollected_list, postCollected);
    },

    // 显示消息提示框
    showToast: function (postCollected_list, postCollected) {
        // 更新缓存数据
        wx.setStorageSync('post_collected', postCollected_list);
        // 更新data绑定数据
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? "已收藏" : "取消收藏",
            duration: 1000
        })
    },

    // 显示模态弹窗
    showModal: function (postCollected_list, postCollected) {
        var that = this;
        wx.showModal({
            title: "提示",
            content: postCollected ? "是否确定收藏？" : "是否取消收藏？",
            success: function (res) {
                if (res.confirm) {
                    wx.setStorageSync('post_collected', postCollected_list);
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },

    // 分享图标点击事件， ​显示操作菜单
    onShareTap: function () {
        var itemlist = [
            "分享给QQ好友",
            "分享给微信好友",
            "分享到朋友圈",
            "分享到新浪微博",
            "分享到QQ空间"
        ];
        wx.showActionSheet({
            itemList: itemlist,
            itemColor: "#bed4db",
            success: function (res) {
                wx.showModal({
                    title: "用户" + itemlist[res.tapIndex],
                    content: "用户是否取消" + res.cancel + "现在无法实现分享功能"
                })
            }
        })
    },

    // 自定义背景音乐播放事件
    onMusicTap: function () {
        var data_music = postData_list.postList[this.data.currentId].music;
        var musicPlay = this.data.musicPlay;
        if (!musicPlay) {
            wx.playBackgroundAudio({
                dataUrl: data_music.url,
                title: data_music.title,
                coverImgUrl: data_music.coverImg
            })
            this.setData({
                musicPlay: true
            })
        } else {
            wx.pauseBackgroundAudio()
            this.setData({
                musicPlay: false
            })
        }
    }

})