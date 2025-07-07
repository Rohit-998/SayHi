import React, { useEffect } from "react";
import ProfileInfo from "./components/profile-info";
import NewDM from "./components/profile-info/new-dm";
import { apiClient } from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ui/ContactList";

const ContactsContainer = () => {
  const { setDirectMessagesContact, directMessagesContact } = useAppStore();
  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        console.log(response.data.contacts);
        setDirectMessagesContact(response.data.contacts);
      }
    };
    getContacts();
  }, []);
  return (
    <div className="relative md:w-[35vw] lg:w-[20vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages"></Title>
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContact} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels"></Title>
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;
const Logo = () => {
  return (
    <div className="relative p-5 flex justify-start items-center">
      <img
        src="/logo-cropped-64x64.png"
        alt="SayHi Logo"
        className="h-20 w-auto"
      />
      <span className="absolute left-25 text-3xl font-semibold text-white">
        SayHi
      </span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
