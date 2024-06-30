<template>
	<view class="content">
		<!-- <view class="button-box">
			<button type="warn" @click="handleRomoveAll">清除全部</button>
		</view> -->
		<view class="button-box">
			<uni-easyinput v-model="chatName" placeholder="请输入对话名" />
			<button type="primary" @click="handleCreate">新对话</button>
		</view>
		
		<view class="history-list">
			<view v-if="historyList.length === 0">
				<view>暂无对话</view>
			</view>
			<view v-else>
				<view v-for="(item, index) in historyList" :key="index">
					<view class="history-item">
						<view class="title">{{item.name}}</view>
						<view class="key">{{item.key}}</view>
						<button type="primary" @click="handleSelect(index)" 
						class="history-item-btn">进入对话</button>
						<button type="warn" @click="handleDelete(index)"
						class="history-item-btn">删除</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { loadHistories, loadHistoryDetail, saveHistories,
	saveHistoryDetail, removeHistoryDetail, removeAllHistoryDetail } from '@/common/config.ts'
	
	export default {
		data() {
			return {
				historyList: [],
				chatName: ''
			}
		},
		
		onShow() {
			let historyList = loadHistories()
			if (historyList) {
				this.historyList = historyList
			}
		},
		
		methods: {
			handleSelect(index) {
				let history = this.historyList[index]
				uni.navigateTo({
					url: '/pages/index/index?key=' + history.key + '&name=' + history.name
				})
			},
			
			handleDelete(index) {
				removeHistoryDetail(this.historyList[index].key)
				this.historyList.splice(index, 1)
				saveHistories(this.historyList)
			},
			
			handleCreate() {
				if (this.chatName === '') {
					uni.showToast({
						title: '请输入对话名',
						icon: 'none'
					})
					return
				}
				
				let key = 'history_' + new Date().getTime()
				let chatList = []
				this.historyList.push({
					name: this.chatName,
					key: key
				})
				saveHistories(this.historyList)
				saveHistoryDetail(key, {
					roleIndex: 0,
					apiIndex: 0,
					chatlist: []
				})
				
				this.chatName = ''
			},
			
			handleRomoveAll() {
				removeAllHistoryDetail()
				this.historyList = []
				saveHistories(this.historyList)
			}
			
		}
	}
</script>

<style scoped>
	.content {
		width: 90%;
		padding: 5%;
	}
	
	.history-item {
		padding: 10px;
		display: flex;
		justify-content: space-between;
		box-shadow: 0px 1px 0px 0px #ddd;
		align-items: center;
	}
	
	.title {
		width: 30%;
		font-size: 20rpx;
		font-weight: bold;
	}
	
	.key {
		width: 25%;
		padding: 20rpx;
		font-size: 15rpx;
		color: #888;
	}
	
	.button-box {
		margin: 20rpx;
		display: flex;
		justify-content: space-around;
	}
	
	.history-item-btn {
		font-size: 20rpx;
	}
	
	button {
		font-size: 30rpx;
	}
</style>