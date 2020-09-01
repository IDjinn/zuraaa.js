

export class Endpoints {
    private formatedUrl: string;
    constructor(public readonly secure: boolean, public readonly baseUrl: string, public readonly port = 80) {
        this.formatedUrl = secure ? 'https://' : 'http://' + baseUrl + ':' + port + '/api';
    }

    get bots() {
        return {
            index: () => this.formatedUrl + '/bots/',
            id: (botId: string) => this.formatedUrl + '/bots/' + botId,
            fetch: (limit?: number, after?: number) => this.formatedUrl + `/bots?limit${limit}&after=${after}`
        }
    }

    get users() {
        return {
            index: () => this.formatedUrl + '/users/',
            id: (userId: string) => this.formatedUrl + '/users/' + userId,
            fetch: (limit?: number, after?: number) => this.formatedUrl + `/users?limit${limit}&after=${after}`
        }
    }
}