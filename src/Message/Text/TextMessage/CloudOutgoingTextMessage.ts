/**
 * WhatsApp NodeJS SDK.
 *
 * @since  2.0.0
 * @author Great Detail Ltd <info@greatdetail.com>
 * @author Dom Webber <dom.webber@hotmail.com>
 * @see    https://greatdetail.com
 */
import OutgoingMessageType from "../../MessageType/OutgoingMessageType";
import CloudOutgoingMessage from "../../OutgoingMessage/CloudOutgoingMessage";
import CloudOutgoingMessageText from "../MessageText/Outgoing/CloudOutgoingMessageText";

type CloudOutgoingTextMessage =
  CloudOutgoingMessage<OutgoingMessageType.Text> & {
    [OutgoingMessageType.Text]: CloudOutgoingMessageText;
  };

export default CloudOutgoingTextMessage;
