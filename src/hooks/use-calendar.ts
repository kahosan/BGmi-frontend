import { useToast } from '@chakra-ui/react';

import useSWR from 'swr';

import { fetcher } from '~/lib/fetcher';
import type { Calendar } from '~/types/calendar';

export function useCalendar() {
  const toast = useToast();

  // TODO 之后改路径
  return useSWR<Calendar>(['/api/ssd/calendar'], fetcher, {
    onError(err) {
      console.error(err);
      toast({
        title: '获取日历信息失败',
        description: err?.detail ?? '请检查网络连接或配置',
        status: 'error',
        duration: 5000,
        position: 'top-right',
      });
    },
  });
}
