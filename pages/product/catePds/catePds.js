/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//catePds.js
//获取应用实例
var app = getApp();
var sysDpr = app.getSysDpr();
var isTopset = false
var isFixset = false
var pdList = []
var pageNo = 1
var loadTxt = true
var isSet_bottom_tipStyle = false
var isLoad = false
var totalPage, lat, lon, searchValue, cateId, typeId
Page({
  data: {
    changeTop: 64,
    shopNum: 0,
    pdTotalNum: 0,
    toTop_style: 'display:none',
    cateSel: '',
    sortSel: '',
    sel_sortName: '默认排序',
    cate_style: 'display:none;',
    sort_style: 'display:none;'
  },
  changeCate: function (e) {
    var cateSel = this.data.cateSel
    if (cateSel != 'isSel') {
      this.setData({
        cateSel: 'isSel',
        sortSel: '',
        cate_style: 'display:block;',
        sort_style: 'display:none;'
      })
    } else {
      this.setData({
        cateSel: '',
        sortSel: '',
        cate_style: 'display:none;',
        sort_style: 'display:none;'
      })
    }
  },
  changeSort: function (e) {
    var sortSel = this.data.sortSel
    if (sortSel != 'isSel') {
      this.setData({
        cateSel: '',
        sortSel: 'isSel',
        cate_style: 'display:none;',
        sort_style: 'display:block;'
      })
    } else {
      this.setData({
        cateSel: '',
        sortSel: '',
        cate_style: 'display:none;',
        sort_style: 'display:none;'
      })
    }
  },
  selType: function (e) {
    var sel_types = e.currentTarget.dataset.types
    var sel_second = e.currentTarget.dataset.second
    this.setData({
      sel_types: sel_types,
      sel_cateId: sel_second
    })
  },
  toChangeType: function (e) {
    var that = this
    var sel_typeName = e.currentTarget.dataset.typename
    typeId = e.currentTarget.dataset.typeid
    cateId = that.data.sel_cateId
    this.setData({
      cateSel: '',
      cate_style: 'display:none;',
      sel_typeName: sel_typeName
    })
    setTimeout(function () {
      that.toReload()
    }, 500)
  },
  toChangeSort: function (e) {
    var that =this
    var sel_sortName = e.currentTarget.dataset.sortname
    searchValue = e.currentTarget.dataset.searchvalue
    that.setData({
      sortSel: '',
      sort_style: 'display:none;',
      sel_sortName: sel_sortName
    })
    setTimeout(function () {
      that.toReload()
    }, 500)
  },
  //页面滑动时返回顶端按钮出现
  onPageScroll: function (e) {
    var toTop = e.scrollTop * sysDpr;
    if (toTop > 100) {
      if (isTopset == false) {
        isTopset = true
        this.setData({
          toTop_style: 'display:block'
        })
      }
      if (toTop > 64) {
        if (isFixset == false) {
          isFixset = true
          this.setData({
            changeTop: -1
          })
        }
      }
    }
    if (toTop < 100) {
      if (isTopset) {
        isTopset = false
        this.setData({
          toTop_style: 'display:none'
        })
      }
      if (toTop < 64) {
        if (isFixset) {
          isFixset = false
          this.setData({
            changeTop: 64
          })
        }
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
          url: 'https://safe.asj.com/pls/appapi/latlon/soncate/productsForPage.htm',
          data: {
            pageNo: pageNo,
            lat: lat,
            lon: lon,
            cateId: cateId,
            typeId: typeId,
            searchValue: searchValue
          },
          success: function (res) {
            var pdsData = res.data.data
            pdList = pdList.concat(pdsData.pdList)
            that.setData({
              pdList: pdList
            })
            wx.hideLoading()
            isSet_bottom_tipStyle = false
          }
        })
      }
    }
  },
  addCart: function (event) {
    var pdId = parseInt(event.currentTarget.dataset.pdid)
    var shopId = parseInt(event.currentTarget.dataset.shopid)
    var that = this
    app.addCartData(that, shopId, pdId)
  },
  onShow: function () {
    if (isLoad) {
      wx.hideLoading()
    }
    var that = this
    app.getCartCount(that)
  },
  toReload: function () {
    app.toLoad()
    var that = this
    pageNo = 1
    wx.pageScrollTo({
      scrollTop: 0
    })
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/latlon/soncate/productsForPage.htm',
      data: {
        pageNo: pageNo,
        lat: lat,
        lon: lon,
        cateId: cateId,
        typeId: typeId,
        searchValue: searchValue
      },
      success: function (res) {
        var pdsData = res.data.data
        pdList = pdsData.pdList
        that.setData({
          pdList: pdList
        })
        wx.hideLoading()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  },
  onLoad: function (opt) {
    app.toLoad()
    var that = this
    cateId = parseInt(opt.cateId)
    typeId = opt.typeId
    lat = wx.getStorageSync('lat')
    lon = wx.getStorageSync('lon')
    var type_list = wx.getStorageSync('type_list')
    var sel_types, sel_typeName
    for (var i in type_list){
      if (type_list[i].cateId == cateId){
        sel_types = type_list[i].typeList
        if (!typeId) {
          typeId = ''
          sel_typeName = type_list[i].cateName
        } else {
          typeId = parseInt(typeId)
          for (var j in sel_types) {
            if (sel_types[j].typeId == typeId) {
              sel_typeName = sel_types[j].typeName
            }
          }
        }
      }
    }
    pageNo = 1
    searchValue = 0
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/latlon/soncate/productsForPage.htm',
      data: {
        pageNo: pageNo,
        lat: lat,
        lon: lon,
        cateId: cateId,
        typeId: typeId,
        searchValue: searchValue
      },
      success: function (res) {
        var pdsData = res.data.data
        pdList = pdsData.pdList
        var objPage = pdsData.pageMap
        totalPage = objPage.totalPage
        var shopNum = objPage.shopNum
        var pdTotalNum = objPage.pdTotalNum
        that.setData({
          pdList: pdList,
          shopNum: shopNum,
          pdTotalNum: pdTotalNum,
          type_list: type_list,
          sel_cateId: cateId,
          sel_types: sel_types,
          sel_typeName: sel_typeName
        })
        isLoad = true
        wx.hideLoading()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  }
})
