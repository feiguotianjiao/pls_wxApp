/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//index.js
//获取应用实例
var app = getApp(); 
var sysDpr = app.getSysDpr()
var isTopset = false
var couponList = []
var pageNo = 1
var loadTxt = true
var isSet_bottom_tipStyle = false
var header, totalPage
Page({
  data: {
    couponShow: 'display:none;'
  },
  //页面滑动时返回顶端按钮出现
  onPageScroll: function (e) {
    var toTop = e.scrollTop * sysDpr;
    if (toTop > 900) {
      if (isTopset == false) {
        isTopset = true
        this.setData({
          toTop_style: 'display:block'
        })
      }
    }
    if (toTop < 900) {
      if (isTopset) {
        isTopset = false
        this.setData({
          toTop_style: 'display:none'
        })
      }
    }
  },
  toTop: function (e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  onReachBottom: function () {
    var that = this
    if (loadTxt) {
      loadTxt = false
      that.setData({
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
        app.toLoad()
        wx.request({
          url: 'https://safe.asj.com/pls/appapi/coupon/list.htm',
          data: {
            selectType: 0,
            pageNo: pageNo
          },
          header: header,
          success: function (res) {
            var theList = res.data.data
            if (theList.length > 19){
              for (var id in theList) {
                theList[id].beginDate = theList[id].beginDate.split(" ")[0]
                theList[id].endDate = theList[id].endDate.split(" ")[0]
              }
              couponList = couponList.concat(theList)
              that.setData({
                couponList: couponList
              })
            }else{
              totalPage = pageNo
            }
            wx.hideLoading()
            isSet_bottom_tipStyle = false
          }
        })
      }
    }
  },
  toAddCoupon: function (e) {
    var that = this
    wx.downloadFile({
      url: 'https://pls.asj.com/MyImageServlet',
      header: header,
      success: function (res) {
        var imgUrl = res.tempFilePath
        that.setData({
          couponShow: 'display:block;',
          codeImg: imgUrl
        })
      }
    })
  },
  changeIptVal: function (e) {
    var iptVal = e.detail.value
    var iptKey = e.currentTarget.dataset.ipt
    if (iptKey == 'couponNo') {
      this.setData({
        couponNo: iptVal
      })
    } else if (iptKey == 'couponCode') {
      this.setData({
        couponCode: iptVal
      })
    }
    
  },
  bindCoupon: function (e) {
    wx.showLoading({
      title: '正在绑定中',
      mask: true
    })
    var that = this
    var couponNo = that.data.couponNo
    var couponCode = that.data.couponCode
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/coupon/bindingcoupon.htm',
      data: {
        couponNo: couponNo,
        couponCode: couponCode
      },
      header: header,
      success: function (res) {
        wx.hideLoading()
        var reInfo = res.data.errorInfo
        var reNo = res.data.errorNo
        if (reNo == "-1"){
          that.wetoast.toast({
            title: reInfo,
            duration: 2000
          })
          that.setData({
            couponCode: ''
          })
          that.toAddCoupon()
        } else if (reNo == "0"){
          that.setData({
            couponShow: 'display:none;',
            couponNo: '',
            couponCode: ''
          })
          that.onLoad()
        }
      }
    })
  },
  cancelBindCounpon: function (e) {
    this.setData({
      couponShow: 'display:none;',
      couponNo: '',
      couponCode: ''
    })
  },
  changeCodeImg: function (e) {
    var that = this
    wx.downloadFile({
      url: 'https://pls.asj.com/MyImageServlet',
      header: header,
      success: function (res) {
        var imgUrl = res.tempFilePath
        that.setData({
          codeImg: imgUrl,
          couponCode: ''
        })
      }
    })
  },
  onLoad: function () {
    app.toLoad()
    new app.WeToast()
    var that = this
    pageNo = 1
    header = wx.getStorageSync('header')
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/coupon/list.htm',
      data: {
        selectType: 0,
        pageNo: pageNo
      },
      header: header,
      success: function (res) {
        couponList = res.data.data
        for (var id in couponList){
          couponList[id].beginDate = couponList[id].beginDate.split(" ")[0]
          couponList[id].endDate = couponList[id].endDate.split(" ")[0]
        }
        that.setData({
          couponList: couponList
        })
        wx.hideLoading()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  }
})
