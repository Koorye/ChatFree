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
			if (uni.getSystemInfoSync().platform === 'windows') {
				uni.request({
					url: '/static/agreement.txt',
					success: (res) => {
						this.agreement = res.data
					}
				})
			} else {
				plus.io.resolveLocalFileSystemURL('_www/static/agreement.txt', (entry) => {
					entry.file((file) => {
						let reader = new plus.io.FileReader()
						reader.readAsText(file, 'utf-8')
						reader.onloadend = (e) => {
							this.agreement = e.target.result
						}
					})
				})
			}
		},
		
		methods: {
			handleHelp() {
				// 打开页面 https://github.com/Koorye/chat-free
				plus.runtime.openURL('https://github.com/Koorye/ChatFree')
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