<script>
import pagePath from "./config/pagePath";
import i18n from './i18n';

   //#ifdef APP-PLUS
import { inquiryUpdate } from "common/versionUpdate"
   //#endif

export default {
  onLaunch: function() {
    console.log("App Launch");

    //#ifdef APP-PLUS
      // plus.webview.currentWebview().setStyle({  
      //   scrollIndicator: 'none',  
      // });  
    // 检查更新
    inquiryUpdate()
    /* 5+环境锁定屏幕方向 */
    plus.screen.lockOrientation("portrait-primary"); //锁定

    const _handlePush = message => {
      console.log("_handlePush", message.go_url);

      let urlObj = {
        memberOrdersReceive: pagePath.uOrderList + "?order=0", // 收货通知  进入订单列表页面
        memberOrdersSend: pagePath.uOrderList + "?order=0", // 发货通知  进入订单列表页面
        memberCancelOrder: pagePath.uOrderList + "?order=0", // 取消订单通知  进入订单列表页面
        memberOrdersCommentReply: pagePath.uCommentList, // 评价回复通知  进入评价列表页面
        memberOrdersModifyFreight: pagePath.uOrderList + "?order=0" // 修改运费通知  进入订单列表页面
      };
      uni.navigateTo({
        url: urlObj[message.go_url] || pagePath.uIndex
      });
    };
    let messageList = [];
    plus.push.addEventListener("click", message => {
      console.log(message, "push click");
      let activeMsgData = null;
      messageList.forEach((item, index) => {
        if (item.title === message.title) {
          activeMsgData = item;
          messageList.splice(index, 1);
        }
      });
      _handlePush(activeMsgData);
    });
    plus.push.addEventListener("receive", message => {
      console.log(message, "receive");
      let data = JSON.parse(message.content);
      messageList.push(data);
      plus.push.createMessage(data.text, null, data);
    });

    //#endif
    let arr = ['首页', '分类', '购物车', '个人中心']
    arr.forEach((n, i) => {
      uni.setTabBarItem({
        index: i,
        text: i18n.t(n),
        //iconPath: '/path/to/iconPath',
        //selectedIconPath: '/path/to/selectedIconPath'
      })
    })
    
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
</script>
<style>
@import "./static/iconfont/iconfont.css"; /* 字体文件不能使用本地文件 */
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import "./common/uni.css";

/* 以下样式用于 hello uni-app 演示所需 */
[v-clock] {
  display: none;
}
image {
  width: 100%;
  height: 100%;
  /* 防止图片闪动 */
  will-change: transform;
}
/* uni-page-body {
  overflow-y: auto;
} */
page {
  background-color: #fff;
  height: calc(100% - 44px - var(--status-bar-height));
  font-size: 28upx;
  line-height: 1.8;
}
.uni-header-logo {
  padding: 30upx;
  text-align: center;
  margin-top: 10upx;
}
.uni-header-logo image {
  width: 140upx;
  height: 140upx;
}
.uni-hello-text {
  color: #7a7e83;
}
.uni-hello-addfile {
  text-align: center;
  line-height: 300upx;
  background: #fff;
  padding: 50upx;
  margin-top: 10px;
  font-size: 38upx;
  color: #808080;
}
.bg-fff {
  background: #fff;
}
/* 购物车,注册覆盖复选框样式  只能覆盖h5页面 */
.uni-list-cell-b .uni-checkbox-input,
.register .uni-checkbox-input {
  border-radius: 50% !important;
}
.uni-list-cell-b uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked,
.register .uni-checkbox-input.uni-checkbox-input-checked {
  background: red;
  color: #fff !important;
  border-color: red;
}
.icon-success-copy1,
.icon-success {
  font-size: 40upx;
  margin-right: 10upx;
}
.icon-success {
  color: red;
}

.no-msg {
  /* 暂无数据是使用的class */
  /* display: flex;
		align-items:center; */
  text-align: center;
  margin-top: 200upx;
}

/* 导航栏样式 */
.city {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-left: 16upx;
}
.input-view {
  display: flex;
  /* background-color: #e7e7e7; */
  height: 60upx;
  /* border-radius: 30upx; */
  padding: 0 4%;
  flex-wrap: nowrap;
  margin: 14upx 0;
  line-height: 60upx;
  align-items: center;
/* #ifndef MP-WEIXIN */
  justify-content: center;
/* #endif */

  font-size: 30upx;
  color: #333333;
  font-weight: 700;
}

.title {
  font-size: 30upx;
  line-height: 40upx;
  color: #333333;
  padding: 60upx;
}

/* 返回按钮 */
.back {
  background-image: url("~@/static/zhouWei-navBar/back-1.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: auto 55%;
  width: 56upx;
  height: 56upx;
}
.home {
  background-image: url("~@/static/zhouWei-navBar/home-1.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: auto 55%;
  width: 56upx;
  height: 56upx;
}
	.highLight {
    color: #ec0030;
    font-style: normal;
	}
/* 店铺打标 */
  .store_type {
    background: red;
    padding: 2upx 8upx;
    color: #fff;
    border-radius: 8upx;
    font-size: 20upx;
    margin: 0 8upx;
    line-height: 30upx;
    height: 30upx;
  }

/* 店铺详情文章 */
  .rich  table {
    width: 100%!important;
  }
  .rich  img {
    width: 100%!important;
  }



  /* 修改uni弹层的文字排版 */
  uni-modal .uni-modal__bd, uni-modal .uni-modal__title {
    word-break: inherit;
  }

  /* 滚动条隐藏 */
  ::webkit-scrollbar { 
   display: none;
}
</style>