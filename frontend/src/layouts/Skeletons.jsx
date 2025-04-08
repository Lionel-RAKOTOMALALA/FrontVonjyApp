// Skeletons.js
import React from 'react';
import { Skeleton } from '@mui/material';

export const ProfileSkeleton = () => (
  <div>
    <Skeleton variant="text" width={210} height={30} />
    <Skeleton variant="rectangular" width={210} height={118} />
    <Skeleton variant="circle" width={40} height={40} />
  </div>
);

export const DashboardSkeleton = () => (
  <div>
    <Skeleton variant="text" width={300} height={40} />
    <Skeleton variant="rectangular" width="100%" height={200} />
    <Skeleton variant="text" width={150} height={30} />
  </div>
);

// Ajoutez d'autres Skeletons selon vos besoins
