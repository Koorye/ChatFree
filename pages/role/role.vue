<template>
	<view class="content">
		<!-- 用于添加角色的对话框 -->
		<view class="popup" v-show="showAddDialog">
			<view class="popup-info">
				<uni-easyinput v-model="roleName" placeholder="角色名" />
				<uni-easyinput v-model="roleDesc" placeholder="角色描述" />
				<view class="button-box">
					<button type="primary" @click="addRole">添加</button>
					<button type="warn" @click="cancelAddRole">取消</button>					
				</view>
			</view>
		</view>
		
		<!-- 用于编辑角色的对话框 -->
		<view class="popup" v-show="showEditDialog">
			<view class="popup-info">
				<uni-easyinput v-model="roleNameEdit" placeholder="角色名" />
				<uni-easyinput v-model="roleDescEdit" placeholder="角色描述" />
				<view class="button-box">
					<button type="primary" @click="editRole">编辑</button>
					<button type="warn" @click="cancelEditRole">取消</button>					
				</view>
			</view>
		</view>
		
		<!-- 添加角色按钮 -->
		<view class="button-box">
			<button type="primary" @click="handleAddRole">添加角色</button>
			<button type="primary" @click="handleSaveRole">保存角色</button>
		</view>

		<!-- 角色列表，包含名称、描述等设置 -->
		<view class="role-list">
			<view class="role-item" v-for="(item, index) in roleList" :key="index">
				<view>
					<view v-if="item.imgUrl !== ''">
						<image :src="item.imgUrl" @click="uploadAvatar(index)" class="role-avatar" />
					</view>
					<view v-else>
						<!-- draw a add icon -->
						<view class="role-avatar" @click="uploadAvatar(index)">+</view>
					</view>
				</view>
				<view class="role-info">			
					<view class="role-item-name">{{item.name}}</view>
					<view class="role-item-desc">{{item.desc}}</view>
				</view>
				<view class="role-item-btns">
					<button type="primary" class="role-item-btn" 
					@click="handleEditRole(index)">编辑</button>
					<button type="warn" class="role-item-btn" 
					@click="deleteRole(index)">删除</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { loadRoles, saveRoles } from '@/common/config.ts'
	import { pathToBase64, base64ToPath } from '@/common/image-tools.js'
	
	export default {
		data() {
			return {
				roleList: [
					{
						name: '工程师',
						desc: '你是一个工程师,善于解决工程问题',
						imgUrl: ''
					},
					{
						name: '科学家',
						desc: '你是一个科学家,善于研究自然科学问题',
						imgUrl: ''
					}
				],
				roleName: '',
				roleDesc: '',
				roleNameEdit: '',
				roleDescEdit: '',
				showAddDialog: false,
				showEditDialog: false,
				editIndex: 0,
			}
		},
		
		onShow() {
			let roleList = loadRoles()
			if (roleList) {
				this.roleList = roleList
			}
		},
		
		methods: {
			handleAddRole() {
				this.showAddDialog = true
			},
			
			handleEditRole(index) {
				this.showEditDialog = true
				let role = this.roleList[index]
				this.roleNameEdit = role['name']
				this.roleDescEdit = role['desc']
				this.editIndex = index
			},
			
			handleSaveRole() {
				saveRoles(this.roleList)
				uni.showToast({
					title: '保存成功'
				})
			},
			
			addRole() {
				if (this.roleName === '') {
					uni.showToast({
						title: '请输入角色名',
						icon: 'none'
					})
					return
				}
				if (this.roleDesc === '') {
					uni.showToast({
						title: '请输入角色描述',
						icon: 'none'
					})
					return
				}
				
				// 打开一个对话框,输入角色名称和描述,然后添加到roleList中
				this.roleList.push({
					name: this.roleName,
					desc: this.roleDesc,
					imgUrl: ''
				})
				this.showAddDialog = false
				saveRoles(this.roleList)
			},
			
			editRole() {
				let role = this.roleList[this.editIndex]
				role['name'] = this.roleNameEdit
				role['desc'] = this.roleDescEdit
				this.showEditDialog = false
				saveRoles(this.roleList)
			},
			
			cancelAddRole() {
				this.showAddDialog = false
			},
			
			cancelEditRole() {
				this.showEditDialog = false
			},
			
			deleteRole(index) {
				this.roleList.splice(index, 1)
				saveRoles(this.roleList)
			},
			
			uploadAvatar(index) {
				uni.chooseImage({
				    count:1,
				    success:(res) => {
						if (uni.getSystemInfoSync().platform === 'windows') {
							console.log('windows')
							pathToBase64(res.tempFilePaths[0]).then((base64) => {
								this.roleList[index]['imgUrl'] = base64
								saveRoles(this.roleList)
							})
						} else {
							uni.compressImage({
								src: res.tempFilePaths[0],
								width: '80px',
								height: '80px',
								success: res => {
									pathToBase64(res.tempFilePath).then((base64) => {
										this.roleList[index]['imgUrl'] = base64
										saveRoles(this.roleList)
									})
								}
							})
						}
				    },
				})
			}
			
		}
	}
</script>

<style scoped>

.content {
	width: 90%;
	padding: 5%;
}

.role-item {
	margin: 20rpx;
	padding: 10rpx;
	display: flex;
	justify-content: space-around;
	box-shadow: 0px 1px 0px 0px #ddd;
}

.role-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	border: #000 1px solid;
	font-size: 60rpx;
	text-align: center;
	align-items: center;
}

.role-info {
	width: 50%;
}

.role-item-name {
	font-weight: bold;
	font-size: 30rpx;
}

.role-item-desc {
	font-size: 20rpx;
}

.button-box {
	display: flex;
	justify-content: space-between;
}

.role-item-btn {
	font-size: 20rpx;
}

.popup {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	height: 100vh;
	background-color: rgba(0,0,0,0.6);
	z-index: 9998;
}

.popup-info{
	position: fixed;
	width: 550upx;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	font-size: 30upx;
	padding: 40upx;
	border-radius: 20upx;
	background-color: #fff;
	z-index: 9999;
}

button {
	font-size: 30rpx;
}
</style>