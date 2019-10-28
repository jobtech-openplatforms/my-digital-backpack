export class ItemBase {
    id = '';
    status: 'incomplete' | 'loading' | 'pending' | 'ready' = 'ready';
    dataVersion = 1;
    created?= 0;
}
