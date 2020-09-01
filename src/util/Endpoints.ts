

export class Endpoints {
    private formatedUrl: string;
    constructor(public readonly baseUrl: string, public readonly port = 80) {
        this.formatedUrl = baseUrl + ':' + port + '/api';
    }

    public bots() {
        return {
            index: () => this.formatedUrl + '/bots/',
            id: (botId: string) => this.formatedUrl + '/bots/' + botId,
            fetch: (limit?: number, after?: number) => this.formatedUrl + `/bots?limit${limit}&after=${after}`
        }
    }

    public users() {
        return {
            index: () => this.formatedUrl + '/users/',
            id: (userId: string) => this.formatedUrl + '/users/' + userId,
            fetch: (limit?: number, after?: number) => this.formatedUrl + `/users?limit${limit}&after=${after}`
        }
    }
}