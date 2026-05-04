export type WsInboundFrame =
  | { type: "message.receive"; [key: string]: unknown }
  | { type: string; [key: string]: unknown };

export type WsOutboundFrame =
  | { type: "message.send"; [key: string]: unknown }
  | { type: string; [key: string]: unknown };
