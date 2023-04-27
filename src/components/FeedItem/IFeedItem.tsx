export interface IFeedItem {
    id: number;
    author: string;
    title: string;
    content: string;
    created_datetime: string;
    onDelete?: () => void;
    onEdit?: (newTitle: string, newContent: string) => void;
}