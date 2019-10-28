export class CommandBase {
    id?: string;
    userId?: string;
    type = '';
    data: any;
    result?: 'inProcess' | 'success' | 'failure';
}
