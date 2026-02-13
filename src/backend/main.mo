import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  // Type definitions
  type MemoryId = Nat;
  type Author = Principal;
  type Photo = Storage.ExternalBlob;

  public type Memory = {
    id : MemoryId;
    title : Text;
    content : Text;
    timestamp : Time.Time;
    author : Author;
    photo : ?Photo;
  };

  module Memory {
    public func compare(memory1 : Memory, memory2 : Memory) : Order.Order {
      Text.compare(memory1.title, memory2.title);
    };
  };

  // Custom exceptions
  public type MemoryError = {
    #NotFound;
    #Unauthorized;
    #TitleMissing;
    #SerializationError;
  };

  // Internal storage
  var nextMemoryId = 0;
  let memories = Map.empty<MemoryId, Memory>();

  // Core CRUD operations
  public shared ({ caller }) func createMemory(title : Text, content : Text, photo : ?Photo) : async MemoryId {
    if (title.isEmpty()) { Runtime.trap("Title is required") };

    let memoryId = nextMemoryId;
    let memory : Memory = {
      id = memoryId;
      title;
      content;
      timestamp = Time.now();
      author = caller;
      photo;
    };

    memories.add(memoryId, memory);
    nextMemoryId += 1;
    memoryId;
  };

  public query ({ caller }) func getMemory(memoryId : MemoryId) : async ?Memory {
    memories.get(memoryId);
  };

  public query ({ caller }) func getAllMemories() : async [Memory] {
    memories.values().toArray().sort();
  };

  public shared ({ caller }) func updateMemory(memoryId : MemoryId, newTitle : Text, newContent : Text, newPhoto : ?Photo) : async () {
    switch (memories.get(memoryId)) {
      case (null) { Runtime.trap("Memory not found") };
      case (?existingMemory) {
        if (existingMemory.author != caller) { Runtime.trap("Can only edit own memories") };

        let updatedMemory : Memory = {
          id = existingMemory.id;
          title = newTitle;
          content = newContent;
          timestamp = existingMemory.timestamp;
          author = caller;
          photo = newPhoto;
        };

        memories.add(memoryId, updatedMemory);
      };
    };
  };

  public shared ({ caller }) func deleteMemory(memoryId : MemoryId) : async () {
    switch (memories.get(memoryId)) {
      case (null) { Runtime.trap("Memory not found") };
      case (?existingMemory) {
        if (existingMemory.author != caller) { Runtime.trap("Can only delete own memories") };
        memories.remove(memoryId);
      };
    };
  };
};
