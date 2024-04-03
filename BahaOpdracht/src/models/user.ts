export class User {
    // private fields
    private _id: number;
    private _username: string;
    private _email: string;
    private _firstname: string;
    private _lastname: string;
    private _pfp: string; // Add the profile picture property

    // Constructor
    public constructor(id: number, username: string, email: string, firstname: string, lastname: string, pfp: string) {
        this._id = id;
        this._username = username;
        this._email = email;
        this._firstname = firstname;
        this._lastname = lastname;
        this._pfp = pfp;
    }

    // Getters and setters
    public get id(): number {
        return this._id;
    }

    public get username(): string {
        return this._username;
    }

    public get email(): string {
        return this._email;
    }

    public get firstname(): string {
        return this._firstname;
    }

    public get lastname(): string {
        return this._lastname;
    }

    public get pfp(): string {
        return this._pfp;
    }

    public set id(value: number) {
        this._id = value;
    }

    public set username(value: string) {
        this._username = value;
    }

    public set email(value: string) {
        this._email = value;
    }

    public set firstname(value: string) {
        this._firstname = value;
    }

    public set lastname(value: string) {
        this._lastname = value;
    }

    public set pfp(value: string) {
        this._pfp = value;
    }

    public toString(): string {
        return `User: ${this._id} ${this._username} ${this._email} ${this._firstname} ${this._lastname} ${this._pfp}`;
    }
}
