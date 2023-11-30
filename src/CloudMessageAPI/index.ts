/**
 * WhatsApp NodeJS SDK.
 *
 * @since  2.0.0
 * @author Great Detail Ltd <info@greatdetail.com>
 * @author Dom Webber <dom.webber@hotmail.com>
 * @see    https://greatdetail.com
 */
import AbstractAPI from "../API/AbstractAPI";
import EndpointType from "../API/EndpointType";
import GraphRequest, { GraphRequestCreateParams } from "../GraphRequest";
import CloudOutgoingMessageContact from "../Message/MessageContact/CloudOutgoingMessageContact";
import CloudOutgoingMessageInteractive from "../Message/MessageInteractive/CloudOutgoingMessageInteractive";
import CloudOutgoingMessageLocation from "../Message/MessageLocation/CloudOutgoingMessageLocation";
import CloudOutgoingMessageMedia from "../Message/MessageMedia/CloudOutgoingMessageMedia";
import CloudOutgoingMessageStatus from "../Message/MessageStatus/CloudOutgoingMessageStatus";
import CloudOutgoingMessageTemplate from "../Message/MessageTemplate/CloudOutgoingMessageTemplate";
import CloudOutgoingMessageText from "../Message/MessageText/CloudOutgoingMessageText";
import MessageTypeEnum from "../Message/MessageTypeEnum";
import CloudOutgoingMessage from "../Message/OutgoingMessage/CloudOutgoingMessage";
import CloudOutgoingStatusMessage from "../Message/StatusMessage/CloudOutgoingStatusMessage";
import MessageResponseType from "../OldMessageType/MessageResponseType";

type CreateMessagePayload =
  | CloudOutgoingMessageMedia
  | CloudOutgoingMessageContact[]
  | CloudOutgoingMessageInteractive
  | CloudOutgoingMessageLocation
  | CloudOutgoingMessageTemplate
  | CloudOutgoingMessageText;

type CreateMessageOptionsType = {
  toNumber: string;
  replyMessageId?: string;
  requestProps?: GraphRequestCreateParams;
};

/**
 * WhatsApp Message API.
 *
 * @since 2.0.0
 * @author Dom Webber <dom.webber@hotmail.com>
 * @example
 * // Send a Text Message
 * const message = sdk.message.text({ body: "Hello"}, { toNumber: "1234567890" });
 * const sendReceipt = await message.send();
 * console.log(sendReceipt);
 */
export default class CloudMessageAPI extends AbstractAPI {
  protected getEndpoint(): EndpointType {
    return `/${this._businessID}/messages`;
  }

  /**
   * Create Status Message.
   *
   * @since 2.0.0
   * @author Dom Webber <dom.webber@hotmail.com>
   */
  public createStatus(
    payload: CloudOutgoingMessageStatus,
    requestProps: GraphRequestCreateParams = {},
  ) {
    const body: CloudOutgoingStatusMessage = {
      messaging_product: "whatsapp",
      ...payload,
    };

    return GraphRequest.create<MessageResponseType>({
      ...requestProps,
      endpoint: this.getEndpoint(),
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        ...requestProps.headers,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Create Message.
   *
   * @since 2.0.0
   * @author Dom Webber <dom.webber@hotmail.com>
   */
  public createMessage<T extends MessageTypeEnum>(
    type: T,
    payload: CreateMessagePayload,
    { toNumber, replyMessageId, requestProps = {} }: CreateMessageOptionsType,
  ) {
    const body: CloudOutgoingMessage<T> = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: toNumber,
      type: type,
      [type]: payload,
    };

    if (replyMessageId) body["context"] = { message_id: replyMessageId };

    return GraphRequest.create<MessageResponseType>({
      ...requestProps,
      endpoint: this.getEndpoint(),
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        ...requestProps.headers,
        "Content-Type": "application/json",
      },
    });
  }

  protected _shorthandAlias<
    T extends MessageTypeEnum,
    P extends CreateMessagePayload,
  >(type: T) {
    const shorthandAliasFunction = function (
      this: CloudMessageAPI,
      payload: P,
      options: CreateMessageOptionsType,
    ) {
      return this.createMessage(type, payload, options);
    };

    return shorthandAliasFunction.bind(this);
  }

  public audio = this._shorthandAlias(MessageTypeEnum.Audio);
  public contacts = this._shorthandAlias(MessageTypeEnum.Contacts);
  public document = this._shorthandAlias(MessageTypeEnum.Document);
  public image = this._shorthandAlias(MessageTypeEnum.Image);
  public interactive = this._shorthandAlias(MessageTypeEnum.Interactive);
  public location = this._shorthandAlias(MessageTypeEnum.Location);
  public sticker = this._shorthandAlias(MessageTypeEnum.Sticker);
  public template = this._shorthandAlias(MessageTypeEnum.Template);
  public text = this._shorthandAlias(MessageTypeEnum.Text);
  public video = this._shorthandAlias(MessageTypeEnum.Video);
}
