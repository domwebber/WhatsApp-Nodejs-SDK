/**
 * WhatsApp NodeJS SDK.
 *
 * @since  2.0.0
 * @author Great Detail Ltd <info@greatdetail.com>
 * @author Dom Webber <dom.webber@hotmail.com>
 * @see    https://greatdetail.com
 */
import CloudOutgoingMessageMedia from "../MessageMedia/CloudOutgoingMessageMedia";
import OutgoingMessageType from "../MessageType/OutgoingMessageType";
import CloudOutgoingMessage from "../OutgoingMessage/CloudOutgoingMessage";

type CloudOutgoingStickerMessage =
  CloudOutgoingMessage<OutgoingMessageType.Sticker> & {
    /**
     * A media object containing a sticker.
     *
     * Static and animated third-party outbound stickers are supported in
     * addition to all types of inbound stickers. A static sticker needs to be
     * 512x512 pixels and cannot exceed 100KB. Animated stickers must be
     * 512x512 pixels and cannot exceed 500KB.
     *
     * @since 4.2.0
     */
    [OutgoingMessageType.Sticker]: CloudOutgoingMessageMedia;
  };

export default CloudOutgoingStickerMessage;