/**
 * WhatsApp NodeJS SDK.
 *
 * @author Great Detail Ltd <info@greatdetail.com>
 * @author Dom Webber <dom.webber@hotmail.com>
 * @see    https://greatdetail.com
 */

import { createHmac } from "node:crypto";
import { WebhookEventNotification } from "../types/Webhook/WebhookEventNotification.js";
import IncorrectMethodWebhookError from "./WebhookError/IncorrectMethodWebhookError.js";
import WebhookError from "./WebhookError/index.js";
import InvalidHubChallengeWebhookError from "./WebhookError/InvalidHubChallengeWebhookError.js";
import InvalidHubModeWebhookError from "./WebhookError/InvalidHubModeWebhookError.js";
import InvalidHubSignatureWebhookError from "./WebhookError/InvalidHubSignatureWebhookError.js";
import InvalidHubVerifyTokenWebhookError from "./WebhookError/InvalidHubVerifyTokenWebhookError.js";
import MissingBodyWebhookError from "./WebhookError/MissingBodyWebhookError.js";

export interface IncomingRequest {
  method: string;
  query: Record<string, string>;
  body?: string;
  headers: Record<string, string>;
}

export default class Webhook {
  public errors = {
    WebhookError,
    IncorrectMethodWebhookError,
    InvalidHubChallengeWebhookError,
    InvalidHubModeWebhookError,
    InvalidHubSignatureWebhookError,
    InvalidHubVerifyTokenWebhookError,
    MissingBodyWebhookError,
  };

  /**
   * Handle a Registration Webhook Request.
   * The handler for `GET` requests to your webhook endpoint. A registration
   * request is when WhatsApp sends a GET request to your webhook endpoint to
   * verify that it is valid. The challenge should be returned if valid.
   *
   * **ExpressJS**:
   *
   * ```ts
   * app.get(
   *   "/path/to/webhook",
   *   async (req, res) => {
   *     const reg = await sdk.webhook.register({
   *       method: request.method,
   *       query: req.query,
   *       body: req.body,
   *       headers: req.headers,
   *     });
   *     // DIY: Check the reg.verifyToken value
   *     if (reg.verifyToken !== "abcd") {
   *       return res.end(reg.reject());
   *     }
   *     return res.end(reg.accept());
   *   }
   * );
   * ```
   *
   * **Fastify**:
   *
   * ```ts
   * fastify.route({
   *   method: "GET",
   *   url: "/path/to/webhook",
   *   handler: (request, reply) => {
   *     const reg = await sdk.webhook.register({
   *       method: request.method,
   *       query: request.query,
   *       body: JSON.stringify(request.body),
   *       headers: request.headers,
   *     });
   *     // DIY: Check the reg.verifyToken value
   *     if (reg.verifyToken !== "abcd") {
   *       return reply.send(reg.reject());
   *     }
   *     return reply.send(reg.accept());
   *   }
   * });
   * ```
   *
   * @throws {WebhookError}
   */
  public async register(request: IncomingRequest) {
    if (request.method.toLowerCase() !== "get") {
      throw new IncorrectMethodWebhookError(
        "Webhook Registration Requests must use the GET request method.",
      );
    }

    const hubMode = request.query["hub.mode"] ?? undefined;
    if (!hubMode || hubMode !== "subscribe") {
      throw new InvalidHubModeWebhookError(
        "Webhook Registration Request must have query parameter: hub.mode=subscribe",
      );
    }

    const hubChallenge = request.query["hub.challenge"] ?? undefined;
    if (!hubChallenge) {
      throw new InvalidHubChallengeWebhookError(
        "Webhook Registration Request must have query parameter: hub.challenge",
      );
    }

    const hubVerifyToken = request.query["hub.verify_token"] ?? undefined;
    if (!hubVerifyToken) {
      throw new InvalidHubVerifyTokenWebhookError(
        "Webhook Registration Request must have query parameter: hub.verify_token",
      );
    }

    return {
      verifyToken: hubVerifyToken,
      challenge: hubChallenge,
      accept: () => hubChallenge,
      reject: () => {},
    };
  }

  /**
   * Handle an Event Notification Webhook Request.
   * The handler for `POST` requests to your webhook endpoint.
   *
   * **ExpressJS**:
   *
   * ```ts
   * app.use(express.raw()); // Important <-
   * app.post(
   *   "/path/to/webhook",
   *   async (req, res) => {
   *     const event = sdk.webhook.eventNotification({
   *       method: request.method,
   *       query: req.query,
   *       body: req.body.toString(),
   *       headers: req.headers,
   *     });
   *     // DIY: Load the Meta App Secret
   *     event.verifySignature("abcd-app-secret");
   *     if (someFailedCondition) {
   *       return res.end(event.reject());
   *     }
   *     return res.end(event.accept());
   *   }
   * );
   * ```
   *
   * **Fastify**:
   *
   * ```ts
   * fastify.route({
   *   method: "POST",
   *   url: "/path/to/webhook",
   *   handler: (request, reply) => {
   *     const event = sdk.webhook.eventNotification({
   *       method: request.method,
   *       query: request.query,
   *       body: JSON.stringify(req.body),
   *       headers: request.headers,
   *     });
   *     // DIY: Load the Meta App Secret
   *     event.verifySignature("abcd-app-secret");
   *     if (someFailedCondition) {
   *       return reply.code(400).send();
   *     }
   *     return reply.send(event.accept());
   *   }
   * });
   * ```
   */
  public async eventNotification(request: IncomingRequest) {
    if (request.method.toLowerCase() !== "post") {
      throw new IncorrectMethodWebhookError(
        "Webhook Event Notification Request must use the POST request method.",
      );
    }

    const xHubSignature256 = request.headers["x-hub-signature-256"]
      ?.toString()
      .replace("sha256=", "");
    if (!xHubSignature256) {
      throw new InvalidHubSignatureWebhookError(
        "Webhook Event Notification Request must have header: x-hub-signature-256",
      );
    }

    if (!request.body) {
      throw new MissingBodyWebhookError(
        "Webhook Event Notification Request must have a body",
      );
    }

    // Async request body buffering
    const bodyString = Buffer.from(request.body).toString("utf8");
    const eventNotification = JSON.parse(
      bodyString,
    ) as WebhookEventNotification;

    return {
      eventNotification,
      checkSignature: (appSecret: string) => {
        const generatedSignature256 = createHmac("sha256", appSecret)
          .update(bodyString)
          .digest("hex");

        const isAuthentic256 = xHubSignature256 === generatedSignature256;

        return isAuthentic256;
      },
      verifySignature(appSecret: string) {
        if (!this.checkSignature(appSecret)) {
          throw new InvalidHubSignatureWebhookError(
            "Webhook Event Notification Signature doesn't match received body",
          );
        }
      },
      accept: () => {},
    };
  }
}
