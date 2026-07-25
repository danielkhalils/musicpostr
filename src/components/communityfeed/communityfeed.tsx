import type { FC } from 'react';
import { communityfeedWrapper } from './communityfeed.styled';

interface communityfeedProps {}

const communityfeed: FC<communityfeedProps> = () => (
 <communityfeedWrapper data-testid="communityfeed">
    communityfeed Component
 </communityfeedWrapper>
);

export default communityfeed;
