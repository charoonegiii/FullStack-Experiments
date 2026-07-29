import { platformsAdapterSelectors } from './platformsSlice';

export const selectAllPlatforms = platformsAdapterSelectors.selectAll;
export const selectPlatformById = platformsAdapterSelectors.selectById;
export const selectPlatformsStatus = (state) => state.platforms.status;
