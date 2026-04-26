import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

interface TitleContext {
  setTitle: (t: string | null) => void;
}

export function usePageTitle(title: string) {
  const { setTitle } = useOutletContext<TitleContext>();
  useEffect(() => {
    setTitle(title);
    return () => setTitle(null);
  }, [title, setTitle]);
}
