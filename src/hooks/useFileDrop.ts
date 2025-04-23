import { useEffect, useRef, RefObject } from 'react';

const useDropFile = (
  ref: RefObject<HTMLElement>,
  onFiles: (files: File[]) => void,
  acceptedTypes: string[] = []
): void => {
  const dropRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      const files = event.dataTransfer?.files;
      const filtered = Array.from(files ?? []).filter(file =>
        acceptedTypes.includes(file.type)
      );
      onFiles(filtered);
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    if (ref.current) {
      ref.current.addEventListener('drop', handleDrop);
      ref.current.addEventListener('dragover', handleDragOver);
    }

    dropRef.current = ref.current;

    return () => {
      if (dropRef.current) {
        dropRef.current.removeEventListener('drop', handleDrop);
        dropRef.current.removeEventListener('dragover', handleDragOver);
      }
    };
  }, [ref, onFiles, acceptedTypes]);
};

export default useDropFile;
