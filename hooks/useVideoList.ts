import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import i18n from '@/lib/i18n';
import { useDeleteVideoMutation, useVideosQuery } from '@/lib/queries';
import { useFilterStore } from '@/store/filter-store';
import type { Video } from '@/types';

export function useVideoList() {
  const router = useRouter();
  const { data: videos, isLoading } = useVideosQuery();
  const deleteVideoMutation = useDeleteVideoMutation();
  const { searchQuery } = useFilterStore();

  const handleEdit = (id: number) => {
    router.push(`/edit/${id}`);
  };

  const handleDelete = (video: Video) => {
    Alert.alert(
      i18n.t('main.deleteConfirmTitle'),
      i18n.t('main.deleteConfirmMessage', { name: video.name }),
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('common.delete'),
          style: 'destructive',
          onPress: () => {
            deleteVideoMutation.mutate(video, {
              onSuccess: () => {
                // Optional: Toast or other feedback
              },
              onError: () => {
                Alert.alert(i18n.t('common.error'), i18n.t('main.deleteError'));
              },
            });
          },
        },
      ]
    );
  };

  const handleAddVideo = () => {
    router.push('/add');
  };

  return {
    videos,
    isLoading,
    searchQuery,
    handleEdit,
    handleDelete,
    handleAddVideo,
  };
}
