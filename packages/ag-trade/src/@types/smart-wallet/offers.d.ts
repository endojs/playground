/**
 * @typedef {number | string} OfferId
 */
/**
 * @typedef {{
 *   id: OfferId,
 *   invitationSpec: import('./invitations.js').InvitationSpec,
 *   proposal: Proposal,
 *   offerArgs?: unknown
 * }} OfferSpec
 */
/** Value for "result" field when the result can't be published */
export const UNPUBLISHED_RESULT: "UNPUBLISHED";
export type OfferId = number | string;
export type OfferSpec = {
    id: OfferId;
    invitationSpec: import('./invitations.js').InvitationSpec;
    proposal: Proposal;
    offerArgs?: unknown;
};
export type OfferStatus = import('./offers.js').OfferSpec & {
    error?: string;
    numWantsSatisfied?: number;
    result?: unknown | typeof UNPUBLISHED_RESULT;
    payouts?: AmountKeywordRecord;
};
//# sourceMappingURL=offers.d.ts.map