<template>
	<view class="content">
		<view class="api-list">
			<view class="api-item" v-for="(item, index) in apiList" :key="index">
				<view class="title">{{item.name}}</view>
				<uni-easyinput type="text" v-model="item.key" placeholder="Key Token" />
				<uni-easyinput type="text" v-model="item.serect" placeholder="Serect Token" />
				<uni-easyinput type="text" v-model="item.access" 
				placeholder="Access Token" v-if="item.needAccess" />
				<uni-easyinput type="text" v-model="item.model"
				placeholder="模型名称" v-if="item.needModel" />
				<button type="primary" v-if="item.needAccess" 
				@click="handleAccess(index)">获取Access Token</button>
			</view>
		</view>
		<view class="button-box">
			<button type="primary" @click="handleSave">保存全部</button>
		</view>
	</view>
</template>

<script>
	import { accessERNIE } from '@/common/api.ts'
	import { loadAPIs, saveAPIs } from '@/common/config.ts'
		
	export default {
		data() {
			return {
				apiList: [
					{
						name: 'ERNIE',
						key: 'BLj0AD9bUbIF4EV5wbKXcJSz',
						serect: '9Zhw77x4RqdBIoYqOwCednDUpzCLyVvp',
						access: '',
						model: '',
						needAccess: true,
						needModel: false
					},
					{
						name: 'Spark',
						key: '',
						serect: '',
						access: '',
						model: '',
						needAccess: false,
						needModel: true
					}
				]
			}
		},
		
		onShow() {
			let apiList = loadAPIs()
			if (apiList) {
				this.apiList = apiList
			}
		},
		
		methods: {			
			handleSave() {
				saveAPIs(this.apiList)
				uni.showToast({
					title: '保存成功'
				})
			},
			
			handleAccess(index) {
				let api = this.apiList[index]
				if (api['name'] === 'ERNIE') {
					accessERNIE(api['key'], api['serect']).then((res) => {
						api.access = res.access_token
					})
				} else {
					uni.showToast({
						title: "不支持的API",
						icon: null
					})
				}
			},
		}
	}
</script>

<style scoped>
	.content {
		width: 90%;
		padding: 5%;
	}
	
	.title {
		/* center */
		text-align: center;
		font-size: 30rpx;
		font-weight: bold;
		margin: 20rpx;
	}
	
	.button-box {
		margin: 50rpx
	}
	
	button {
		font-size: 30rpx;
	}
</style>