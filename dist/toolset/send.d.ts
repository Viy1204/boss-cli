export type SendChatMessageOptions = {
    text?: string;
    requestResume?: boolean;
    signal?: AbortSignal;
};
export declare function runSendChatMessage(options: SendChatMessageOptions): Promise<string>;
//# sourceMappingURL=send.d.ts.map