import { message } from "antd";
const notif = (messageId, messageObject) => {
	if (messageObject[messageId].type == "info") {
		message.info(messageObject[messageId].message);
	} else if (messageObject[messageId].type == "success") {
		message.success(messageObject[messageId].message);
	} else if (messageObject[messageId].type == "error") {
		message.error(messageObject[messageId].message);
	} else if (messageObject[messageId].type == "warning") {
		message.warning(messageObject[messageId].message);
	}
};

export default notif;
