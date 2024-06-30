const saveRoles = (roleList) => {
	uni.setStorageSync('role', roleList)
	console.log('save role:', roleList)
}

const loadRoles = () => {
	let roleList = uni.getStorageSync('role')
	if (roleList) {
		console.log('load role:', roleList)
		return roleList
	}
	return null
}

const saveAPIs = (apiList) => {
	uni.setStorageSync('api', apiList)
	console.log('save API:', apiList)
}

const loadAPIs = () => {
	let apiList = uni.getStorageSync('api')
	if (apiList) {
		console.log('load API:', apiList)
		return apiList
	}
	return null
}

const saveHistories = (history) => {
	uni.setStorageSync('history', history)
	console.log('save history:', history)
}

const loadHistories = () => {
	let history = uni.getStorageSync('history')
	if (history) {
		console.log('load history:', history)
		return history
	}
	return null
}

const saveHistoryDetail = (key, detail) => {
	uni.setStorageSync(key, detail)
	console.log('save history detail:', detail)
	return key
}

const loadHistoryDetail = (key) => {
	let history = uni.getStorageSync(key)
	if (history) {
		console.log('load history detail:', history)
		return history
	}
	return null
}

const removeHistoryDetail = (key) => {
	uni.removeStorageSync(key)
	console.log('remove history detail:', key)
}

const removeAllHistoryDetail = () => {
	// remove if startwith history
	let keys = uni.getStorageInfoSync().keys
	for (let i = 0; i < keys.length; i++) {
		if (keys[i].startsWith('history')) {
			uni.removeStorageSync(keys[i])
		}
	}
}

export {
	saveRoles,
	loadRoles,
	saveAPIs,
	loadAPIs,
	saveHistories,
	loadHistories,
	saveHistoryDetail,
	loadHistoryDetail,
	removeHistoryDetail,
	removeAllHistoryDetail
}