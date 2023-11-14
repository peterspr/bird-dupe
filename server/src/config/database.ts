import * as mongoose from "mongoose";

export class Database {
    uri: string | undefined;
    options: any;
    constructor(uri: string | undefined, options: any) {
        this.uri = uri;
        this.options = options;
    }

    async connect() {
        try {
            if (this.uri === undefined) {
                throw Error("DB URI does not exist in environment.");
            }
            else {
                await mongoose.connect(this.uri);
                console.log(`Connected to database`);
            }
        } catch(error) {
            throw error;
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            console.log(`Disconnected to database`)
        } catch(error) {
            throw error;
        }
    }
}