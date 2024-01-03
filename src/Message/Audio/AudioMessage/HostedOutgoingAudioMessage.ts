/**
 * WhatsApp NodeJS SDK.
 *
 * @since  2.0.0
 * @author Great Detail Ltd <info@greatdetail.com>
 * @author Dom Webber <dom.webber@hotmail.com>
 * @see    https://greatdetail.com
 */
import OutgoingMessageType from "../../MessageType/OutgoingMessageType.js";
import HostedOutgoingMessage from "../../OutgoingMessage/HostedOutgoingMessage.js";
import HostedOutgoingMessageAudio from "../MessageAudio/HostedOutgoingMessageAudio.js";

type HostedOutgoingAudioMessage =
  HostedOutgoingMessage<OutgoingMessageType.Audio> & {
    [OutgoingMessageType.Audio]: HostedOutgoingMessageAudio;
  };

export default HostedOutgoingAudioMessage;
