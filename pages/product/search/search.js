/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//search.js
//获取应用实例
var app = getApp()
var sysDpr = app.getSysDpr()
var isTopset = false
var pdMapList = []
var hisSearch = []
var pageNo = 1
var searchValue = 0
var loadTxt = true
var isSet_bottom_tipStyle = false
var lat, lon, shopId, query, totalPage
Page({
  data: {
    pdMapList: pdMapList,
    toTop_style: 'display:none'
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
  addCart: function (event) {
    var pdId = parseInt(event.currentTarget.dataset.pdid)
    var shopId = parseInt(event.currentTarget.dataset.shopid)
    var that = this
    app.addCartData(that, shopId, pdId)
  },
  toSearch: function () {
    var that = this
    if (shopId) {
      wx.request({
        url: 'https://safe.asj.com/pls/appapi/latlon/shop/search_pd_page.htm',
        data: {
          searchValue: searchValue,
          query: query,
          shopId: shopId,
          pageNo: pageNo
        },
        success: function (res) {
          var userData = res.data.data
          console.log(res)
          if (pageNo > 1){
            pdMapList = pdMapList.concat(userData.pdMapList)
          }else{
            pdMapList = userData.pdMapList
          }
          if (pdMapList.length > 0) {
            var totalCount = userData.pageMap.totalCount
            totalPage = userData.pageMap.totalPage
            isSet_bottom_tipStyle = false
            that.changeHis()
            that.setData({
              pdMapList: pdMapList,
              totalCount: totalCount,
              resTipStyle: '',
              hisSearch: hisSearch,
              query: query
            })
          } else {
            that.setData({
              pdMapList: pdMapList,
              resTipStyle: 'padding-top:84rpx'
            })
          }
          wx.hideLoading()
        }
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 10000)
    } else {
      wx.request({
        url: 'https://safe.asj.com/pls/appapi/latlon/msproduct/search_page.htm',
        data: {
          searchValue: searchValue,
          query: query,
          lat: lat,
          lon: lon,
          pageNo: pageNo
        },
        success: function (res) {
          var userData = res.data.data
          if (pageNo > 1) {
            pdMapList = pdMapList.concat(userData.pdMapList)
          } else {
            pdMapList = userData.pdMapList
          }
          if (pdMapList.length > 0) {
            var totalCount = userData.pageMap.totalCount
            totalPage = userData.pageMap.totalPage
            isSet_bottom_tipStyle = false
            that.changeHis()
            that.setData({
              pdMapList: pdMapList,
              totalCount: totalCount,
              resTipStyle: '',
              hisSearch: hisSearch,
              query: query
            })
          } else {
            that.setData({
              pdMapList: pdMapList,
              resTipStyle: 'padding-top:84rpx'
            })
          }
          wx.hideLoading()
        }
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 10000)
    }
  },
  changeHis: function () {
    var isSame = false
    for (var ind in hisSearch) {
      if (hisSearch[ind] == query) {
        hisSearch.splice(ind, 1);
        break;
      }
    }
    hisSearch.unshift(query)
    wx.setStorageSync('hisSearch', hisSearch)
  },
  searchToConfirm: function (event) {
    app.toLoad()
    query = event.detail.value
    pageNo = 1
    if (query.length > 0) {
      this.toSearch()
    }else{
      wx.hideLoading()
    }
  },
  wordSearch: function (event) {
    app.toLoad()
    query = event.currentTarget.dataset.word
    pageNo = 1
    this.toSearch()
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
        that.toSearch()
      }
    }
  },
  onShow: function () {
    var that = this
    app.getCartCount(that)
  },
  onLoad: function (opt) {
    var barCode = opt.barCode
    //var barCode = 8000500005026
    hisSearch = wx.getStorageSync('hisSearch')
    if (hisSearch == '' || hisSearch == null) {
      hisSearch = []
    }
    shopId = opt.shopId
    var that = this
    lat = wx.getStorageSync('lat')
    lon = wx.getStorageSync('lon')
    if (barCode) {
      wx.request({
        url: 'https://safe.asj.com/pls/appapi/latlon/msproduct/search_page.htm',
        data: {
          lat: lat,
          lon: lon,
          barCode: barCode
        },
        success: function (res) {
          var userData = res.data.data
          var totalCount = userData.pageMap.totalCount
          pdMapList = userData.pdMapList
          that.setData({
            pdMapList: pdMapList,
            totalCount: totalCount
          })
          wx.hideLoading()
        }
      })
    } else {
      that.setData({
        hisSearch: hisSearch
      })
      wx.hideLoading()
    }
  }
})
