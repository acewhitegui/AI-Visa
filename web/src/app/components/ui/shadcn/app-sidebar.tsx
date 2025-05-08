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
import {ChevronDown, ChevronUp, Home, Search, User2} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/app/components/ui/shadcn/dropdown-menu";
import {useCallback, useState} from "react";
import {Link} from "@/i18n/routing";
import {Conversation, Product} from "@/app/library/objects/types";
import {createNewConversation} from "@/app/library/services/conversation_service";
import {signOut, useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import {toast} from "sonner";


export function AppSidebar({defaultProductName, productList, conversationList}: {
  defaultProductName: string;
  productList: Product[];
  conversationList: Conversation[]
}) {
  const {setConversationId, productId, setProductId} = useSidebar()
  const [productName, setProductName] = useState(defaultProductName)
  const {data: session} = useSession();
  // Menu items.
  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
  ]

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
    conversationList.push(newConversation)
  }, []);

  return (
    <Sidebar>
      <SidebarHeader>
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
                      <DropdownMenuItem id={productId} onSelect={() => changeProduct(productId, productName)}>
                        <span id={productId}>{productName}</span>
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
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/search">
                    <Search/>
                    <span>Search</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={async () =>
                  createConversation("New Conversation")
                }>
                  <span>New Conversation</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {
                conversationList.map(conversation => {
                  const conversationId = conversation.conversation_id
                  const conversationName = conversation.title
                  return (
                    <SidebarMenuItem id={conversationId}>
                      <SidebarMenuButton asChild onClick={async () => {
                        setConversationId(conversationId)
                      }}>
                        <Link id={conversationId} href={`/steps/${productId}/${conversationId}`}>
                          <span id={conversationId}>{conversationName}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
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
                      <Link href="#" onClick={async () => await signOut({redirectTo: "/auth/login", redirect: true})}>Sign
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
