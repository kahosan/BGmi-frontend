import { useToast } from '@chakra-ui/react';
import { getCookie } from 'cookies-next';

import useSWRMutation from 'swr/mutation';
import { fetcherWithMutation } from '~/lib/fetcher';

import type { FetchFilterResp, SaveFilterBody } from '~/types/subscribe';

export function useSubscribeAction(bangumiName: string) {
  const authToken = getCookie('authToken') as string | undefined;
  const toast = useToast();

  const handleError = (err: any, title?: string) => {
    let errorMessage;
    console.error(err);

    if (typeof err?.detail === 'string') {
      errorMessage = err?.detail;
    } else {
      errorMessage = err?.detail[0]?.msg;
    }

    toast({
      title: title ?? '请求失败',
      description: errorMessage ?? err?.description,
      status: 'error',
      duration: 3000,
      position: 'top-right',
    });
  };

  const handleSuccess = (title?: string) => {
    toast({
      title: title ?? '请求成功',
      status: 'success',
      duration: 3000,
      position: 'top-right',
    });
  };

  const { trigger: subscribe } = useSWRMutation(['/api/admin/add', authToken], fetcherWithMutation, {
    onError(err) {
      handleError(err, '订阅失败');
    },
    onSuccess() {
      handleSuccess('订阅成功');
    },
  });

  const { trigger: unSubscribe } = useSWRMutation(['/api/admin/delete', authToken], fetcherWithMutation, {
    onError(err) {
      handleError(err, '取消订阅失败');
    },
    onSuccess() {
      handleSuccess('取消订阅成功');
    },
  });

  const { trigger: fetchFilter } = useSWRMutation(
    [`/api/admin/filter/${encodeURIComponent(bangumiName)}`, authToken],
    fetcherWithMutation,
    {
      onError(err) {
        handleError(err, '获取订阅设定失败');
      },
    }
  );

  const { trigger: saveFilter, isMutating: saveFilterMutating } = useSWRMutation(
    [`/api/admin/filter/${encodeURIComponent(bangumiName)}`, authToken],
    fetcherWithMutation,
    {
      onError(err) {
        handleError(err, '保存订阅设定失败');
      },
      onSuccess() {
        handleSuccess('保存订阅设定成功');
      },
    }
  );

  const { trigger: saveMarkEpisode, isMutating: saveMarkMutating } = useSWRMutation(
    ['/api/admin/mark', authToken],
    fetcherWithMutation,
    {
      onError(err) {
        handleError(err, '保存剧集失败');
      },
    }
  );

  return {
    handleSubscribe: (bangumi: string) => subscribe({ body: { bangumi } }),
    handleUnSubscribe: (bangumi: string) => unSubscribe({ body: { bangumi } }),
    // 获取数据和更新数据都使用同一个 api 地址, 所以需要传入不同的 method
    handleFetchFilter: () => fetchFilter({ method: 'GET' }) as Promise<FetchFilterResp>, // why use as? https://github.com/vercel/swr/issues/2500
    handleSaveFilter: {
      isMutating: saveFilterMutating,
      trigger: (body: SaveFilterBody) => saveFilter({ body, method: 'PATCH' }),
    },
    handleSaveMark: {
      isMutating: saveMarkMutating,
      trigger: (body: { bangumi: string; episode: number }) => saveMarkEpisode({ body }),
    },
  };
}
