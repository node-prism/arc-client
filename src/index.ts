import { type QueryOptions } from "@prsm/arc";
import { CommandClient } from "@prsm/duplex";
import EventEmitter from "events";

export type QueryPayload = {
  collection: string;
  operation: "find" | "insert" | "update" | "remove" | "drop";
  data?: {
    query?: object;
    operations?: object;
    options?: object;
  };
  accessToken?: string;
};

type AuthPayload = {
  username: string;
  password: string;
};

export class ArcClient {
  public readonly client: CommandClient;
  private authenticated = false;
  private username: string;
  private password: string;
  private tokens: { accessToken: string; };
  public emitter: EventEmitter;

  constructor({ host, port, secure, username, password }) {
    this.client = new CommandClient({ host, port, secure });
    this.username = username;
    this.password = password;
    this.emitter = new EventEmitter();
  }

  close() {
    this.authenticated = false;
    this.client.close();
  }

  open() {
    this.client.connect();
  }

  async auth() {
    const payload = {
      username: this.username,
      password: this.password
    };

    const result: { error?: string, accessToken?: string } = await this.client.command(0, payload);

    if (result.error) {
      this.emitter.emit("autherror", result.error);
      throw new Error("Failed to authenticate");
    }

    this.tokens = {
      accessToken: result.accessToken,
    };

    this.authenticated = true;
    this.emitter.emit("authsuccess");
  }

  async query(query: QueryPayload) {
    if (!this.authenticated) {
      try {
        await this.auth();
      } catch (e) {
        throw new Error("Failed to authenticate");
      }
    }

    query.accessToken = this.tokens.accessToken;

    return await this.client.command(2, query);
  }

  async createUser(username: string, password: string) {
    const payload = {
      username,
      password,
      accessToken: this.tokens.accessToken
    };

    return await this.client.command(3, payload);
  }

  async removeUser(username: string) {
    const payload = {
      username,
      accessToken: this.tokens.accessToken
    };

    return await this.client.command(4, payload);
  }

  collectionWrapper(collectionName: string) {
    return {
      find: (query: object, options?: QueryOptions) => this.query({ collection: collectionName, operation: "find", data: { query, options } }),
      insert: (query: object) => this.query({ collection: collectionName, operation: "insert", data: { query } }),
      update: (query: object, operations: object, options?: QueryOptions) => this.query({ collection: collectionName, operation: "update", data: { query, operations, options } }),
      remove: (query: object, options?: QueryOptions) => this.query({ collection: collectionName, operation: "remove", data: { query, options } }),
      drop: () => this.query({ collection: collectionName, operation: "drop" })
    };
  }
}
