export function watchOfferOutcomes(watchers: OutcomeWatchers, seat: UserSeat): Promise<[unknown, 0 | 1, PaymentPKeywordRecord]>;
export function prepareOfferWatcher(baggage: import('@agoric/vat-data').Baggage): (walletHelper: any, deposit: any, offerSpec: import("./offers.js").OfferSpec, address: string, invitationAmount: Amount<"set">, seatRef: UserSeat<unknown>) => import("@endo/exo/src/exo-makers.js").GuardedKit<{
    helper: {
        /**
         * @param {Record<string, unknown>} offerStatusUpdates
         */
        updateStatus(offerStatusUpdates: Record<string, unknown>): void;
        onNewContinuingOffer(offerId: any, invitationAmount: any, invitationMakers: any, publicSubscribers: any): void;
        /** @param {unknown} result */
        publishResult(result: unknown): void;
        /**
         * Called when the offer result promise rejects. The other two watchers
         * are waiting for particular values out of Zoe but they settle at the same time
         * and don't need their own error handling.
         * @param {Error} err
         */
        handleError(err: Error): void;
    };
    /** @type {OutcomeWatchers['paymentWatcher']} */
    paymentWatcher: OutcomeWatchers['paymentWatcher'];
    /** @type {OutcomeWatchers['resultWatcher']} */
    resultWatcher: OutcomeWatchers['resultWatcher'];
    /** @type {OutcomeWatchers['numWantsWatcher']} */
    numWantsWatcher: OutcomeWatchers['numWantsWatcher'];
}>;
export type OfferStatus = import('./offers.js').OfferSpec & {
    error?: string;
    numWantsSatisfied?: number;
    result?: unknown | typeof import('./offers.js').UNPUBLISHED_RESULT;
    payouts?: AmountKeywordRecord;
};
/**
 * <T, [UserSeat]
 */
export type OfferPromiseWatcher<T extends unknown> = import('@agoric/swingset-liveslots').PromiseWatcher<T, [UserSeat]>;
export type OutcomeWatchers = {
    resultWatcher: OfferPromiseWatcher<unknown>;
    numWantsWatcher: OfferPromiseWatcher<number>;
    paymentWatcher: OfferPromiseWatcher<PaymentPKeywordRecord>;
};
export type MakeOfferWatcher = ReturnType<typeof prepareOfferWatcher>;
//# sourceMappingURL=offerWatcher.d.ts.map