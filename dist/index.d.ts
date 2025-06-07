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
    query(query: QueryPayload): Promise<{
        error: any;
        result: any;
    } | {
        error: any;
        result: any;
    }>;
    createUser(username: string, password: string): Promise<{
        error: any;
        result: any;
    } | {
        error: any;
        result: any;
    }>;
    removeUser(username: string): Promise<{
        error: any;
        result: any;
    } | {
        error: any;
        result: any;
    }>;
    collectionWrapper(collectionName: string): {
        find: (query: object, options?: QueryOptions) => Promise<{
            error: any;
            result: any;
        } | {
            error: any;
            result: any;
        }>;
        insert: (query: object) => Promise<{
            error: any;
            result: any;
        } | {
            error: any;
            result: any;
        }>;
        update: (query: object, operations: object, options?: QueryOptions) => Promise<{
            error: any;
            result: any;
        } | {
            error: any;
            result: any;
        }>;
        remove: (query: object, options?: QueryOptions) => Promise<{
            error: any;
            result: any;
        } | {
            error: any;
            result: any;
        }>;
        drop: () => Promise<{
            error: any;
            result: any;
        } | {
            error: any;
            result: any;
        }>;
    };
}

export { ArcClient, QueryPayload };
