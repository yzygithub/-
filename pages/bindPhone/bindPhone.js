// pages/bindPhone/bindPhone.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    smsCode: '',
    getCodeMsg:'获取验证码',
    getCodeClass:'get-code',
    border:'none',
    isMobileVali: false,
    isCodeVali: false,
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  mobileBlur: function (e) {
    const mobile = e.detail.value
    if (this.valdtPhone(mobile)) {
      this.setData({
        isMobileVali: true
      })
    } else {
      this.setData({
        isMobileVali: false
      })
    }
  },
  codeInput: function (e) {
    this.setData({
      smsCode: e.detail.value
    })
  },
  codeBlur: function (e) {
    const code = e.detail.value
    if (this.valdtSms(code)) {
      this.setData({
        isCodeVali: true
      })
    } else {
      this.setData({
        isCodeVali: false
      })
    }
  },
  getSmsCode: function (e) {
    let self = this
    setTimeout(function () {
      if (self.data.isMobileVali) {
        const url = app.globalData.baseUrl + '/index.php/api/Sms/sendSms';
        wx.request({
          url: url,
          data: { mobile: self.data.mobile },
          success: res => {
            console.log(res)
            if (res.data.status == 1) {
              wx.showToast({
                title: '短信码已发送',
                icon: 'success',
                duration: 2000
              })
              //  这里要加个倒计时功能
              var timer = 1
              if (timer == 1) {
                timer = 0
                var time = 60
                self.setData({
                  getCodeClass: "cant-get",
                  disabled:true,
                  border:'1px solid #666'
                })
                var inter = setInterval(function () {
                  self.setData({
                    getCodeMsg: time + "s",
                  })
                  time--
                  if (time < 0) {
                    timer = 1
                    clearInterval(inter)
                    self.setData({
                      getCodeClass: "get-code",
                      getCodeMsg: "获取验证码",
                      disabled: false,
                      border: 'none'
                    })
                  }
                }, 1000)
              }
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: '电话号码格式不正确',
          icon: 'none',
          duration: 2000
        })
      }
    }, 100)
  },
  submit: function () {
    let self = this
    setTimeout(function(){
      if (!self.data.isMobileVali) {
        wx.showToast({
          title: '电话号码格式不正确',
          icon: 'none',
          duration: 2000
        })
      } else if (!self.data.isCodeVali) {
        wx.showToast({
          title: '短信码应为4位数字',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            const jscode = res.code
            const url = app.globalData.baseUrl + '/index.php/api/user/smallLogin';
            wx.request({
              url: url,
              data: {
                jscode: jscode,
                mobile: self.data.mobile,
                code: self.data.smsCode
              },
              success: function (res) {
                console.log(res.data)
                //这里应该返回什么，有几种情况
                if (res.data.status == 1) {
                  var token = res.data.result.token
                  app.globalData.token = token
                  wx.showToast({
                    title: '绑定成功',
                    success: function () {
                      wx.redirectTo({
                        url: '../index/index'
                      })
                    }
                  })
                } else {
                  const msg = res.data.msg
                  wx.showToast({
                    title: msg,
                    icon:'none'
                  })
                }
              }
            })
            console.log('login:')
            console.log(res)
          }
        })
      }
    },100)
  },
  /**
  * 验证电话和code格式
  */
  valdtPhone: function (numb) {
    return /^(1[3-9]\d{9})$/.test(numb)
  },
  valdtSms: function (numb) {
    return /^\d{4}$/.test(numb)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

})