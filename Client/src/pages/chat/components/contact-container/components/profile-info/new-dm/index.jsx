import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lottie from "lottie-react";
import a from "@/assets/animation.json";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
const NewDM = () => {
  const { setSelectedChatType, 
  setSelectedChatData, 
  setDirectMessagesContact, 
  directMessagesContact  } = useAppStore();
  const [openNewContact, setOpenNewContact] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        } else {
          setSearchedContacts([]);
        }
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
      setSearchedContacts([]);
    }
  };
  const selectNewContact = (contact) => {
    setOpenNewContact(false);
    setSelectedChatType("contact")
    setSelectedChatData(contact)
    setSearchedContacts([]);

  };
  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <FaPlus
            className="text-neutral-500 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
            onClick={() => {
              setOpenNewContact(true);
            }}
          />
        </TooltipTrigger>
        <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
          Select New Contact
        </TooltipContent>
      </Tooltip>
      <Dialog open={openNewContact} onOpenChange={setOpenNewContact}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={() => selectNewContact(contact)}
                >
                  <div className="w-12 h-12 relative">
                    <Avatar className="h-12 w-12 rounded-full bg-black overflow-hidden">
                      {contact.image ? (
                        <AvatarImage
                          src={`${HOST}/${contact.image}`}
                          alt="profile"
                          className="object-cover w-full h-full bg-black rounded-full"
                        />
                      ) : (
                        <AvatarFallback
                          className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                            contact.colour
                          )}`}
                        >
                          {contact.firstName
                            ? contact.firstName.charAt(0)
                            : contact.email.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col ">
                    <span>
                      {" "}
                      {contact.firstName && contact.lastName
                        ? `${contact.firstName} ${contact.lastName}`
                        : contact.email}
                    </span>
                    <span className="text-xs">{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {searchedContacts.length <= 0 && (
            <div className="flex-1 flex flex-col justify-center items-center duration-100 mb-15 transition-all md:mt-5">
              <div className="h-[100px] w-[100px]">
                <Lottie loop={true} animationData={a}></Lottie>
              </div>
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-3 lg:text-2xl text-xl transition-all duration-300 text-center ">
                <h3 className="poppins-medium">
                  Hey <span className="text-purple-500">!</span> Search New
                  <span className="text-purple-500"> Contact.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
