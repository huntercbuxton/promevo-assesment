
export interface LabelColorData {
  textColor: string;
  backgroundColor: string;
}

// 1. Define the TypeScript interface for your row data
export interface LabelData {
  id: string;
  name: string;
  type: string;
  messageListVisibility: string;
  labelListVisibility: string;
  color?: LabelColorData;
  messagesTotal?: number;
  messagesUnread?: number;
  threadsTotal?: number;
  threadsUnread?: number; 
}


// 3. Mock data adhering to the UserRow interface
export const mock_labels_data_list: LabelData[] = [
  { 
    id: 'Mock_Label', 
    name: 'mock_label', 
    labelListVisibility: 'labelHide', 
    messageListVisibility: 'show', 
    color: { backgroundColor: "#42d692", textColor: "#ffffff" }, 
    messagesTotal: 2, 
    messagesUnread: 2, 
    threadsTotal: 1, 
    threadsUnread: 1, 
    type: 'user' 
  },
  { 
    id: 'Mock_Label_nocolor', 
    name: 'no_color_label', 
    labelListVisibility: 'labelHide', 
    messageListVisibility: 'show', 
    type: 'user'  
  },
  { id: 'black_and_purple_label', 
    name: 'black_and_purple_label', 
    labelListVisibility: 'labelHide', 
    messageListVisibility: 'show', 
    color: { backgroundColor: "#653e9b", textColor: "#000000" }, 
    messagesTotal: 10, 
    messagesUnread: 1, 
    threadsTotal: 5,
    threadsUnread: 3, 
    type: 'user'  
  } 
];