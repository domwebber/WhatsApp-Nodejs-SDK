/**
 * WhatsApp NodeJS SDK.
 *
 * @since  2.0.0
 * @author Great Detail Ltd <info@greatdetail.com>
 * @author Dom Webber <dom.webber@hotmail.com>
 * @see    https://greatdetail.com
 */

import CloudIncomingMessageMedia from "../../../MessageMedia/CloudIncomingMessageMedia.js";
import IncomingMessageSticker from "../Incoming/IncomingMessageSticker.js";

export default interface CloudIncomingMessageSticker
  extends CloudIncomingMessageMedia,
    IncomingMessageSticker {}
