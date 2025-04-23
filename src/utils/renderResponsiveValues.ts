import { BREAKPOINTS } from '../types';

export const renderResponsiveValues = (width: number, value: any[]) => {
  if (width < BREAKPOINTS.phone_small) {
    return value[0];
  }
  if (width < BREAKPOINTS.phone) {
    return value[1];
  }
  if (width < BREAKPOINTS.phone_wide) {
    return value[2];
  }
  if (width < BREAKPOINTS.tablet) {
    return value[3];
  }
  if (width < BREAKPOINTS.tablet_wide) {
    return value[4];
  }
  if (width < BREAKPOINTS.desktop_small) {
    return value[5];
  }
  if (width < BREAKPOINTS.desktop_medium) {
    return value[6];
  }
  if (width < BREAKPOINTS.desktop) {
    return value[7];
  }
  if (width < BREAKPOINTS.desktop_wide) {
    return value[8];
  }
  return value[8];
};
