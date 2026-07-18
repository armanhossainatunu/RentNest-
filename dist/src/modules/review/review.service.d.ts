export declare const reviewService: {
    createReview: (payload: {
        propertyId: string;
        authorId: string;
        rating: number;
        comment: string;
    }) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        propertyId: string;
        rating: number;
        comment: string;
    }>;
};
//# sourceMappingURL=review.service.d.ts.map