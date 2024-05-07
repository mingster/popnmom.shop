"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useStoreModal } from "@/hooks/admin/use-store-modal";
import { signIn, signOut, useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

//if the signed user doesn't have a store, 
//store dialog will be opened for the user to enter store setup wizard..
const SetupStorePage = () => {

  const chk = useSession();
  let email = chk.data?.user?.email as string;
  //if (!email) email = '';
  if (!email) {
    redirect('/api/auth/signin');
  }

  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};
 
export default SetupStorePage;
