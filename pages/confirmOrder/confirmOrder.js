// pages/confirmOrder/confirmOrder.js
//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
    totalPrice: 0,
    totalIntegral: 0,
    goodsList: [],
    //因为接口不识别参数数组第一个值，所以加个初始值0，原因不明。
    cartId:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    const url = app.globalData.baseUrl + '/index.php/api/order/orderXdetail'
    wx.request({
      url: url,
      data:{
        token:app.globalData.token,
        order_id:app.globalData.order_id
      },
      success:res=>{
        // console.log(res)
        self.setData({
          goodsList:res.data.result.goods_data
        })
        // console.log(self.data.goodsList)
        // for (let value of self.data.goodsList) {
        //   self.data.count += value.goods_num
        //   self.data.totalPrice += value.shop_price * value.goods_num
        //   self.data.totalIntegral += value.integral * value.goods_num
        //   self.data.cartId.push(value.cart_id)
        // }
        // // console.log(self.data)
        // self.setData({
        //   count:self.data.count,
        //   totalPrice:self.data.totalPrice,
        //   totalIntegral:self.data.totalIntegral,
        // })
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
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  // onUnload: function (options) {
  //   console.log('confirm order unload')
  // //清空购物车
  // //   let self = this
  //   console.log(this.data.cartId)
  //   const url = app.globalData.baseUrl + '/index.php/api/cart/delCart'
  //   wx.request({
  //       url:url,
  //       data:{
  //         ids: this.data.cartId
  //       },
  //       success:res=>{
  //           console.log(res)
  //       }
  //   })
  // },
  payNow: function () {

  }
})