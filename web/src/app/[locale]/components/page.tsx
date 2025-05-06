import {Button} from "@/app/components/ui/shadcn/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/app/components/ui/shadcn/card";

export default async function Components() {
  return (
    <>
      <div className="container mx-auto py-12 ">
        <h1 className="text-3xl font-bold mb-8">Components</h1>
        <div className="grid grid-cols-3 gap-6">
          {/* 卡片按钮 */}
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <Button variant="default">default</Button>
            <Button variant="link">link</Button>
            <Button variant="ghost">ghost</Button>
            <Button variant="destructive">destructive</Button>
            <Button variant="outline">outline</Button>
            <Button variant="secondary">secondary</Button>
          </Card>
          {/* 表单组件 */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">表单组件</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">用户名</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="请输入用户名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">密码</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="请输入密码"
                />
              </div>
            </div>
          </div>

          {/* 提示组件 */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">提示组件</h2>
            <div className="space-y-3">
              <div className="bg-blue-100 text-blue-800 p-3 rounded">
                信息提示：这是一条信息提示
              </div>
              <div className="bg-green-100 text-green-800 p-3 rounded">
                成功提示：这是一条成功提示
              </div>
              <div className="bg-red-100 text-red-800 p-3 rounded">
                错误提示：这是一条错误提示
              </div>
            </div>
          </div>

          {/* 标签组件 */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">标签组件</h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">默认标签</span>
              <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm">蓝色标签</span>
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm">绿色标签</span>
              <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm">红色标签</span>
              <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm">黄色标签</span>
            </div>
          </div>

          {/* 导航组件 */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">导航组件</h2>
            <div className="flex border-b">
              <div className="px-4 py-2 border-b-2 border-blue-500 font-medium">首页</div>
              <div className="px-4 py-2 text-gray-500">产品</div>
              <div className="px-4 py-2 text-gray-500">服务</div>
              <div className="px-4 py-2 text-gray-500">关于</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}