import Pusher from "pusher-js";
import * as PusherTypes from "pusher-js";
import { buildConversationUrl } from "./api-client";

let pusher: any = {
  subscribe: (value: string): void | PusherTypes.Channel =>
    console.log("pusher is not initialized"),
};

const initializePusher = (userId?: string) => {
  pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY || "", {
    cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: buildConversationUrl(`auth/pusher/${userId}`),
  });

  pusher.connection.bind("error", function (error: any) {
    console.error("connection error", error);
  });
};

export { pusher, initializePusher };
