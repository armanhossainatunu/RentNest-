import { Response } from "express";
type Tmata = {
    limit: number;
    page: number;
    total: number;
};
type TResponseData<T> = {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta?: Tmata;
};
export declare const sendResponse: <T>(res: Response, data: TResponseData<T>) => void;
export {};
//# sourceMappingURL=sendResponse.d.ts.map