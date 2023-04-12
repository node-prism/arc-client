import { CommandClient } from '@prsm/duplex';

type QueryPayload = {
    collection: string;
    operation: "find" | "insert" | "update" | "remove" | "drop";
    data?: {
        query?: object;
        operations?: object;
        options?: object;
    };
    accessToken?: string;
};
declare class ArcClient {
    readonly client: CommandClient;
    private authenticated;
    private username;
    private password;
    private tokens;
    constructor({ host, port, secure, username, password }: {
        host: any;
        port: any;
        secure: any;
        username: any;
        password: any;
    });
    refresh(): Promise<void>;
    auth(): Promise<void>;
    query(query: QueryPayload): any;
    createUser(username: string, password: string): Promise<unknown>;
    removeUser(username: string): Promise<unknown>;
}

export { ArcClient, QueryPayload };
