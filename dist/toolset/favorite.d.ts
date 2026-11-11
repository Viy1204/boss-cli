export type FavoriteCommand = {
    kind: 'set';
    candidateTarget: string;
    candidateIndex?: number;
    desired: 'saved' | 'unsaved';
} | {
    kind: 'list';
};
export declare function runFavorite(command: FavoriteCommand): Promise<string>;
//# sourceMappingURL=favorite.d.ts.map