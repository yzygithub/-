// pages/confirmOrder/confirmOrder.js
//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods: {},
    cart: {},
    goods_info:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    try {
      var value = wx.getStorageSync('orderList')
      if (value) {
        // console.log(value)
        self.setData({
          cart:value
        })
        for (let goodsId in self.data.cart.list) {
          // console.log('goodsItem:')
          // console.log(goodsId+':'+self.data.cart.list[goodsId])
          let goodsItem = {}
          goodsItem.goods_id = goodsId;
          goodsItem.goods_num = self.data.cart.list[goodsId]
          self.data.goods_info.push(goodsItem)
        }
        console.log(JSON.stringify(self.data.goods_info))
      }
    } catch (e) {
      // Do something when catch error
      console.log(e)
    }
    self.setData({
      goods: app.globalData.goods
    })
  },

  /**
   * 立即支付
   */
  payNow: function () {
    const url = app.globalData.baseUrl + '/index.php/api/cart/postXOrder'
    wx.request({
        url:url,
        data:{
          goods_info:this.data.goods_info,
          token:app.globalData.token
        },
        success:res=>{
          console.log(res)
        }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('confirm order hide')
  }

})