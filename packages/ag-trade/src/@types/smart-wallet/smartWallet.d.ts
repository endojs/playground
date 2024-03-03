export const BRAND_TO_PURSES_KEY: "brandToPurses";
export function prepareSmartWallet(baggage: import('@agoric/vat-data').Baggage, shared: SharedParams): (uniqueWithoutChildNodes: Omit<UniqueParams, "currentStorageNode" | "walletStorageNode"> & {
    walletStorageNode: ERef<StorageNode>;
}) => Promise<import("@endo/exo/src/exo-makers.js").Guarded<{
    /**
     * Umarshals the actionCapData and delegates to the appropriate action handler.
     *
     * @param {import('@endo/marshal').CapData<string | null>} actionCapData of type BridgeAction
     * @param {boolean} [canSpend]
     * @returns {Promise<void>}
     */
    handleBridgeAction(actionCapData: import('@endo/marshal').CapData<string | null>, canSpend?: boolean | undefined): Promise<void>;
    getDepositFacet(): import("@endo/exo/src/exo-makers.js").Guarded<{
        /**
         * Put the assets from the payment into the appropriate purse.
         *
         * If the purse doesn't exist, we hold the payment in durable storage.
         *
         * @param {Payment} payment
         * @returns {Promise<Amount>}
         * @throws if there's not yet a purse, though the payment is held to try again when there is
         */
        receive(payment: Payment): Promise<Amount>;
    }>;
    getOffersFacet(): import("@endo/exo/src/exo-makers.js").Guarded<{
        /**
         * Take an offer description provided in capData, augment it with payments and call zoe.offer()
         *
         * @param {OfferSpec} offerSpec
         * @returns {Promise<void>} after the offer has been both seated and exited by Zoe.
         * @throws if any parts of the offer can be determined synchronously to be invalid
         */
        executeOffer(offerSpec: OfferSpec): Promise<void>;
        /**
         * Take an offer's id, look up its seat, try to exit.
         *
         * @param {OfferId} offerId
         * @returns {Promise<void>}
         * @throws if the seat can't be found or E(seatRef).tryExit() fails.
         */
        tryExitOffer(offerId: OfferId): Promise<void>;
    }>;
    /** @deprecated use getPublicTopics */
    getCurrentSubscriber(): Subscriber<CurrentWalletRecord>;
    /** @deprecated use getPublicTopics */
    getUpdatesSubscriber(): Subscriber<UpdateRecord>;
    getPublicTopics(): {
        current: {
            description: string;
            subscriber: Subscriber<CurrentWalletRecord>;
            storagePath: Promise<string>;
        };
        updates: {
            description: string;
            subscriber: Subscriber<UpdateRecord>;
            storagePath: Promise<string>;
        };
    };
    /**
     * To be called once ever per wallet.
     *
     * @param {object} key
     */
    repairWalletForIncarnation2(key: object): void;
}>>;
export type OfferId = number | string;
export type OfferSpec = {
    id: OfferId;
    invitationSpec: import('./invitations').InvitationSpec;
    proposal: Proposal;
    offerArgs?: unknown;
};
export type ExecutorPowers = {
    logger: {
        info: (...args: any[]) => void;
        error: (...args: any[]) => void;
    };
    makeOfferWatcher: import('./offerWatcher.js').MakeOfferWatcher;
    invitationFromSpec: ERef<Invitation>;
};
export type ExecuteOfferAction = {
    method: 'executeOffer';
    offer: OfferSpec;
};
export type TryExitOfferAction = {
    method: 'tryExitOffer';
    offerId: OfferId;
};
export type BridgeAction = ExecuteOfferAction | TryExitOfferAction;
/**
 * Purses is an array to support a future requirement of multiple purses per brand.
 *
 * Each map is encoded as an array of entries because a Map doesn't serialize directly.
 * We also considered having a vstorage key for each offer but for now are sticking with this design.
 *
 * Cons
 *    - Reserializes previously written results when a new result is added
 *    - Optimizes reads though writes are on-chain (~100 machines) and reads are off-chain (to 1 machine)
 *
 * Pros
 *    - Reading all offer results happens much more (>100) often than storing a new offer result
 *    - Reserialization and writes are paid in execution gas, whereas reads are not
 *
 * This design should be revisited if ever batch querying across vstorage keys become cheaper or reads be paid.
 */
export type CurrentWalletRecord = {
    purses: Array<{
        brand: Brand;
        balance: Amount;
    }>;
    offerToUsedInvitation: Array<[offerId: string, usedInvitation: Amount]>;
    offerToPublicSubscriberPaths: [offerId: string, publicTopics: {
        [subscriberName: string]: string;
    }][];
    liveOffers: Array<[OfferId, import('./offers.js').OfferStatus]>;
};
/**
 * Record of an update to the state of this wallet.
 *
 * Client is responsible for coalescing updates into a current state. See `coalesceUpdates` utility.
 *
 * The reason for this burden on the client is that publishing
 * the full history of offers with each change is untenable.
 *
 * `balance` update supports forward-compatibility for more than one purse per
 * brand. An additional key will be needed to disambiguate. For now the brand in
 * the amount suffices.
 */
export type UpdateRecord = {
    updated: 'offerStatus';
    status: import('./offers.js').OfferStatus;
} | {
    updated: 'balance';
    currentAmount: Amount;
} | {
    updated: 'walletAction';
    status: {
        error: string;
    };
};
/**
 * For use by clients to describe brands to users. Includes `displayInfo` to save a remote call.
 */
export type BrandDescriptor = {
    brand: Brand;
    displayInfo: DisplayInfo;
    issuer: Issuer;
    petname: import('./types.js').Petname;
};
export type UniqueParams = {
    address: string;
    bank: ERef<import('@agoric/vats/src/vat-bank.js').Bank>;
    currentStorageNode: StorageNode;
    invitationPurse: Purse<'set'>;
    walletStorageNode: StorageNode;
};
export type BrandDescriptorRegistry = Pick<MapStore<Brand, BrandDescriptor>, 'has' | 'get' | 'values'>;
export type SharedParams = {
    agoricNames: ERef<import('@agoric/vats').NameHub>;
    registry: BrandDescriptorRegistry;
    invitationIssuer: Issuer<'set'>;
    invitationBrand: Brand<'set'>;
    invitationDisplayInfo: DisplayInfo;
    publicMarshaller: Marshaller;
    zoe: ERef<ZoeService>;
    secretWalletFactoryKey: any;
};
/**
 * - `brandPurses` is precious and closely held. defined as late as possible to reduce its scope.
 * - `offerToInvitationMakers` is precious and closely held.
 * - `offerToPublicSubscriberPaths` is precious and closely held.
 * - `purseBalances` is a cache of what we've received from purses. Held so we can publish all balances on change.
 */
export type State = ImmutableState & MutableState;
export type ImmutableState = Readonly<UniqueParams & {
    paymentQueues: MapStore<Brand, Array<Payment>>;
    offerToInvitationMakers: MapStore<string, import('./types.js').InvitationMakers>;
    offerToPublicSubscriberPaths: MapStore<string, Record<string, string>>;
    offerToUsedInvitation: MapStore<string, Amount<'set'>>;
    purseBalances: MapStore<Purse, Amount>;
    updateRecorderKit: import('@agoric/zoe/src/contractSupport/recorder.js').RecorderKit<UpdateRecord>;
    currentRecorderKit: import('@agoric/zoe/src/contractSupport/recorder.js').RecorderKit<CurrentWalletRecord>;
    liveOffers: MapStore<OfferId, import('./offers.js').OfferStatus>;
    liveOfferSeats: MapStore<OfferId, UserSeat<unknown>>;
    liveOfferPayments: MapStore<OfferId, MapStore<Brand, Payment>>;
}>;
export type PurseRecord = BrandDescriptor & {
    purse: Purse;
};
export type MutableState = {};
export type SmartWallet = Awaited<ReturnType<ReturnType<typeof prepareSmartWallet>>>;
//# sourceMappingURL=smartWallet.d.ts.map