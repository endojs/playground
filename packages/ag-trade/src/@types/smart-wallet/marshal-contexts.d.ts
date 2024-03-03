export function makeExportContext(): {
    toCapData: import("@endo/marshal/src/marshal").ToCapData<string>;
    fromCapData: import("@endo/marshal/src/marshal").FromCapData<string>;
    serialize: import("@endo/marshal/src/marshal").ToCapData<string>;
    unserialize: import("@endo/marshal/src/marshal").FromCapData<string>;
    savePurseActions: (val: Purse<AssetKind>) => void;
    savePaymentActions: (val: Payment<AssetKind>) => void;
    /**
     * @param {number} id
     * @param {Purse} purse
     */
    initPurseId: (id: number, purse: Purse) => void;
    purseEntries: (keyPatt?: any, valuePatt?: any) => Iterable<[number, Purse<AssetKind>]>;
    /**
     * @param {BoardId} id
     * @param {unknown} val
     */
    initBoardId: (id: BoardId, val: unknown) => void;
    /**
     * @param {BoardId} id
     * @param {unknown} val
     */
    ensureBoardId: (id: BoardId, val: unknown) => void;
};
export function makeImportContext(makePresence?: ((iface: string) => unknown) | undefined): {
    /**
     * @param {BoardId} id
     * @param {unknown} val
     */
    initBoardId: (id: BoardId, val: unknown) => void;
    /**
     * @param {BoardId} id
     * @param {unknown} val
     */
    ensureBoardId: (id: BoardId, val: unknown) => void;
    fromMyWallet: {
        toCapData: import("@endo/marshal/src/marshal").ToCapData<string>;
        fromCapData: import("@endo/marshal/src/marshal").FromCapData<string>;
        serialize: import("@endo/marshal/src/marshal").ToCapData<string>;
        unserialize: import("@endo/marshal/src/marshal").FromCapData<string>;
    } & import("@endo/eventual-send").RemotableBrand<{}, {
        toCapData: import("@endo/marshal/src/marshal").ToCapData<string>;
        fromCapData: import("@endo/marshal/src/marshal").FromCapData<string>;
        serialize: import("@endo/marshal/src/marshal").ToCapData<string>;
        unserialize: import("@endo/marshal/src/marshal").FromCapData<string>;
    }>;
    fromBoard: {
        toCapData: import("@endo/marshal/src/marshal").ToCapData<string>;
        fromCapData: import("@endo/marshal/src/marshal").FromCapData<string>;
        serialize: import("@endo/marshal/src/marshal").ToCapData<string>;
        unserialize: import("@endo/marshal/src/marshal").FromCapData<string>;
    } & import("@endo/eventual-send").RemotableBrand<{}, {
        toCapData: import("@endo/marshal/src/marshal").ToCapData<string>;
        fromCapData: import("@endo/marshal/src/marshal").FromCapData<string>;
        serialize: import("@endo/marshal/src/marshal").ToCapData<string>;
        unserialize: import("@endo/marshal/src/marshal").FromCapData<string>;
    }>;
};
export function makeLoggingPresence(iface: string, log: (parts: unknown[]) => void): any;
export type BoardId = import('@agoric/vats/src/lib-board.js').BoardId;
/**
 * <T>
 */
export type WalletSlot<T extends Record<string, IdTable<any, any>>> = `${string & keyof T}:${Digits}`;
/**
 * <K>
 */
export type KindSlot<K extends string> = `${K}:${Digits}`;
/**
 * <T>
 */
export type MixedSlot<T extends Record<string, IdTable<any, any>>> = WalletSlot<T> | BoardId;
/**
 * - 1 or more digits.
 * NOTE: the typescript definition here is more restrictive than
 * actual usage.
 */
export type Digits = `1` | `12` | `123`;
/**
 * <Value>
 */
export type IdTable<Slot, Val> = {
    bySlot: MapStore<Slot, Val>;
    byVal: MapStore<Val, Slot>;
};
export type ExportContext = ReturnType<typeof makeExportContext>;
export type ImportContext = ReturnType<typeof makeImportContext>;
//# sourceMappingURL=marshal-contexts.d.ts.map