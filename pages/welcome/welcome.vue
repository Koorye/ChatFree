<template>
	<view class="content">
		<view>本产品完全免费开源，地址<a href='https://github.com/Koorye/chat-free'>Chat Free</a></view>
		<br/>
		<view class="title">请阅读以下用户协议：</view>
		<scroll-view scroll-y="true" class="chat-box" 
		scroll-with-animation="true" :style="{height: scrollHeight + 'px'}">
			<view v-html="agreement" />
		</scroll-view>
		<view class="button-box">
			<button type="primary" @click="handleAgree">同意</button>
			<button type="warn" @click="handleDeny">不同意</button>
		</view>
	</view>
</template>

<script> 
	export default {
		data() {
			return {
				agreement: '',
				scrollHeight: 0
			}
		},
		
		onLoad() {
			uni.request({
				url: '/static/agreement.txt',
				success: (res) => {
					let text = res.data
					// replace \n with <br>
					text = text.replace(/\n/g, '<br>')
					this.agreement = text
				}
			})
			
			uni.getSystemInfo({
				success: (res) => {
					console.log(res)
					this.scrollHeight = res.windowHeight - 200
				}
			})
			
			let agreed = uni.getStorageSync('agreed')
			if (agreed) {
				uni.switchTab({
					url: '/pages/history/history'
				})
			}
		},
		
		methods: {
			handleAgree() {
				uni.switchTab({
					url: '/pages/history/history',
					success: () => {
						uni.setStorageSync('agreed', true)
					}
				})
			},
			
			handleDeny() {
				plus.runtime.quit()
			}
		}
	}
</script>

<style scoped>
	.content {
		padding: 5%;
	}
	
	.title {
		font-weight: bold;
	}
	
	.button-box {
		padding: 20rpx;
		display: flex;
		justify-content: space-around;
	}
</style>