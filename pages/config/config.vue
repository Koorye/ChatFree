<template>
	<view class="content">
		<uni-list>
			<uni-list-item title="使用说明" clickable @click="handleHelp" />
			<uni-list-item title="查看用户协议" clickable @click="handleShowAgreement" />
		</uni-list>
		<view class="foot">Chat Free ©2024. Designed by Koorye, all rights reserved.</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				agreement: '',
			}
		},
		
		onLoad() {
			uni.request({
				url: '/static/agreement.txt',
				success: (res) => {
					let text = res.data
					this.agreement = text
				}
			})
		},
		
		methods: {
			handleHelp() {
				// 打开页面 https://github.com/Koorye/chat-free
				plus.runtime.openURL('https://github.com/Koorye/chat-free')
			},
			
			handleShowAgreement() {
				uni.showModal({
					title: '用户协议',
					content: this.agreement,
					showCancel: false
				})
			}
		}
	}
</script>

<style scoped>
	.content {
		padding: 5%;
	}
	
	.foot {
		text-align: center;
		color: #666;
		font-size: 10px;
		margin-top: 20px;
	}
</style>