export const replaceSpecialCharsWithSpace = (
  str: string,
  specialChar: string
) => {
  return str.replace(new RegExp(specialChar, 'g'), ' ');
};
