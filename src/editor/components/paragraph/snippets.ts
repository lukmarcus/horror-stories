export interface SnippetItem {
  label: string;
  snippet: string;
  cursorFromEnd?: number;
  displayColor?: string;
}

export const SPAN_SNIPPETS: SnippetItem[] = [
  {
    label: "§ paragraf",
    snippet: "<span class='color-green'>§</span>",
    cursorFromEnd: 7,
    displayColor: "#4caf50",
  },
  {
    label: "UWAGA",
    snippet: "<span class='color-red'>UWAGA</span>",
    displayColor: "#cc4444",
  },
  {
    label: "nagroda",
    snippet: "<span class='color-blue'>nagroda</span>",
    displayColor: "#5599cc",
  },
  {
    label: "NEWS",
    snippet: "<span class='color-purple'>NEWS</span>",
    displayColor: "#9966cc",
  },
];
