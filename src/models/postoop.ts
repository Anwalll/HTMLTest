import { api } from "@hboictcloud/api";

export class Posts {
    private _id: number;
    private _post_ID: number;
    private _title: string;
    private _content: string;
    private _date_created: Date;

    public constructor(id: number, post_ID: number, title: string, content: string, date_created: Date) {
        this._id = id;
        this._post_ID = post_ID;
        this._title = title;
        this._content = content;
        this._date_created = date_created;

    }
    public static getPostById(id: number): any {
        // let result: any = api.queryDatabase("SELECT * FROM post WHERE id=" + id);
        // let returnVar:Posts = new Posts()
        return "resultaat";
    }

    public get id(): number {
        return this._id;
    }

    public get post_ID(): number {
        return this._post_ID;
    }

    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
    }

    public get content(): string {
        return this._content;
    }

    public set content(value: string) {
        this._content = value;
    }

    public get date_created(): Date {
        return this._date_created;
    }

    public set id(value: number) {
        this._id = value;
    }

    public set post_ID(value: number) {
        this._post_ID = value;
    }

    public set date_created(value: Date) {
        this._date_created = value;
    }

    public toString(): string {
        return `Posts: ${this._id} ${this._post_ID} ${this._title} ${
            this._content
        } ${this._date_created.toISOString()}`;
    }
}

// Subclass of Posts for comments
export class Comment extends Posts {
    private _commentContent: string;

    public constructor(
        id: number,
        post_ID: number,
        title: string,
        content: string,
        date_created: Date,
        commentContent: string
    ) {
        super(id, post_ID, title, content, date_created);
        this._commentContent = commentContent;
    }

    public get commentContent(): string {
        return this._commentContent;
    }

    public set commentContent(value: string) {
        this._commentContent = value;
    }
}
