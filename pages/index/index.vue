<template>
	<view class="content">
		<!-- 按钮栏 -->
		<view class="button-box">
			<view>
				<text class="title">当前对话：</text>
				<text>{{chatName}}</text>
			</view>
			<button type="primary" @click="handleSaveChat">保存对话</button>
			<button type="warn" @click="handleClearChat">清空对话</button>
		</view>
		
		<!-- 角色下拉选择框 -->
		<view class="picker-box">
			<view class="title">当前角色：</view>
			<view v-if="roleList.length === 0">请先添加角色</view>
			<view v-else>
				<picker mode="selector" :range="roleList" 
				:range-key="'name'" @change="handleRoleChange">
					{{roleList[roleIndex].name}}
				</picker>
			</view>
			<view class="title">当前API：</view>
			<view v-if="apiList.length === 0">请先添加API</view>
			<view v-else>
				<picker mode="selector" :range="apiList" 
				:range-key="'name'" @change="handleAPIChange">
					{{apiList[apiIndex].name}}
				</picker>
			</view>
		</view>
		
		<!-- chat box -->
		<scroll-view scroll-y="true" class="chat-box" 
		scroll-with-animation="true" :style="{height: scrollHeight + 'px'}">
			<view id="scroll-view-content">
				<view v-for="(item, index) in chatList" :key="index">
					<view v-if="item.role === 'user'" class="chat-item">
						<text class="user">{{item.message}}</text>
					</view>
					<view v-else class="chat-item">
						<view v-if="getImgUrl(item.role) !== ''">
							<image :src="getImgUrl(item.role)" class="avatar" />
						</view>
						<view v-else>
							<view class="avatar">?</view>
						</view>
						<text class="bot">{{item.message}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- input box -->
		<view class="input-box">
			<checkbox-group @change="checkboxChange">
				<checkbox checked>记忆</checkbox>
			</checkbox-group>
			<uni-easyinput type="text" v-model="message" placeholder="请输入消息" />
			<button type="primary" @click="handleSend">发送</button>
		</view>
	</view>
</template>

<script>
	import { requestERNIE, requestSpark } from '@/common/api.ts'
	import { loadRoles, loadAPIs, loadHistoryDetail, saveHistoryDetail } from '@/common/config.ts'
	
	export default {
		data() {
			return {
				chatList: [],
				roleList: [{'name': ''}],
				apiList: [{'name': ''}],
				message: '',
				roleIndex: 0,
				apiIndex: 0,
				key: '',
				chatName: '',
				useMemory: true,
				scrollHeight: 0
			}
		},
		
		onLaunch() {
			uni.getSystemInfo({
				success: (res) => {
					this.scrollHeight = res.windowHeight
				}
			})
		},
		
		onLoad(data) {
			this.key = data.key
			this.chatName = data.name
			console.log('key:', this.key)
		},
		
		onShow() {			
			let roleList = loadRoles()
			if (roleList) this.roleList = roleList
			let apiList = loadAPIs()
			if (apiList) this.apiList = apiList
			
			if (!this.checkRole()) uni.navigateBack()
			if (!this.checkAPI()) uni.navigateBack()
			
			let detail = loadHistoryDetail(this.key)
			if (detail) {
				this.roleIndex = detail['roleIndex']
				this.apiIndex = detail['apiIndex']
				this.chatList = detail['chatlist']
				
				if (this.roleIndex >= this.roleList.length) this.roleIndex = 0
				if (this.apiIndex >= this.apiList.length) this.apiIndex = 0
			}
			
			uni.getSystemInfo({
				success: (res) => {
					console.log(res)
					this.scrollHeight = res.windowHeight - 200
				}
			})
		},
		
		methods: {
			checkRole() {
				if (this.roleList.length === 0) {
					uni.showToast({
						title: '请先添加角色',
						icon: 'none'
					})
					return false
				}
				return true
			},
			
			checkAPI() {
				if (this.apiList.length === 0) {
					uni.showToast({
						title: '请先添加API',
						icon: 'none'
					})
					return false
				}
				return true
			},
			
			checkboxChange() {
				this.useMemory = !this.useMemory
				console.log('use memory:', this.useMemory)
			},
			
			handleSaveChat() {
				saveHistoryDetail(this.key, {
					roleIndex: this.roleIndex,
					apiIndex: this.apiIndex,
					chatlist: this.chatList
				})
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})
			},
			
			handleClearChat() {
				this.chatList = []
				saveHistoryDetail(this.key, {
					roleIndex: this.roleIndex,
					apiIndex: this.apiIndex,
					chatlist: this.chatList
				})
			},
			
			handleSend() {
				if (!this.message) {
					uni.showToast({
						title: '请输入消息',
						icon: 'none'
					})
					return
				}
				this.chatList.push({
					'role': 'user',
					'message': this.message,
				})
				this.handleRequest()
				this.message = ''
			},
			
			handleRequest() {
				let api = this.apiList[this.apiIndex]
				let role = this.roleList[this.roleIndex]
				
				let all_message = 'Instruction: ' + role['desc'] + '\n'
				if (this.useMemory) all_message += this.parseMemory()
				else all_message += 'Quesion: ' + this.message + '\nAnswer: '
				console.log('all message:\n' + all_message)
				
				let promise = null

				if (api['name'] === 'Spark') {
					promise = requestSpark(all_message, api['key'], api['serect'], api['model'])
				}
				else if (api['name'] === 'ERNIE') {
					promise = requestERNIE(all_message, api['access'])
				}
				else {
					uni.showToast({
						title: '请选择API',
						icon: 'none'
					})
					return
				}
				promise.then((res) => {
					let result = res.result
					if (result.startsWith('Answer:')) result = result.substring(7)
					result = result.trim()
					this.chatList.push({
						'role': role['name'],
						'message': result
					})
				})
			},
			
			parseMemory() {
				let message = ''
				for (let item of this.chatList) {
					if (item['role'] === 'user') {
						message += 'Quesion: ' + item['message'] + '\n'
					} else {
						message += 'Answer: ' + item['message'] + '\n'
					}
				}
				return message
			},
			
			handleRoleChange(e) {
				this.roleIndex = e.detail.value
			},
			
			handleAPIChange(e) {
				this.apiIndex = e.detail.value
			},
			
			getImgUrl(role) {
				for (let item of this.roleList) {
					if (item['name'] === role) {
						return item['imgUrl']
					}
				}
				return ''
			}
		}
	}
</script>

<style scoped>
	.content {
		width: 90%;
		padding: 5%;
	}
	
	.button-box {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 10rpx;
		box-shadow: 0px 1px 0px 0px #ddd;
	}
	
	.picker-box {
		display: flex;
		justify-content: space-around;
		padding: 10rpx;
		box-shadow: 0px 1px 0px 0px #ddd;
	}
	
	.chat-box {
		height: 70%;
	}
	
	.chat-item {
		display: flex;
		justify-content: space-around;
	}
	
	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		border: #000 1px solid;
		font-size: 60rpx;
		text-align: center;
		align-items: center;
	}
	
	.user {
		width: 80%;
		background-color: #00aa00;
		color: #fff;
		padding: 10rpx;
		margin: 10rpx;
		margin-left: auto;
		border-radius: 10rpx;
		font-size: 30rpx;
	}
	
	.bot {
		width: 80%;
		background-color: #00aaff;
		color: #fff;
		padding: 10rpx;
		margin: 10rpx;
		border-radius: 10rpx;
		font-size: 30rpx;
	}
	
	.input-box {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	
	.title {
		font-weight: bold;
	}
	
	button {
		font-size: 30rpx;
	}
	
	checkbox {
		transform: scale(0.7);
		font-size: 25rpx;
		padding: 0rpx;
	}
</style>
