import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { EllipsisVertical } from "lucide-react";
import { Download } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    value,
    subscribeToNewMessages,
    unSubscribeFromNewMessages,
    deleteFromEveryOneMessage,
  } = useChatStore();
  console.log("value", value);

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  useEffect(() => {
    getMessages(selectedUser?._id);
    subscribeToNewMessages();

    return () => {
      unSubscribeFromNewMessages();
    };
  }, [
    selectedUser?._id,
    getMessages,
    value,
    subscribeToNewMessages,
    unSubscribeFromNewMessages,
  ]);
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  const onDeleteMessageFromEveryOne = async (messageId) => {
    // Logic to delete the message
    deleteFromEveryOneMessage(messageId);
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col gap-1 ">
              <EllipsisVertical
                className="self-end cursor-pointer"
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
              />
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] w-[250px] rounded-md mb-2"
                  onClick={() =>
                    document.getElementById("my_modal_4").showModal()
                  }
                />
              )}

              <dialog id="my_modal_4" className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] w-[250px] rounded-md mb-2 mx-auto"
                  />
                  <div className="py-4">
                    <p className="text-sm">Download Image</p>
                    <a
                      target="_blank"
                      href={message.image}
                      download
                      className="cursor-pointer"
                    >
                      <Download  />
                    </a>
                  </div>
                </div>
              </dialog>
              {message.text && <p>{message.text}</p>}
            </div>
            <dialog id="my_modal_3" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <h3 className="font-bold text-lg">
                  Do you want to delete this message?
                </h3>
                <p>Message Will delete permanently from both users..</p>
                <button
                  onClick={() => onDeleteMessageFromEveryOne(message._id)}
                  className="btn my-2 btn-warning"
                >
                  Delete
                </button>
              </div>
            </dialog>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
