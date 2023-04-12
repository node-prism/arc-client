import { QueryOptions } from '@prsm/arc';
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
    auth(): Promise<void>;
    query(query: QueryPayload): Promise<unknown>;
    createUser(username: string, password: string): Promise<unknown>;
    removeUser(username: string): Promise<unknown>;
    collectionWrapper(collectionName: string): {
        find: (query: object, options?: QueryOptions) => Promise<unknown>;
        insert: (query: object) => Promise<unknown>;
        update: (query: object, operations: object, options?: QueryOptions) => Promise<unknown>;
        remove: (query: object, options?: QueryOptions) => Promise<unknown>;
        drop: () => Promise<unknown>;
    };
}

export { ArcClient, QueryPayload };
