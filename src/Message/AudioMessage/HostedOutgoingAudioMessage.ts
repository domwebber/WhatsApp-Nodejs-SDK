/**
 * WhatsApp NodeJS SDK.
 *
 * @since  2.0.0
 * @author Great Detail Ltd <info@greatdetail.com>
 * @author Dom Webber <dom.webber@hotmail.com>
 * @see    https://greatdetail.com
 */
import HostedOutgoingMessageAudio from "../MessageAudio/HostedOutgoingMessageAudio";
import OutgoingMessageType from "../MessageType/OutgoingMessageType";
import HostedOutgoingMessage from "../OutgoingMessage/HostedOutgoingMessage";

type HostedOutgoingAudioMessage =
  HostedOutgoingMessage<OutgoingMessageType.Audio> & {
    [OutgoingMessageType.Audio]: HostedOutgoingMessageAudio;
  };

export default HostedOutgoingAudioMessage;
