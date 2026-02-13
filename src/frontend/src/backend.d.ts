import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Memory {
    id: MemoryId;
    title: string;
    content: string;
    author: Author;
    timestamp: Time;
    photo?: Photo;
}
export type MemoryId = bigint;
export type Author = Principal;
export type Photo = Uint8Array;
export interface backendInterface {
    createMemory(title: string, content: string, photo: Photo | null): Promise<MemoryId>;
    deleteMemory(memoryId: MemoryId): Promise<void>;
    getAllMemories(): Promise<Array<Memory>>;
    getMemory(memoryId: MemoryId): Promise<Memory | null>;
    updateMemory(memoryId: MemoryId, newTitle: string, newContent: string, newPhoto: Photo | null): Promise<void>;
}
