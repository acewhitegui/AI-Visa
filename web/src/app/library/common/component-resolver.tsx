import {lazy, Suspense} from 'react';
import Loader from '@/app/components/ui/Loader';
import {logger} from '@/app/library/common/logger';

export default function componentResolver(section: any, index: number, locale: string) {
  // Component names do look like 'category.component-name' => lowercase and kebap case
  const names: string[] = section.__component.split('.');

  // Get category name
  const category = names[0];

  // Get component name
  const component = names[1];

  // Convert the kebap-case name to PascalCase
  const parts: string[] = component.split('-');
  let componentName = '';
  parts.forEach(s => {
    componentName += capitalizeFirstLetter(s);
  });

  // Use react lazy loading to import the module
  try {
    // 动态导入路径必须包含静态部分，否则 Webpack 无法解析
    const modulePromise = import(`@/app/components/${category}/${componentName}`);

    // 使用 lazy 包装动态导入的模块
    const LazyComponent = lazy(() => modulePromise);

    // 创建 React 元素
    return (
      <Suspense fallback={<Loader/>} key={index}>
        <LazyComponent data={section} key={index} locale={locale} index={index}/>
      </Suspense>
    );
  } catch (e) {
    logger.error(`ERROR to get module, category: ${category}, component name: ${componentName}, error info: ${e}`);
    return null; // 或者返回一个错误组件
  }
}

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}