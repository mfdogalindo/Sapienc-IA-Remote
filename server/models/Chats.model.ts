export interface Message {
   id?: string;
   text: string;
   sender: string;
   createdAt: number;
 }

 export interface Chat {
   id: string;
   name: string;
   messages?: Record<string, Message>;
   createdAt: number;
   updatedAt: number;
   system?: string;
}