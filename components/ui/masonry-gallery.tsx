"use client";

import { useState } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import { Button } from "./button";
import { Play } from "lucide-react";
import "./masonry-gallery.css";

interface MediaItem {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  // Prisma can return caption as null, so accept null here as well
  caption?: string | null;
}

interface MasonryGalleryProps {
  media: MediaItem[];
  initialDisplayCount?: number;
}

export function MasonryGallery({
  media,
  initialDisplayCount = 6,
}: MasonryGalleryProps) {
  const [showAll, setShowAll] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const displayedMedia = showAll ? media : media.slice(0, initialDisplayCount);
  const hasMore = media.length > initialDisplayCount;

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1,
  };

  if (media.length === 0) {
    return null;
  }

  return (
    <>
      <div className='my-12'>
        <h2 className='text-2xl font-bold mb-6'>Gallery</h2>

        <Masonry
          breakpointCols={breakpointColumns}
          className='masonry-grid'
          columnClassName='masonry-grid-column'
        >
          {displayedMedia.map((item) => (
            <div
              key={item.id}
              className='masonry-item group cursor-pointer mb-4 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow'
              onClick={() => setSelectedMedia(item)}
            >
              {item.type === "IMAGE" ? (
                <div className='relative w-full aspect-auto'>
                  <Image
                    src={item.url}
                    alt={item.caption || "Gallery image"}
                    width={400}
                    height={300}
                    className='w-full h-auto object-cover'
                    style={{ display: "block" }}
                  />
                  {item.caption && (
                    <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <p className='text-white text-sm'>{item.caption}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className='relative'>
                  <video
                    src={item.url}
                    className='w-full h-auto object-cover'
                    preload='metadata'
                    poster={item.url + "#t=0.1"}
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors pointer-events-none'>
                    <div className='bg-white/90 rounded-full p-4'>
                      <Play className='h-8 w-8 text-black fill-black' />
                    </div>
                  </div>
                  {item.caption && (
                    <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4'>
                      <p className='text-white text-sm'>{item.caption}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </Masonry>

        {hasMore && !showAll && (
          <div className='text-center mt-8'>
            <Button
              onClick={() => setShowAll(true)}
              variant='outline'
              size='lg'
            >
              See More ({media.length - initialDisplayCount} more items)
            </Button>
          </div>
        )}

        {showAll && hasMore && (
          <div className='text-center mt-8'>
            <Button
              onClick={() => setShowAll(false)}
              variant='outline'
              size='lg'
            >
              Show Less
            </Button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div
          className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4'
          onClick={() => setSelectedMedia(null)}
        >
          <button
            className='absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10'
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMedia(null);
            }}
          >
            ×
          </button>
          <div
            className='max-w-7xl max-h-[90vh] relative'
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.type === "IMAGE" ? (
              <Image
                src={selectedMedia.url}
                alt={selectedMedia.caption || "Gallery image"}
                width={1200}
                height={800}
                className='max-w-full max-h-[90vh] w-auto h-auto object-contain'
                sizes='(max-width: 90vw) 100vw, 90vw'
                quality={90}
              />
            ) : (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className='max-w-full max-h-[90vh] w-auto h-auto'
              />
            )}
            {selectedMedia.caption && (
              <div className='absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white'>
                <p>{selectedMedia.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
