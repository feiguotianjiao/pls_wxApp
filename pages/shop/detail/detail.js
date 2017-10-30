/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//detail.js
//获取应用实例
var shopCart = require('../../common/shopCart/common.js');
var app = getApp();
var sysDpr = app.getSysDpr();
var isTopset = false;
var wHeight;
var itemCount = 7;
var pdList = []
var pageNo = 1
var loadTxt = true
var isSet_bottom_tipStyle = false
var cateId, typeId, shopId, shopPage, totalPage
Page({
  data: {
    cateList:[],
    btnsStyle: '',
    pdsStyle: '',
    toTop_style: 'display:none',
    topNum: 0,
    isShow: false
  },
  select_cate: function (e) {
    var load = app.toLoad()
    var that = this
    cateId = e.currentTarget.dataset.cate
    var typelist = e.currentTarget.dataset.type
    typeId = typelist[0].typeId
    pageNo = 1
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/shop/pdlist.htm',
      data: {
        shopId: shopId,
        cateId: cateId,
        typeId: typeId,
        pageNo: pageNo
      },
      success: function (resB) {
        var pageData = resB.data.data.pdpage
        pdList = pageData.data
        totalPage = pageData.totalPage
        that.setData({
          cateId: cateId,
          typelist: typelist,
          typeId: typeId,
          pdList: pdList
        })
        wx.hideLoading()
      }
    })
  },
  select_type: function (e) {
    var load = app.toLoad()
    var that = this
    typeId = e.currentTarget.dataset.type
    pageNo = 1
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/shop/pdlist.htm',
      data: {
        shopId: shopId,
        cateId: cateId,
        typeId: typeId,
        pageNo: pageNo
      },
      success: function (resB) {
        var pageData = resB.data.data.pdpage
        pdList = pageData.data
        totalPage = pageData.totalPage
        that.setData({
          typeId: typeId,
          pdList: pdList
        })
        wx.hideLoading()
      }
    })
  },
  //页面滑动时对分类按钮的控制
  pageScroll: function (e) {
    var toTop = e.detail.scrollTop * sysDpr
    if (toTop > 206) {
      if (isTopset == false) {
        isTopset = true
        this.setData({
          pdsStyle: 'padding-top:152rpx;',
          btnsStyle: 'position:fixed;top:0;left:0;',
          toTop_style: 'display:block'
        })
      }
    }
    if (toTop < 206) {
      if (isTopset) {
        isTopset = false
        this.setData({
          pdsStyle: '',
          btnsStyle: '',
          toTop_style: 'display:none'
        })
      }
    }
  },
  toTop: function (e) {
    this.setData({
      topNum: 0
    })
  },
  addCart: function (event) {
    var that = this
    var pdId = event.currentTarget.dataset.pdid
    app.addCartData(that, shopId, pdId)
  },
  toWriteOrder: function () {
    app.toWriteOrder(shopId)
  },
  clearCart: function (e) {
    var that = this
    wx.showModal({
      title: '购物车提示',
      content: '确定删除购物车中的所有商品？',
      confirmText: '确定删除',
      success: function (res) {
        if (res.confirm) {
          var statusName = 'clearCart'
          var pdId = 0
          that.setData({
            cartTip_top: '',
            cartContent_top: '',
            cartItems_style: '',
            cartMes_left: '',
            mask_style: '',
            isShow: false
          })
          shopCart.changeStatus(shopId, statusName, pdId)
          shopCart.cartInit(that, shopId)
        }
      }
    })
  },
  cancelAllSel: function (event) {
    var that = this
    var statusName = 'cancelAllSel'
    var pdId = 0
    shopCart.changeStatus(shopId, statusName, pdId)
    shopCart.cartInit(that, shopId)
  },
  changeAllSel: function (event) {
    var that = this
    var statusName = 'changeAllSel'
    var pdId = 0
    shopCart.changeStatus(shopId, statusName, pdId)
    shopCart.cartInit(that, shopId)
  },
  cancelSel: function (event) {
    var that = this
    var statusName = 'cancelSel'
    var pdId = event.currentTarget.dataset.pdid
    shopCart.changeStatus(shopId, statusName, pdId)
    shopCart.cartInit(that, shopId)
  },
  changeSel: function (event) {
    var that = this
    var statusName = 'changeSel'
    var pdId = event.currentTarget.dataset.pdid
    shopCart.changeStatus(shopId, statusName, pdId)
    shopCart.cartInit(that, shopId)
  },
  addCount: function (event) {
    var that = this
    var statusName = 'addCount'
    var pdId = event.currentTarget.dataset.pdid
    shopCart.changeStatus(shopId, statusName, pdId)
    shopCart.cartInit(that, shopId)
  },
  reduceCount: function (event) {
    var that = this
    var statusName = 'reduceCount'
    var pdId = event.currentTarget.dataset.pdid
    shopCart.changeStatus(shopId, statusName, pdId)
    shopCart.cartInit(that, shopId)
    var itemCount = that.data.itemCount
    if (itemCount > 0) {
      var isShow = false
      shopCart.changePos(that, isShow, itemCount, wHeight)
    } else {
      var isShow = true
      shopCart.changePos(that, isShow, itemCount, wHeight)
    }
  },
  showSwich: function () {
    var that = this
    var isShow = that.data.isShow
    var itemCount = that.data.itemCount
    shopCart.changePos(that, isShow, itemCount, wHeight)
  },
  onShow: function (e) {
    var load = app.toLoad()
    var cateList = this.data.cateList
    if (cateList.length > 0){
      wx.hideLoading()
    }
  },
  scrollToLower: function () {
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
        wx.showLoading({
          title: '数据加载中',
          mask: false
        })
        wx.request({
          url: 'https://safe.asj.com/pls/appapi/shop/pdlist.htm',
          data: {
            shopId: shopId,
            cateId: cateId,
            typeId: typeId,
            pageNo: pageNo
          },
          success: function (resB) {
            var pageData = resB.data.data.pdpage
            pdList = pdList.concat(pageData.data)
            that.setData({
              pdList: pdList
            })
            isSet_bottom_tipStyle = false
            wx.hideLoading()
          }
        })
      }
    }
  },
  onLoad: function (opt) {
    shopId = opt.shopId
    var that = this
    shopCart.cartInit(that, shopId)
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/shop/shopinit.htm',
      data: {
        shopId: shopId
      },
      success: function (res) {
        var data = res.data.data
        var shopDetail = data.shop
        var cateList = data.cateList
        cateId = data.cateList[0].cateId
        var typelist = data.cateList[0].typelist
        typeId = data.cateList[0].typelist[0].typeId
        wx.request({
          url: 'https://safe.asj.com/pls/appapi/shop/pdlist.htm',
          data: {
            shopId: shopId,
            cateId: cateId,
            typeId: typeId,
            pageNo: pageNo
          },
          success: function (resB) {
            var pageData = resB.data.data.pdpage
            pdList = pageData.data
            totalPage = pageData.totalPage
            that.setData({
              shopId: shopId,
              shopDetail: shopDetail,
              cateList: cateList,
              cateId: cateId,
              typelist: typelist,
              typeId: typeId,
              pdList: pdList
            })
            wx.hideLoading()
          }
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        wHeight = res.windowHeight * sysDpr;
      }
    })
    var cartShow = parseInt(opt.cartShow)
    if (cartShow == 1) {
      var isShow = false
      var itemCount = that.data.itemCount
      shopCart.changePos(that, isShow, itemCount, wHeight)
    }
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  },
  onHide: function () {
    app.toLoad()
  }
})
