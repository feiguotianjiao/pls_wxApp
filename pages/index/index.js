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
var isTopset = false;
var shopList = []
var pageNo = 1
var loadTxt = true
var isSet_bottom_tipStyle = false
var lat, lon, preAddr
Page({
  data: {
    topSearchStyle: 'display:block;',
    midSearchStyle: 'display:none',
    searchIptStyle: '',
    bottom_tipStyle: '',
    toTop_style: 'display:none'
  },
  //点击事件去扫描处理函数
  toSweep: function () {
    wx.scanCode({
      success: (res) => {
        var barCode = res.result
        wx.navigateTo({
          url: '/pages/product/search/search?barCode=' + barCode
        })
      }
    })
  },
  //点击事件跳转专题页
  toSubject: function (e) {
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },
  //点击进行拨打电话
  showTel: function () {
    wx.showActionSheet({
      itemList: ['拨打：400-6666-520', '拨打：0538-5629999'],
      itemColor: "#382070",
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: '400-6666-520' //仅为示例，并非真实的电话号码
          })
        }
        if (res.tapIndex == 1) {
          wx.makePhoneCall({
            phoneNumber: '0538-5629999' //仅为示例，并非真实的电话号码
          })
        }
      }
    })
  },
  //页面滑动时对搜索栏的控制
  onPageScroll: function (e) {
    var toTop = e.scrollTop * sysDpr;
    var iptWidth = 520 - toTop * 1.2
    if (iptWidth > 0) {
      var styleStr = 'width:' + iptWidth + 'rpx'
      this.setData({
        searchIptStyle: styleStr
      })
    }
    var cPosition = 450
    if (toTop > cPosition) {
      if (isTopset == false) {
        isTopset = true
        this.setData({
          topSearchStyle: 'display:none;',
          midSearchStyle: 'display:block',
          toTop_style: 'display:block'
        })
      }
    }
    if (toTop < cPosition) {
      if (isTopset) {
        isTopset = false
        this.setData({
          topSearchStyle: 'display:block;',
          midSearchStyle: 'display:none',
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
      var totalPage = this.data.pageMap.totalPage
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
          url: 'https://safe.asj.com/pls/appapi/latlon/index_page.htm',
          data: {
            lat: lat,
            lon: lon,
            pageNo: pageNo
          },
          success: function (res) {
            var data = res.data.data
            shopList = shopList.concat(data.shopList)
            that.setData({
              shopList: shopList
            })
            isSet_bottom_tipStyle = false
            wx.hideLoading()
          }
        })
      }
    }
  },
  onShow: function () {
    var load = app.toLoad()
    lat = wx.getStorageSync('lat')
    lon = wx.getStorageSync('lon')
    if (lat == "" || lat == null || lon == "" || lon == null) {
      wx.hideLoading()
      wx.showModal({
        title: '地址设置提示',
        content: '您还未设置的地址，请去设置一个地址',
        confirmText: '设置地址',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/member/setAddress/setAddress'
            })
          }
        }
      })
    } else {
      var hasShop = wx.getStorageSync('hasShop')
      var loadShop = wx.getStorageSync('loadShop')
      if (!hasShop && loadShop) {
        wx.hideLoading()
        wx.showModal({
          title: '地址设置提示',
          content: '您设置的地址，暂时没有开设的店铺，请重新设置一个地址',
          confirmText: '重设地址',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/member/setAddress/setAddress'
              })
            }
          }
        })
        wx.hideLoading()
      } else {
        if (loadShop){
          wx.hideLoading()
        }
      }
    }
  },
  onLoad: function () {
    new app.WeToast()
    var that = this
    lat = wx.getStorageSync('lat')
    lon = wx.getStorageSync('lon')
    if (lat == "" || lat == null || lon == "" || lon == null) {
      wx.hideLoading()
    } else {
      pageNo = 1
      wx.request({
        url: 'https://safe.asj.com/pls/appapi/latlon/index_page.htm',
        data: {
          lat: lat,
          lon: lon,
          pageNo: pageNo
        },
        success: function (res) {
          var data = res.data.data
          shopList = data.shopList
          preAddr = wx.getStorageSync('preAddr')
          if (shopList.length > 0) {
            var swiperImg = data.imageList
            var shopCates = data.shopCateList
            var pageMap = data.pageMap
            var adbList = data.adbList
            var adList = data.adList
            that.setData({
              swiperImg: swiperImg,
              pageMap: pageMap,
              shopCates: shopCates,
              adbList: adbList,
              adList: adList,
              shopList: shopList,
              preAddr: preAddr
            })
            wx.setStorageSync('hasShop', true)
            wx.hideLoading()
          } else {
            wx.setStorageSync('hasShop', false)
            that.setData({
              preAddr: preAddr
            })
            wx.showModal({
              title: '地址设置提示',
              content: '您设置的地址，暂时没有开设的店铺，请重新设置一个地址',
              confirmText: '重设地址',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/member/setAddress/setAddress'
                  })
                }
              }
            })
            wx.hideLoading()
          }
          wx.setStorageSync('loadShop', true)
        }
      })
    }
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  },
  onHide: function () {
    app.toLoad()
  }
})
