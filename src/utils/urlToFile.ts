export const urlToFile = async (url: string, filename: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(dataURLtoFile(reader.result?.toString() ?? '', filename));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  // @ts-expect-error
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
