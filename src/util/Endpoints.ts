

export class Endpoints {
    private baseUrl: string;
    constructor(public readonly secure: boolean, public readonly ip: string, public readonly port = 80) {
        this.baseUrl = secure ? 'https://' : 'http://' + ip + ':' + port + '/api';
    }

    get bots() {
        return {
            index: () => this.baseUrl + '/bots/',
            id: (botId: string) => this.baseUrl + '/bots/' + botId,
            fetch: (limit?: number = 100, after?: number = 0) => this.baseUrl + `/bots?limit${limit}&after=${after}`
        }
    }

    get users() {
        return {
            index: () => this.baseUrl + '/users/',
            id: (userId: string) => this.baseUrl + '/users/' + userId,
            fetch: (limit?: number = 100, after?: number = 0) => this.baseUrl + `/users?limit${limit}&after=${after}`
        }
    }
}
