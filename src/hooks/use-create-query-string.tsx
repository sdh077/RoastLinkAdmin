'use client'
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useCreateQueryString = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const createQueryString = useCallback(
    (name: string, value: string) => {
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return createQueryString;
};
