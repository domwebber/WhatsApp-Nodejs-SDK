/**
 * WhatsApp NodeJS SDK.
 *
 * @since  2.0.0
 * @author Great Detail Ltd <info@greatdetail.com>
 * @author Dom Webber <dom.webber@hotmail.com>
 * @see    https://greatdetail.com
 */

export type IncomingMessageReferralSourceType =
  | "ad"
  | "post"
  | (string & NonNullable<unknown>);

export type IncomingMessageReferralMediaType =
  | "image"
  | "video"
  | (string & NonNullable<unknown>);

export default interface IncomingMessageReferral {
  /**
   * The Meta URL that leads to the ad or post clicked by the customer. Opening
   * this URL takes you to the ad viewed by your customer.
   */
  source_url: string;

  /**
   * The type of the ad's source.
   */
  source_type: IncomingMessageReferralSourceType;

  /**
   * Meta ID for an ad or a post.
   */
  source_id: string;

  /**
   * Headline used in the ad or post.
   */
  headline: string;

  /**
   * Body for the ad or post.
   */
  body: string;

  /**
   * Media present in the ad or post.
   */
  media_type: IncomingMessageReferralMediaType;

  /**
   * URL of the image, when media_type is an image.
   */
  image_url: URL;

  /**
   * URL of the video, when media_type is a video.
   */
  video_url: URL;

  /**
   * URL for the thumbnail, when media_type is a video.
   */
  thumbnail_url: URL;

  /**
   * Click ID generated by Meta for ads that click to WhatsApp.
   *
   * @since September 27, 2023
   */
  ctwa_clid?: string;
}
