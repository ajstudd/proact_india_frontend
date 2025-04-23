import { useState, useEffect } from "react";
import { useFastSearchProjectsQuery } from "../services/projectApi";
import useDebounce from "./useDebounce";
import { ProjectSearchResult } from "../types";

interface UseProjectSearchProps {
  initialSearchTerm?: string;
  limit?: number;
  debounceTime?: number;
}

export default function useProjectSearch({
  initialSearchTerm = "",
  limit = 5,
  debounceTime = 300,
}: UseProjectSearchProps = {}) {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const debouncedSearchTerm = useDebounce<string>(searchTerm, debounceTime);
  const [results, setResults] = useState<ProjectSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Only fetch when we have a search term
  const shouldFetch = debouncedSearchTerm.trim().length > 0;

  const { data, isFetching, isError } = useFastSearchProjectsQuery(
    { title: debouncedSearchTerm, limit },
    { skip: !shouldFetch }
  );

  useEffect(() => {
    setIsLoading(isFetching);

    if (isError) {
      setError("Failed to fetch projects");
      setResults([]);
      return;
    }

    if (!isFetching && data?.projects) {
      setResults(data.projects);
      setError(null);
    }
  }, [data, isFetching, isError]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    isLoading,
    error,
    total: data?.total || 0,
    hasMore: data?.hasMore || false,
  };
}
