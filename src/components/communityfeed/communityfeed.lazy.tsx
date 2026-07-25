import { lazy, Suspense, ComponentProps } from 'react';

const Lazycommunityfeed = lazy(() => import('./communityfeed'));

const communityfeed = (props: ComponentProps<typeof Lazycommunityfeed>) => (
  <Suspense fallback={null}>
    <Lazycommunityfeed {...props} />
  </Suspense>
);

export default communityfeed;
