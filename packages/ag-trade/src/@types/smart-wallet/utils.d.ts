export const NO_SMART_WALLET_ERROR: "no smart wallet";
export function makeWalletStateCoalescer(invitationBrand?: Brand<"set"> | undefined): {
    state: {
        invitationsReceived: Map<import("./offers.js").OfferId, {
            acceptedIn: import('./offers.js').OfferId;
            description: string;
            instance: Instance;
        }>;
        offerStatuses: Map<import("./offers.js").OfferId, import("./offers.js").OfferStatus>;
        balances: Map<Brand<AssetKind>, Amount<AssetKind>>;
    };
    update: (updateRecord: import('./smartWallet.js').UpdateRecord | {}) => void;
};
export function coalesceUpdates(updates: ERef<Subscriber<import('./smartWallet.js').UpdateRecord>>, invitationBrand?: Brand<"set"> | undefined): {
    invitationsReceived: Map<import("./offers.js").OfferId, {
        acceptedIn: import('./offers.js').OfferId;
        description: string;
        instance: Instance;
    }>;
    offerStatuses: Map<import("./offers.js").OfferId, import("./offers.js").OfferStatus>;
    balances: Map<Brand<AssetKind>, Amount<AssetKind>>;
};
export function assertHasData(follower: import('@agoric/casting').Follower<any>): Promise<void>;
export function objectMapStoragePath(subscribers?: import("./types.js").PublicSubscribers | import("@agoric/zoe/src/contractSupport/topics.js").TopicsRecord | undefined): ERef<Record<string, string>> | null;
export type CoalescedWalletState = ReturnType<typeof makeWalletStateCoalescer>['state'];
//# sourceMappingURL=utils.d.ts.map