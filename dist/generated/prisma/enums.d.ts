export declare const Role: {
    readonly TENANT: "TENANT";
    readonly LANDLORD: "LANDLORD";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const Status: {
    readonly ACTIVE: "ACTIVE";
    readonly BANNED: "BANNED";
};
export type Status = (typeof Status)[keyof typeof Status];
export declare const RentalRequestStatus: {
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
};
export type RentalRequestStatus = (typeof RentalRequestStatus)[keyof typeof RentalRequestStatus];
export declare const PaymentStatus: {
    readonly UNPAID: "UNPAID";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
    readonly CANCELLED: "CANCELLED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const PropertyStatus: {
    readonly AVAILABLE: "AVAILABLE";
    readonly UNAVAILABLE: "UNAVAILABLE";
};
export type PropertyStatus = (typeof PropertyStatus)[keyof typeof PropertyStatus];
export declare const PropertyCategory: {
    readonly APARTMENT: "APARTMENT";
    readonly HOUSE: "HOUSE";
    readonly VILLA: "VILLA";
    readonly DUPLEX: "DUPLEX";
    readonly STUDIO: "STUDIO";
    readonly OFFICE: "OFFICE";
    readonly COMMERCIAL: "COMMERCIAL";
    readonly SHOP: "SHOP";
};
export type PropertyCategory = (typeof PropertyCategory)[keyof typeof PropertyCategory];
//# sourceMappingURL=enums.d.ts.map