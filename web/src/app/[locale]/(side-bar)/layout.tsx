import "@/app/assets/css/globals.css";
import {setRequestLocale} from "next-intl/server";
import {getGlobal} from "@/app/library/services/global_service";
import {SidebarProvider, SidebarTrigger} from "@/app/components/ui/shadcn/sidebar";
import {AppSidebar} from "@/app/components/ui/shadcn/app-sidebar";
import {cookies} from "next/headers";
import {getProductList} from "@/app/library/services/product_service";

export default async function RootLayout({
                                           children,
                                           params
                                         }: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {

  const {locale} = await params;


  // Enable static rendering
  setRequestLocale(locale);

  const global = await getGlobal(locale);
  if (!global) return null;

  // Fetch required data in parallel for better performance
  const [products] = await Promise.all([
    getProductList(locale),
  ]);


  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  const defaultProductId = cookieStore.get("current_product")?.value || products?.[0]?.documentId
  const defaultProductName = cookieStore.get("current_product_name")?.value || products?.[0]?.title

  return (
    <SidebarProvider defaultOpen={defaultOpen} defaultProductId={defaultProductId}>
      <AppSidebar defaultProductName={defaultProductName} productList={products}/>
      <SidebarTrigger/>
      <div className="w-full">
        {children}
      </div>
    </SidebarProvider>
  );
}

