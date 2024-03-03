export namespace customTermsShape {
    let agoricNames: any;
    let board: any;
    let assetPublisher: any;
}
export const privateArgsShape: import("@endo/patterns").Matcher;
export function publishDepositFacet(address: string, wallet: import('./smartWallet.js').SmartWallet, namesByAddressAdmin: ERef<import('@agoric/vats').NameAdmin>): Promise<unknown>;
export function makeAssetRegistry(assetPublisher: AssetPublisher): {
    /** @param {Brand} brand */
    has: (brand: Brand) => boolean;
    /** @param {Brand} brand */
    get: (brand: Brand) => {
        brand: Brand;
        displayInfo: DisplayInfo;
        issuer: Issuer;
        petname: import('./types.js').Petname;
    };
    values: () => Iterable<{
        brand: Brand;
        displayInfo: DisplayInfo;
        issuer: Issuer;
        petname: import('./types.js').Petname;
    }>;
};
export function prepare(zcf: ZCF<SmartWalletContractTerms>, privateArgs: {
    storageNode: ERef<StorageNode>;
    walletBridgeManager?: ERef<import("@agoric/vats").ScopedBridgeManager> | undefined;
    walletReviver?: ERef<WalletReviver> | undefined;
}, baggage: import('@agoric/vat-data').Baggage): Promise<{
    creatorFacet: import("@endo/exo/src/exo-makers.js").Guarded<{
        /**
         * @param {string} address
         * @param {ERef<import('@agoric/vats/src/vat-bank.js').Bank>} bank
         * @param {ERef<import('@agoric/vats/src/types.js').NameAdmin>} namesByAddressAdmin
         * @returns {Promise<[wallet: import('./smartWallet.js').SmartWallet, isNew: boolean]>} wallet
         *   along with a flag to distinguish between looking up an existing wallet
         *   and creating a new one.
         */
        provideSmartWallet(address: string, bank: ERef<import('@agoric/vats/src/vat-bank.js').Bank>, namesByAddressAdmin: ERef<import('@agoric/vats/src/types.js').NameAdmin>): Promise<[wallet: {
            handleBridgeAction(actionCapData: import("@endo/marshal").CapData<string | null>, canSpend?: boolean | undefined): Promise<void>;
            getDepositFacet(): import("@endo/exo/src/exo-makers.js").Guarded<{
                receive(payment: Payment<AssetKind>): Promise<Amount<AssetKind>>;
            }>;
            getOffersFacet(): import("@endo/exo/src/exo-makers.js").Guarded<{
                executeOffer(offerSpec: import("./smartWallet.js").OfferSpec): Promise<void>;
                tryExitOffer(offerId: import("./smartWallet.js").OfferId): Promise<void>;
            }>;
            getCurrentSubscriber(): Subscriber<import("./smartWallet.js").CurrentWalletRecord>;
            getUpdatesSubscriber(): Subscriber<import("./smartWallet.js").UpdateRecord>;
            getPublicTopics(): {
                current: {
                    description: string;
                    subscriber: Subscriber<import("./smartWallet.js").CurrentWalletRecord>;
                    storagePath: Promise<string>;
                };
                updates: {
                    description: string;
                    subscriber: Subscriber<import("./smartWallet.js").UpdateRecord>;
                    storagePath: Promise<string>;
                };
            };
            repairWalletForIncarnation2(key: any): void;
        } & import("@endo/exo/src/get-interface.js").GetInterfaceGuard<{
            handleBridgeAction(actionCapData: import("@endo/marshal").CapData<string | null>, canSpend?: boolean | undefined): Promise<void>;
            getDepositFacet(): import("@endo/exo/src/exo-makers.js").Guarded<{
                receive(payment: Payment<AssetKind>): Promise<Amount<AssetKind>>;
            }>;
            getOffersFacet(): import("@endo/exo/src/exo-makers.js").Guarded<{
                executeOffer(offerSpec: import("./smartWallet.js").OfferSpec): Promise<void>;
                tryExitOffer(offerId: import("./smartWallet.js").OfferId): Promise<void>;
            }>;
            getCurrentSubscriber(): Subscriber<import("./smartWallet.js").CurrentWalletRecord>;
            getUpdatesSubscriber(): Subscriber<import("./smartWallet.js").UpdateRecord>;
            getPublicTopics(): {
                current: {
                    description: string;
                    subscriber: Subscriber<import("./smartWallet.js").CurrentWalletRecord>;
                    storagePath: Promise<string>;
                };
                updates: {
                    description: string;
                    subscriber: Subscriber<import("./smartWallet.js").UpdateRecord>;
                    storagePath: Promise<string>;
                };
            };
            repairWalletForIncarnation2(key: any): void;
        }> & import("@endo/eventual-send").RemotableBrand<{}, {
            handleBridgeAction(actionCapData: import("@endo/marshal").CapData<string | null>, canSpend?: boolean | undefined): Promise<void>;
            getDepositFacet(): import("@endo/exo/src/exo-makers.js").Guarded<{
                receive(payment: Payment<AssetKind>): Promise<Amount<AssetKind>>;
            }>;
            getOffersFacet(): import("@endo/exo/src/exo-makers.js").Guarded<{
                executeOffer(offerSpec: import("./smartWallet.js").OfferSpec): Promise<void>;
                tryExitOffer(offerId: import("./smartWallet.js").OfferId): Promise<void>;
            }>;
            getCurrentSubscriber(): Subscriber<import("./smartWallet.js").CurrentWalletRecord>;
            getUpdatesSubscriber(): Subscriber<import("./smartWallet.js").UpdateRecord>;
            getPublicTopics(): {
                current: {
                    description: string;
                    subscriber: Subscriber<import("./smartWallet.js").CurrentWalletRecord>;
                    storagePath: Promise<string>;
                };
                updates: {
                    description: string;
                    subscriber: Subscriber<import("./smartWallet.js").UpdateRecord>;
                    storagePath: Promise<string>;
                };
            };
            repairWalletForIncarnation2(key: any): void;
        } & import("@endo/exo/src/get-interface.js").GetInterfaceGuard<{
            handleBridgeAction(actionCapData: import("@endo/marshal").CapData<string | null>, canSpend?: boolean | undefined): Promise<void>;
            getDepositFacet(): import("@endo/exo/src/exo-makers.js").Guarded<{
                receive(payment: Payment<AssetKind>): Promise<Amount<AssetKind>>;
            }>;
            getOffersFacet(): import("@endo/exo/src/exo-makers.js").Guarded<{
                executeOffer(offerSpec: import("./smartWallet.js").OfferSpec): Promise<void>;
                tryExitOffer(offerId: import("./smartWallet.js").OfferId): Promise<void>;
            }>;
            getCurrentSubscriber(): Subscriber<import("./smartWallet.js").CurrentWalletRecord>;
            getUpdatesSubscriber(): Subscriber<import("./smartWallet.js").UpdateRecord>;
            getPublicTopics(): {
                current: {
                    description: string;
                    subscriber: Subscriber<import("./smartWallet.js").CurrentWalletRecord>;
                    storagePath: Promise<string>;
                };
                updates: {
                    description: string;
                    subscriber: Subscriber<import("./smartWallet.js").UpdateRecord>;
                    storagePath: Promise<string>;
                };
            };
            repairWalletForIncarnation2(key: any): void;
        }>>, isNew: boolean]>;
    }>;
}>;
export type SmartWalletContractTerms = {
    agoricNames: ERef<NameHub>;
    board: ERef<import('@agoric/vats').Board>;
    assetPublisher: AssetPublisher;
};
export type NameHub = import('@agoric/vats').NameHub;
export type AssetPublisher = {
    getAssetSubscription: () => ERef<IterableEachTopic<import('@agoric/vats/src/vat-bank.js').AssetDescriptor>>;
};
export type isRevive = boolean;
export type WalletReviver = {
    reviveWallet: (address: string) => Promise<import('./smartWallet.js').SmartWallet>;
    ackWallet: (address: string) => isRevive;
};
export type start = typeof prepare;
//# sourceMappingURL=walletFactory.d.ts.map