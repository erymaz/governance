export const isActiveProposal = (
  proposal: any
): boolean => {
  const now = new Date().getTime() / 1000;
  if (now >= proposal.startTime && now < proposal.endTime ) {
    return true;
  }
  return false;
};
