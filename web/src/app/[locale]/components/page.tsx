import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/app/components/ui/shadcn/breadcrumb";
import {Button} from "@/app/components/ui/shadcn/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/app/components/ui/shadcn/card";

export default async function Components() {
  return (
    <>
      <div className="container mx-auto py-12 ">
        <h1 className="text-3xl font-bold mb-8">Components</h1>
        <section className="grid grid-cols-3 gap-6">
          {/* 卡片按钮 */}
          <Card>
            <CardHeader>
              <CardTitle>Card</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
          {/* 按钮组件 */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Button variant="default">default</Button>
              <Button variant="link">link</Button>
              <Button variant="ghost">ghost</Button>
              <Button variant="destructive">destructive</Button>
              <Button variant="outline">outline</Button>
              <Button variant="secondary">secondary</Button>
            </CardContent>
          </Card>
          {/* 面包屑 */}
          <Card>
            <CardHeader>
              <CardTitle>Breadcrumb</CardTitle>
              <CardContent>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </CardContent>
            </CardHeader>
          </Card>
        </section>
      </div>
    </>
  );
}