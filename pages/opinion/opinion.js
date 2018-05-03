//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    textVal:'',
    storeId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      storeId: app.globalData.store_id
    })
  },
  textInput:function (e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  submit:function () {
    wx.request({
      url:app.globalData.baseUrl+'/index.php/api/user/postSuggestion',
      data:{
        store_id: this.data.storeId,
        content:this.data.textVal,
        token:app.globalData.token
      },
      success:res=>{
        console.log(res)
        if (res.data.status==1) {
          wx.showToast({
            title: '已经成功提交',
            icon:'success',
            success:()=> {
              setTimeout(function () {
                wx.redirectTo({
                  url: '../index/index'
                })
              },2000)
            }
          })
        }
      }
    })
  }
})