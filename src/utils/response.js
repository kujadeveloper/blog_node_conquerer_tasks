exports.get = (data) => {
	return { success: true, data}
};

exports.getAll =  (data, total, page) => {
	return { success: true, data, total:total, page:page}
};

exports.error =  (error, field) => {
	return { success: false, field: field,  message: error}
};

exports.success = (message, data) => {
	return { success: true, data,  message: message}
};