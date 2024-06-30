const baseRequest = (url, method, headers, data) => {
	console.log('url:', url)
	console.log('method:', method)
	console.log('headers:', headers)
	console.log('data:', data)
	return new Promise((resolve, reject) => {
		uni.request({
			url: url,
			method: method,
			header: headers,
			data: data,
			success: (res) => {
				console.log('res:', res)
				resolve(res.data)
			},
			fail: (err) => {
				console.log('err:', err)
				reject(err)
			}
		})
	})
}

const getBaseURL = (name) => {
	let platform = uni.getSystemInfoSync().platform
	if (platform === 'windows') {
		if (name === 'wenxin') return '/wenxin'
		else if (name === 'spark') return '/spark'
	} else {
		if (name === 'wenxin') return 'https://aip.baidubce.com'
		else if (name === 'spark') return 'http://spark-api-open.xf-yun.com'
	}
}

const requestERNIE = (message, accessToken) => {
	let baseUrl = getBaseURL('wenxin')
	let url = baseUrl + '/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_speed?access_token=' + accessToken
	let headers = {
		'Content-Type': 'application/json'
	}
	let data = {
		'messages': [
			{
				'role': 'user',
				'content': message
			}
		]
	}
	return baseRequest(url, 'POST', headers, data)
}

const requestSpark = (message, key, serect, model) => {
	let baseUrl = getBaseURL('spark')
	let url = baseUrl + '/v1/chat/completions'
	let headers = {
		'Authorization': 'Bearer ' + key + ':' + serect,
		'Content-Type': 'application/json'
	}
	let data = {
		'model': model,
		'messages': [
			{
				'role': 'user',
				'content': message
			}
		]
	}
	return baseRequest(url, 'POST', headers, data)
}

const accessERNIE = (key, serect) => {
	let baseUrl = getBaseURL('wenxin')
	let url = baseUrl + '/oauth/2.0/token'
	let data = {
		'grant_type': 'client_credentials',
		'client_id': key,
		'client_secret': serect,
	}
	return baseRequest(url, 'GET', null, data)
}

export {
	requestERNIE,
	requestSpark,
	accessERNIE
}