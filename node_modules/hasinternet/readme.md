var hasInternet = require('hasinternet')

hasInternet(answer)

function answer(err, internet) {
	console.log(err, internet)
}