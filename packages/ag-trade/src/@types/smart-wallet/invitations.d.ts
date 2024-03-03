export function makeInvitationsHelper(zoe: ERef<ZoeService>, agoricNames: ERef<import('@agoric/vats').NameHub>, invitationBrand: Brand<'set'>, invitationsPurse: Purse<'set'>, getInvitationContinuation: (fromOfferId: string) => import('./types.js').InvitationMakers): (spec: InvitationSpec) => ERef<Invitation>;
/**
 * Specify how to produce an invitation. See each type in the union for details.
 */
export type InvitationSpec = AgoricContractInvitationSpec | ContractInvitationSpec | PurseInvitationSpec | ContinuingInvitationSpec;
/**
 * source of invitation is a chain of calls starting with an agoricName
 * - the start of the pipe is a lookup of instancePath within agoricNames
 * - each entry in the callPipe executes a call on the preceding result
 * - the end of the pipe is expected to return an Invitation
 */
export type AgoricContractInvitationSpec = {
    source: 'agoricContract';
    instancePath: string[];
    callPipe: Array<[methodName: string, methodArgs?: any[]]>;
};
/**
 * source is a contract (in which case this takes an Instance to look up in zoe)
 */
export type ContractInvitationSpec = {
    source: 'contract';
    instance: Instance;
    publicInvitationMaker: string;
    invitationArgs?: any[];
};
/**
 * the invitation is already in your Zoe "invitation" purse so we need to query it
 * - use the find/query invitation by kvs thing
 */
export type PurseInvitationSpec = {
    source: 'purse';
    instance: Instance;
    description: string;
};
/**
 * continuing invitation in which the offer result from a previous invitation had an `invitationMakers` property
 */
export type ContinuingInvitationSpec = {
    source: 'continuing';
    previousOffer: import('./offers.js').OfferId;
    invitationMakerName: string;
    invitationArgs?: any[];
};
export type InvitationsPurseQuery = Pick<InvitationDetails, 'description' | 'instance'>;
//# sourceMappingURL=invitations.d.ts.map