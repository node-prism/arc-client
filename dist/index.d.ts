import { QueryOptions } from '@prsm/arc';
import { CommandClient, TokenClientOptions } from '@prsm/duplex';
import EventEmitter from 'events';

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
type ArcClientOptions = TokenClientOptions & {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
};
declare class ArcClient {
    readonly client: CommandClient;
    private authenticated;
    private username;
    private password;
    private tokens;
    emitter: EventEmitter;
    constructor(options: ArcClientOptions);
    close(): void;
    open(): void;
    auth(): Promise<boolean>;
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
