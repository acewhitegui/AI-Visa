"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/app/components/ui/shadcn/sidebar"
import {ChevronDown, ChevronUp, EditIcon, Home, User2} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/app/components/ui/shadcn/dropdown-menu";
import React, {useCallback, useEffect, useState} from "react";
import {Link} from "@/i18n/routing";
import {Conversation, Product} from "@/app/library/objects/types";
import {
  createNewConversation,
  deleteConversation,
  getConversationList,
  updateConversationName
} from "@/app/library/services/conversation_service";
import {signOut, useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import {toast} from "sonner";
import {Button} from "@/app/components/ui/shadcn/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/app/components/ui/shadcn/alert-dialog";
import {IoAddCircle} from "react-icons/io5";
import Logo from "@/app/components/ui/Logo";
import {env} from "next-runtime-env";


export function AppSidebar({defaultProductName, productList}: {
  defaultProductName: string;
  productList: Product[];
}) {
  const {setConversationId, productId, setProductId} = useSidebar()
  const [productName, setProductName] = useState(defaultProductName)
  const [conversationList, setConversationList] = useState([] as Conversation[])
  const [editingConversation, setEditingConversation] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const {data: session} = useSession();

  const publicUrl = env("NEXT_PUBLIC_BASE_URL")

  // Menu items.
  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
  ]

  const handleConversationList = async () => {
    const userToken = session?.user?.access_token;
    if (userToken) {
      const conversations = await getConversationList(userToken, productId)
      setConversationList(conversations)
    }
  };

  useEffect(() => {
    handleConversationList();
  }, []);


  function changeProduct(id: string, name: string) {
    setProductId(id);
    setProductName(name)
  }

  const createConversation = useCallback(async (name: string) => {
    const userToken = session?.user?.access_token
    if (!userToken) {
      toast.warning("Please login first")
      redirect("/auth/login")
    }

    const newConversation = await createNewConversation(userToken, productId, name)
    if (!newConversation) {
      toast.error("Conversation created failed, please try again")
      return
    }
    await handleConversationList()
  }, []);

  const handleEditConversation = (conversationId: string, currentName: string) => {
    setEditingConversation(conversationId)
    setNewName(currentName)
  }

  const handleUpdateConversationName = async (conversationId: string) => {
    const userToken = session?.user?.access_token
    if (!userToken) {
      toast.warning("Please login first")
      return
    }

    try {
      const result = await updateConversationName(userToken, productId, conversationId, newName)
      if (!result) {
        toast.error("Conversation updated failed, please try again")
        return
      }
      await handleConversationList()
      toast.success("Conversation name updated")
    } catch (error) {
      console.error("ERROR to update conversation: ", error)
      toast.error("Failed to update conversation name")
    } finally {
      setEditingConversation(null)
      setNewName("")
    }
  }

  const handleDeleteConversation = async (conversationId: string) => {
    const userToken = session?.user?.access_token
    if (!userToken) {
      toast.warning("Please login first")
      return
    }
    try {
      const result = await deleteConversation(userToken, conversationId)
      if (!result) {
        toast.error("Conversation deleted failed, please try again")
        return
      }
      toast.success("Conversation deleted successfully")
    } catch (error) {
      console.log("ERROR to delete conversation conversation: ", error)
      toast.error("Failed to deleted conversation")
    } finally {
      await handleConversationList()
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center">
          <Logo src="/img/logo.svg">
            <span>AI Visa</span>
          </Logo>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {productName}
                  <ChevronDown className="ml-auto"/>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                {
                  productList.map(product => {
                    const productId = product.documentId;
                    const productName = product.title;
                    return (
                      <DropdownMenuItem key={productId} onSelect={() => changeProduct(productId, productName)}>
                        <span>{productName}</span>
                      </DropdownMenuItem>
                    )
                  })
                }
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon/>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={async () =>
                  createConversation("New Conversation")
                }>
                  <span>New Conversation</span>
                  <IoAddCircle/>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {conversationList.length > 0 && <SidebarGroupLabel>History</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {
                conversationList.map(conversation => {
                  const conversationId = conversation.conversation_id
                  const conversationName = conversation.name
                  return (
                    <SidebarMenuItem key={conversationId}>
                      {editingConversation === conversationId ? (
                        <div className="flex flex-col items-center justify-between w-full p-2">
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="mr-2 mb-2 p-1 w-auto"
                            autoFocus
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              onClick={() => handleUpdateConversationName(conversationId)}
                            >
                              Save
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => setEditingConversation(null)}
                            >
                              Cancel
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    conversation and remove your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteConversation(conversationId)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ) : (
                        <SidebarMenuButton asChild onClick={async () => {
                          setConversationId(conversationId)
                        }}>
                          <Link href={`/steps/${productId}/${conversationId}`}>
                            <span>{conversationName}</span>
                            <EditIcon className="ml-2 h-4 w-4" onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEditConversation(conversationId, conversationName);
                            }}/>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  )
                })
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {
              session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <User2/> {session.user.username}
                      <ChevronUp className="ml-auto"/>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                  >
                    <DropdownMenuItem>
                      <span>Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="#" onClick={async () => await signOut({
                        redirectTo: `${publicUrl}/auth/login`,
                        redirect: true
                      })}>Sign
                        out</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/auth/login"
                  className="font-bold py-2 px-4 rounded mr-4"
                >
                  Login
                </Link>
              )
            }
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}