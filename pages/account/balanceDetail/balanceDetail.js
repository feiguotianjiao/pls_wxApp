/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//balanceDetail.js
//获取应用实例
let app = getApp()
let sysDpr = app.getSysDpr()
let isTopset = false;
let pageNo = 1
let loadTxt = true
let isSet_bottom_tipStyle = false
let totalPage, bdList, header
Page({
  data: {
    bottom_tipStyle: '',
    toTop_style: 'display:none'
  },
  //页面滑动时对搜索栏的控制
  onPageScroll: function (e) {
    var toTop = e.scrollTop * sysDpr
    if (toTop > 600) {
      if (isTopset == false) {
        isTopset = true
        this.setData({
          toTop_style: 'display:block'
        })
      }
    }
    if (toTop < 600) {
      if (isTopset) {
        isTopset = false
        this.setData({
          toTop_style: 'display:none'
        })
      }
    }
  },
  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  onReachBottom: function (e) {
    var that = this
    if (loadTxt) {
      loadTxt = false
      this.setData({
        bottom_tipStyle: 'transition:height 1s;height:120rpx;'
      })
      setTimeout(function () {
        that.setData({
          bottom_tipStyle: 'transition:height 1s;height:0px;'
        })
        loadTxt = true
      }, 1000)
    }
    if (!isSet_bottom_tipStyle) {
      isSet_bottom_tipStyle = true
      pageNo = pageNo + 1
      if (pageNo > totalPage) {
        wx.showLoading({
          title: '已经加载完毕',
          mask: false
        })
        setTimeout(function () {
          wx.hideLoading()
          isSet_bottom_tipStyle = false
        }, 1000)
      } else {
        wx.showLoading({
          title: '数据加载中',
          mask: false
        })
        wx.request({
          url: 'https://safe.asj.com/pls/appapi/account/detailist.htm',
          data: {
            pageNo: pageNo
          },
          header: header,
          success: function (res) {
            var userData = res.data.data
            bdList = bdList.concat(userData.bdList)
            that.setData({
              bdList: bdList
            })
            isSet_bottom_tipStyle = false
            wx.hideLoading()
          }
        })
      }
    }
  },
  onLoad: function () {
    app.toLoad()
    header = wx.getStorageSync('header')
    var that = this
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/account/detailist.htm',
      data: {
        pageNo: pageNo
      },
      header: header,
      success: function (res) {
        var userData = res.data.data
        var totalPage = userData.totalPage
        bdList = userData.bdList
        //更新数据
        that.setData({
          bdList: bdList
        })
        wx.hideLoading()
      }
    })
  }
})
