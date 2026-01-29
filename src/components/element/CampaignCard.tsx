import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/utils/helpers/cn';
import { CircularProgress } from './CircularProgress';

interface CampaignCardProps {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  progress: number;
  needed?: number;
  raised?: number;
  className?: string;
}

export const CampaignCard = ({
  id,
  imageUrl,
  title,
  description,
  progress,
  needed,
  raised,
  className,
}: CampaignCardProps) => {
  return (
    <Link href={`/campaign/${id}`}>
      <div
        className={cn(
          'relative min-h-21 w-auto h-fit rounded-2xl overflow-hidden',
          'shadow-[0px_8px_20px_0px_rgba(0,0,0,0.15)]',
          'transition-transform hover:scale-[1.02] cursor-pointer',
          className
        )}
      >
      {/* Image on the left - 80px width */}
      <div className="absolute left-0 top-0 w-20 h-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Description section on the right */}
      <div className="pl-20 bg-white">
        <div className="flex items-center justify-between gap-8 py-3 px-4">
          {/* Text description section */}
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            {/* Title */}
            <h3
              className={cn(
                'font-sf-semibold text-base leading-6 tracking-[-0.02em] text-black',
                'truncate'
              )}
            >
              {title}
            </h3>

            {/* Description */}
            <p
              className={cn(
                'font-sf-regular text-xs leading-4 text-black',
                'truncate'
              )}
            >
              {description}
            </p>

            {/* Progress text */}
            <p className="font-sf-semibold text-xs leading-4 text-blue-700">
              {progress} % Terkumpul
            </p>
          </div>

          {/* Circular progress */}
          <div className="shrink-0">
            <CircularProgress value={progress} />
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
};