export interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    };
    product: string;
    order: string;
    rating: number;
    title?: string;
    comment: string;
    images: string[];
    isVerifiedPurchase: boolean;
    createdAt: string;
    updatedAt: string;
}
