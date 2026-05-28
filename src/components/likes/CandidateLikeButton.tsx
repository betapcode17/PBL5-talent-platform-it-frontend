import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useLikeStore } from '@/store/likeStore'

type CandidateLikeButtonProps = {
  seekerId: number
  compact?: boolean
}

const CandidateLikeButton = ({ seekerId, compact = false }: CandidateLikeButtonProps) => {
  const { t } = useTranslation()
  const isLiked = useLikeStore((state) => state.isCandidateLiked(seekerId))
  const isUpdating = useLikeStore((state) => state.updatingSeekerIds.includes(seekerId))
  const toggleCandidateLike = useLikeStore((state) => state.toggleCandidateLike)

  return (
    <Button
      type='button'
      variant={isLiked ? 'default' : 'outline'}
      size='sm'
      disabled={isUpdating}
      onClick={() => void toggleCandidateLike(seekerId)}
      className={compact ? 'rounded-lg px-3' : 'w-full rounded-lg sm:w-auto'}
      aria-pressed={isLiked}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      {isUpdating
        ? t('employer.candidates.like.updating')
        : isLiked
          ? t('employer.candidates.like.liked')
          : t('employer.candidates.like.like')}
    </Button>
  )
}

export default CandidateLikeButton
