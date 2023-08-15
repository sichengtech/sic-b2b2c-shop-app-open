<template>
  <view class="mpvue-picker">
    <view :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></view>
    <view class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
      <view class="mpvue-picker__hd" catchtouchmove="true">
        <view class="mpvue-picker__action" @click="pickerCancel">{{$t('取消')}}</view>
        <view class="mpvue-picker__action" :style="{color:themeColor}" @click="pickerConfirm">{{$t('设置')}}</view>
      </view>
      <picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerValue" @change="pickerChange">
        <block>
          <picker-view-column>
            <view class="picker-item" v-for="(item,index) in provinceDataList" :key="index">{{item.name}}</view>
          </picker-view-column>
          <picker-view-column>
            <view class="picker-item" v-for="(item,index) in cityDataList" :key="index">{{item.name}}</view>
          </picker-view-column>
          <picker-view-column>
            <view class="picker-item" v-for="(item,index) in areaDataList" :key="index">{{item.name}}</view>
          </picker-view-column>
        </block>
      </picker-view>
    </view>
  </view>
</template>

<script>
// import provinceListData from '../../common/addre/provinceList.js'
// import cityListData from '../../common/addre/cityList.js'
// import areaListData from '../../common/addre/areaList.js'
// import addre from '../../common/addre.json'
export default {
  data() {
    return {
      pickerValue: [0, 0, 0],
      provinceDataList: [],
      cityDataList: [],
      areaDataList: [],
			/* 是否显示控件 */
			showPicker: false,
			
      allData: []
    };
  },
  created() {
    this.init()
  },
  props: {
    /* 默认值 */
    pickerValueDefault: {
      type: Array,
      default(){
				return [0, 0, 0]
			}
    },
		defaultId : {
			type: Array,
			default(){
				return [0,0,0]
			}
		},
    /* 主题色 */
    themeColor: String
  },
	watch:{
		pickerValueDefault(){
			this.init();
		}
	},
  methods: {
		init2() {
				let arr = []
				this.allData.forEach((n, i) => {
					if(this.defaultId[0] == n.id) {
						arr.push(i)
						return false
					}
        });
        
				this.allData[arr[0]].sub.forEach((n, i) => {
          if(this.defaultId[1] == n.id) {
            arr.push(i)
            return false
          }
        })
				this.allData[arr[0]].sub[arr[1]].sub.forEach((n, i) => {
          if(this.defaultId[2] == n.id) {
            arr.push(i)
            return false
          }
        });
        this.provinceDataList = this.allData
        this.cityDataList = this.allData[arr[0]].sub
        this.areaDataList = this.allData[arr[0]].sub[arr[1]].sub
				this.pickerValue = arr
		},
		async init() {
      let data =  await this.$api.areaSelectAll()
      this.allData = data.data[0].sub
			this.provinceDataList = this.allData
			this.cityDataList = this.allData[this.pickerValueDefault[0]].sub
			this.areaDataList = this.allData[this.pickerValueDefault[0]].sub[this.pickerValueDefault[1]].sub;
      this.pickerValue = this.pickerValueDefault;

      if(this.defaultId.length !== 0) this.init2()
		},
    show() {
      setTimeout(() => {
        this.showPicker = true;
      }, 0);
    },
    maskClick() {
      this.pickerCancel();
    },
    pickerCancel() {
      this.showPicker = false;
      this._$emit('onCancel');
    },
    pickerConfirm(e) {
      this.showPicker = false;
      this._$emit('onConfirm');
    },
    showPickerView() {
      this.showPicker = true;
    },
    handPickValueDefault() {
      if (this.pickerValueDefault !== [0, 0, 0]) {
        if (this.pickerValueDefault[0] > this.provinceList.length - 1) {
          this.pickerValueDefault[0] = this.provinceList.length - 1;
        }
        if (this.pickerValueDefault[1] > this.cityList[this.pickerValueDefault[0]].length - 1) {
          this.pickerValueDefault[1] = this.cityList[this.pickerValueDefault[0]].length - 1;
        }
        if (this.pickerValueDefault[2] > this.areaList[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length - 1) {
          this.pickerValueDefault[2] = this.areaList[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length - 1;
        }
      }
    },
    pickerChange(e) {
      let changePickerValue = e.mp.detail.value;
      if (this.pickerValue[0] !== changePickerValue[0]) {
        // 第一级发生滚动
        this.cityDataList = this.allData[changePickerValue[0]].sub;
        this.areaDataList = this.allData[changePickerValue[0]].sub[0].sub;
        changePickerValue[1] = 0;
        changePickerValue[2] = 0;
      } else if (this.pickerValue[1] !== changePickerValue[1]) {
        // 第二级滚动
        this.areaDataList = this.allData[changePickerValue[0]].sub[changePickerValue[1]].sub;
        changePickerValue[2] = 0;
      }
      this.pickerValue = changePickerValue;
      this._$emit('onChange');
    },
    _$emit(emitName) {
      let pickObj = {
        label: this._getLabel(),
        value: this.pickerValue,
        cityCode: this._getCityCode()
      };
      this.$emit(emitName, pickObj);
    },
		// 拼接地址
    _getLabel() {
      let pcikerLabel = [
				this.provinceDataList[this.pickerValue[0]],
				this.cityDataList[this.pickerValue[1]],
				this.areaDataList[this.pickerValue[2]]
			]
      return pcikerLabel;
    },
    _getCityCode() {
      return this.areaDataList[this.pickerValue[2]].parentIds;
    }
  }
};
</script>

<style>
.pickerMask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}
.mpvue-picker-content {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  transform: translateY(100%);
  z-index: 3000;
}
.mpvue-picker-view-show {
  transform: translateY(0);
}
.mpvue-picker__hd {
  display: flex;
  padding: 19upx 30upx;
  background-color: #fff;
  position: relative;
  text-align: center;
  font-size: 34upx;
}
.mpvue-picker__hd:after {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 2upx;
  border-bottom: 2upx solid #e5e5e5;
  color: #e5e5e5;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
}
.mpvue-picker__action {
  display: block;
  flex: 1;
  color: #1aad19;
}
.mpvue-picker__action:first-child {
  text-align: left;
  color: #888;
}
.mpvue-picker__action:last-child {
  text-align: right;
}
.picker-item {
  text-align: center;
  line-height: 80upx;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 32upx;
}
.mpvue-picker-view {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 476upx;
  background-color: rgba(255, 255, 255, 1);
}
</style>
