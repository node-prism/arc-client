import { CommandClient } from "@prsm/duplex";

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

type RefreshPayload = {
  accessToken: string;
  refreshToken: string;
};

export class ArcClient {
  public readonly client: CommandClient;
  private authenticated = false;
  private username: string;
  private password: string;
  private tokens: { accessToken: string; refreshToken: string };

  constructor({ host, port, secure, username, password }) {
    this.client = new CommandClient({ host, port, secure });
    this.username = username;
    this.password = password;
  }

  async refresh() {
    const { accessToken, refreshToken } = this.tokens;
    const result: { error?: string, accessToken?: string, refreshToken?: string } = await this.client.command(1, { accessToken, refreshToken });

    if (result.error) {
      throw new Error("Failed to refresh tokens");
    }

    this.tokens = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    };
  }

  async auth() {
    const payload = {
      username: this.username,
      password: this.password
    };

    const result: { error?: string, accessToken?: string, refreshToken?: string } = await this.client.command(0, payload);

    if (result.error) {
      throw new Error("Failed to authenticate");
    }

    this.tokens = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    };

    this.authenticated = true;
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

    let result;

    result = await this.client.command(2, query);

    if (result.error) {
      try {
        await this.refresh();
      } catch (e) {
        throw new Error("Failed to refresh tokens");
      }

      return await this.query(query);
    }

    return result;
  }
}

async function main() {
  const arc = new ArcClient({
    host: "localhost",
    port: 3351,
    secure: false,
    username: "root",
    password: "root"
  });

  let result = await arc.query({ collection: "planets", operation: "drop" });
  console.log("Drop result", result);
  result = await arc.query({
    collection: "planets",
    operation: "insert",
    data: {
      query: [{ name: "Mercury" }, { name: "Venus" }, { name: "Earth" }, { name: "Mars" }],
    },
  });
  console.log("Insert result", result);
  result = await arc.query({
    collection: "planets",
    operation: "find",
    data: {
      query: { name: { $includes: "M" } },
    },
  });
  console.log("Find result", result);
}

main();
