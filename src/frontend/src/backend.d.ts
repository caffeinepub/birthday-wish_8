import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Wish {
    visitorName: string;
    timestamp: bigint;
    wishText: string;
}
export interface BirthdayProfile {
    giftBoxColor: string;
    birthdayDate: string;
    bowStyle: string;
    senderName: string;
    surpriseMessage: string;
    ribbonColor: string;
    backgroundTheme: string;
    recipientName: string;
    personalNote: string;
}
export interface backendInterface {
    addWish(visitorName: string, wishText: string): Promise<void>;
    clearWishes(): Promise<void>;
    getAllWishes(): Promise<Array<Wish>>;
    getBirthdayProfile(): Promise<BirthdayProfile>;
    setBirthdayProfile(profile: BirthdayProfile): Promise<void>;
}
