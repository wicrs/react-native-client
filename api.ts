export type PermissionSetting = boolean | null;

export enum HubPermission {
    All = "ALL",
    ReadChannels = "READ_CHANNELS",
    WriteChannels = "WRITE_CHANNELS",
    Administrate = "ADMINISTRATE",
    ManageChannels = "MANAGE_CHANNELS",
    Mute = "MUTE",
    Unmute = "UNMUTE",
    Kick = "KICK",
    Ban = "BAN",
    Unban = "UNBAN",
}

export enum ChannelPermission {
    Write = "WRITE",
    Read = "READ",
    Manage = "MANAGE",
    All = "ALL",
}

export interface HubMember {
    user_id: string;
    joined: Date;
    groups: string[];
    hub_permissions: Map<HubPermission, PermissionSetting>;
    channel_permissions: Map<string, Map<ChannelPermission, PermissionSetting>>;
}

export interface Channel {
    id: string;
    name: string;
    description: string;
    hub_id: string;
    created: Date;
}

export interface Message {
    id: string;
    hub_id: string;
    channel_id: string;
    sender: string;
    created: Date;
    content: string;
}

export interface PermissionGroup {
    id: string;
    name: string;
    members: string[];
    hub_permissions: Map<HubPermission, PermissionSetting>;
    channel_permissions: Map<string, Map<ChannelPermission, PermissionSetting>>;
    created: Date;
}

export interface Hub {
    id: string;
    name: string;
    description: string;
    created: Date;
    members: Map<string, HubMember>;
    channels: Map<string, Channel>;
    groups: Map<string, PermissionGroup>;
    default_group: string;
    owner: string;
    banned: string[];
    mutes: string[];
}

export interface MemberStatus {
    member: string;
    banned: boolean;
    muted: boolean;
}

export type Result<T> = {
    success?: T;
    error?: string;
}

class MessagesAfterQuery {
    from: string;
    max: number;
    constructor(from: string, max: number) {
        this.from = from;
        this.max = max;
    }
}

class MessagesTimePeriodQuery {
    from: Date;
    to: Date;
    max: number;
    new_to_old: boolean;
    constructor(from: Date, to: Date, max: number, new_to_old: boolean) {
        this.from = from;
        this.to = to;
        this.max = max;
        this.new_to_old = new_to_old;
    }
}

export interface HubUpdate {
    name?: string;
    description?: string;
    default_group?: string;
}

export interface ChannelUpdate {
    name?: string;
    description?: string;
}

export interface ServerInfo {
    version: string;
}

export class HttpClient {
    base_url: string;
    auth: string;
    constructor(base_url: string, auth: string) {
        this.base_url = base_url;
        this.auth = auth;
    }

    async http<T>(url: RequestInfo, init: RequestInit = {
        method: "GET", headers: {
            "Authorization": this.auth
        }
    }): Promise<T> {
        const response = await fetch(url, init);
        const json = await response.json();
        const result: Result<T> = json as Result<T>;
        if (result.success !== undefined) {
            return result.success;
        } else {
            throw new Error(result.error);
        }
    }

    async post<T>(url: RequestInfo, body?: any): Promise<T> {
        let body_text = "";
        let content_type = "";
        if (body !== undefined) {
            body_text = JSON.stringify(body);
            content_type = "application/json";
        }
        return await this.http(url, {
            method: "POST",
            headers: {
                "Authorization": this.auth,
                "Content-type": content_type
            },
            body: body_text
        });
    }

    async put<T>(url: RequestInfo, body?: string): Promise<T> {
        return await this.http(url, {
            method: "PUT",
            headers: {
                "Authorization": this.auth,
                "Content-type": "application/json"
            },
            body: body
        });
    }

    async delete<T>(url: RequestInfo): Promise<T> {
        return await this.http(url, {
            method: "DELETE",
            headers: {
                "Authorization": this.auth
            }
        });
    }

    public async getHub(id: string): Promise<Hub> {
        console.log("Getting hub " + id);
        return await this.http(this.base_url + "/hub/" + id);
    }

    public async createHub(name?: string, description?: string): Promise<string> {
        console.log("Creating hub " + name);
        return await this.post(this.base_url + "/hub", { name: name, description: description });
    }

    public async deleteHub(id: string): Promise<string> {
        console.log("Deleting hub " + id);
        return await this.http(this.base_url + "/hub/" + id);
    }

    public async updateHub(id: string, update: HubUpdate): Promise<HubUpdate> {
        console.log("Updating hub " + id);
        return await this.put(this.base_url + "/hub/" + id, JSON.stringify(update));
    }

    public async joinHub(hub_id: string): Promise<string> {
        console.log("Joining hub " + hub_id);
        return await this.post(this.base_url + "/hub/" + hub_id + "/join");
    }

    public async leaveHub(hub_id: string): Promise<string> {
        console.log("Leaving hub " + hub_id);
        return await this.post(this.base_url + "/hub/" + hub_id + "/leave");
    }

    public async getChannel(hub_id: string, channel_id: string): Promise<Channel> {
        console.log("Getting channel " + channel_id + " in hub " + hub_id);
        return await this.http(this.base_url + "/channel/" + hub_id + "/" + channel_id);
    }

    public async updateChannel(hub_id: string, channel_id: string, update: ChannelUpdate): Promise<ChannelUpdate> {
        console.log("Updating channel " + channel_id + " in hub " + hub_id);
        return await this.put(this.base_url + "/channel/" + hub_id + "/" + channel_id, JSON.stringify(update));
    }

    public async deleteChannel(hub_id: string, channel_id: string): Promise<string> {
        console.log("Deleting channel " + channel_id + " in hub " + hub_id);
        return await this.delete(this.base_url + "/channel/" + hub_id + "/" + channel_id);
    }

    public async createChannel(hub_id: string, name?: string, description?: string): Promise<string> {
        console.log("Creating channel " + name + " in hub " + hub_id);
        return await this.post(this.base_url + "/channel/" + hub_id, { name: name, description: description });
    }

    public async getMember(hub_id: string, member_id: string): Promise<HubMember> {
        console.log("Getting member " + member_id + " in hub " + hub_id);
        return await this.http(this.base_url + "/member/" + hub_id + "/" + member_id);
    }

    public async getMemberStatus(hub_id: string, member_id: string): Promise<MemberStatus> {
        console.log("Getting member status " + member_id + " in hub " + hub_id);
        return await this.http(this.base_url + "/member/" + hub_id + "/" + member_id + "/status");
    }

    public async setMemberHubPermission(hub_id: string, member_id: string, permission: HubPermission, setting?: boolean): Promise<MemberStatus> {
        console.log("Setting member permission " + permission + " for member " + member_id + " in hub " + hub_id);
        return await this.put(this.base_url + "/member/" + hub_id + "/" + member_id + "/hub_permission/" + permission, JSON.stringify({ setting: setting }));
    }

    public async setMemberChannelPermission(hub_id: string, member_id: string, channel_id: string, permission: ChannelPermission, setting?: boolean): Promise<MemberStatus> {
        console.log("Setting member permission " + permission + " for member " + member_id + " in channel " + channel_id + " in hub " + hub_id);
        return await this.put(this.base_url + "/member/" + hub_id + "/" + member_id + "/channel_permission/" + channel_id + "/" + permission, JSON.stringify({ setting: setting }));
    }

    public async getMemberHubPermission(hub_id: string, member_id: string, permission: HubPermission): Promise<boolean | undefined> {
        console.log("Getting member permission " + permission + " for member " + member_id + " in hub " + hub_id);
        return await this.http(this.base_url + "/member/" + hub_id + "/" + member_id + "/hub_permission/" + permission);
    }

    public async getMemberChannelPermission(hub_id: string, member_id: string, channel_id: string, permission: ChannelPermission): Promise<boolean | undefined> {
        console.log("Getting member permission " + permission + " for member " + member_id + " in channel " + channel_id + " in hub " + hub_id);
        return await this.http(this.base_url + "/member/" + hub_id + "/" + member_id + "/channel_permission/" + channel_id + "/" + permission);
    }

    public async banMember(hub_id: string, member_id: string): Promise<string> {
        console.log("Banning member " + member_id + " in hub " + hub_id);
        return await this.post(this.base_url + "/member/" + hub_id + "/" + member_id + "/ban");
    }

    public async unbanMember(hub_id: string, member_id: string): Promise<string> {
        console.log("Unbanning member " + member_id + " in hub " + hub_id);
        return await this.post(this.base_url + "/member/" + hub_id + "/" + member_id + "/unban");
    }

    public async muteMember(hub_id: string, member_id: string): Promise<string> {
        console.log("Muting member " + member_id + " in hub " + hub_id);
        return await this.post(this.base_url + "/member/" + hub_id + "/" + member_id + "/mute");
    }

    public async unmuteMember(hub_id: string, member_id: string): Promise<string> {
        console.log("Unmuting member " + member_id + " in hub " + hub_id);
        return await this.post(this.base_url + "/member/" + hub_id + "/" + member_id + "/unmute");
    }

    public async kickMember(hub_id: string, member_id: string): Promise<string> {
        console.log("Kicking member " + member_id + " in hub " + hub_id);
        return await this.post(this.base_url + "/member/" + hub_id + "/" + member_id + "/kick");
    }

    public async sendMessage(hub_id: string, channel_id: string, message: string): Promise<string> {
        console.log("Sending message " + message + " in channel " + channel_id + " in hub " + hub_id);
        return await this.post(this.base_url + "/message/" + hub_id + "/" + channel_id, { message: message });
    }

    public async getMessage(hub_id: string, channel_id: string, message_id: string): Promise<Message> {
        console.log("Getting message " + message_id + " in channel " + channel_id + " in hub " + hub_id);
        return await this.http(this.base_url + "/message/" + hub_id + "/" + channel_id + "/" + message_id);
    }

    public async getMessagesAfter(hub_id: string, channel_id: string, from: string, max: number): Promise<Message[]> {
        console.log("Getting messages after " + from + " in channel " + channel_id + " in hub " + hub_id);
        return await this.http(this.base_url + "/message/" + hub_id + "/" + channel_id + "/after", {
            method: "GET",
            headers: {
                "Authorization": this.auth,
                "Content-type": "application/json"
            },
            body: JSON.stringify({ from: from, max: max })
        });
    }

    public async getMesssagesTimeRange(hub_id: string, channel_id: string, from: Date, to: Date, max: number, new_to_old: boolean): Promise<Message[]> {
        console.log("Getting messages in time range " + from + " to " + to + " in channel " + channel_id + " in hub " + hub_id);
        return await this.http(this.base_url + "/message/" + hub_id + "/" + channel_id + "/time_period", {
            method: "GET",
            headers: {
                "Authorization": this.auth,
                "Content-type": "application/json"
            },
            body: JSON.stringify({ from: from, to: to, max: max, new_to_old: new_to_old })
        });
    }

    public async graphQL(query: string, variables?: any): Promise<any> {
        console.log("Sending graphQL query.");
        const response = await fetch(this.base_url + "/graphql", {
            method: "POST",
            headers: {
                "Authorization": this.auth,
                "Content-type": "application/json"
            },
            body: JSON.stringify({ query: query, variables: variables })
        });

        return await response.json();
    }
}