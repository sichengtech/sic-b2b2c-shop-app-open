import api from "./api";
import { basePath } from "./../config/config"
import store from "../store/index"
import i18n from "../i18n"


// 下载差量升级包
function downWgt(wgtUrl, version) {
    uni.downloadFile({
        url: wgtUrl,
        success: (res) => {
            console.log(res)
            if (res.statusCode === 200) {
                installWgt(res.tempFilePath, version);
            }
        }
    });
}
// 安装差量升级包
function installWgt(path, version) {
    console.log(plus.runtime.version)
    plus.runtime.install(path, {}, function () {
        store.commit('AppVersion', appVersion)
        plus.runtime.getProperty(plus.runtime.appid,(wgtinfo)=>{
            plus.nativeUI.alert( i18n.t('App已成功升级到XXX版本', { version: version } ),function(){  
                plus.runtime.restart();  
            });
        })
    }, function (e) {
        console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
    });
}

/**
 * 检测更新，每次启动app调用
 */
export const inquiryUpdate = () => {
    plus.runtime.getProperty(plus.runtime.appid,(wgtinfo)=>{
        const appVersion = wgtinfo.version;//应用版本号
   
        //升级检测数据
        let req = {
            appVersion: appVersion,
            systemType: uni.getSystemInfoSync().platform
        };
        store.commit('AppVersion', appVersion)
        api.appVersionCheck(req).then(res => {
            console.log(res)
            if (res.status == 200 && res.data.isUpdate && res.data.newVersion.type == 2) {
                let openUrl = res.data.newVersion.downloadPath //plus.os.name === "iOS" ? res.data.iOS : res.data.Android;
                downWgt(basePath.baseImgUrl + openUrl, res.data.newVersion.version);
            }
        }).catch(err => {
            console.log(err)
        })
    })
}
/**
 * 检测更新，给关于页用
 */
export const deviceUpdate = () => {
    
     //升级检测数据
    let req = {
        appVersion: appVersion,
        systemType: uni.getSystemInfoSync().platform
    };
    return api.appVersionCheck(req)
}

export const downWgtApp = downWgt

