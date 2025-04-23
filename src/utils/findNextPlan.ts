export function getNextPlan(userPlan: string) {
  const planList = ['free', 'premium', 'enterprise'];
  const index = planList.indexOf(userPlan);
  if (index === -1 || index === planList.length - 1) {
    return null;
  } else {
    return planList[index + 1];
  }
}
