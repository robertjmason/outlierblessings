import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Play, Pause } from "lucide-react";

export interface ImageVariant {
  src: string;
  alt?: string;
  title?: string;
}

export interface CrossImageSlideshowProps {
  images: Array<string | ImageVariant>;
  title: string;
  autoPlayInterval?: number;
  showThumbnails?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  showPlayPauseToggle?: boolean;
  className?: string;
}

export const CrossImageSlideshow: React.FC<CrossImageSlideshowProps> = ({
  images,
  title,
  autoPlayInterval = 4000,
  showThumbnails = true,
  showArrows = true,
  showDots = true,
  showPlayPauseToggle = true,
  className,
}) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);

  // Normalise images into objects
  const normalizedImages: ImageVariant[] = React.useMemo(() => {
    return images.map((img, idx) => {
      if (typeof img === "string") {
        return {
          src: img,
          alt: `${title} - view ${idx + 1}`,
          title: `Variant ${idx + 1}`,
        };
      }
      return {
        ...img,
        alt: img.alt || `${title} - ${img.title || `view ${idx + 1}`}`,
      };
    });
  }, [images, title]);

  // Autoplay plugin instance with pause-on-hover & pause-on-focus-in
  const autoplay = React.useRef(
    Autoplay({
      delay: autoPlayInterval,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const togglePlayPause = () => {
    const autoplayInstance = autoplay.current;
    if (!autoplayInstance) return;

    if (isPlaying) {
      autoplayInstance.stop();
      setIsPlaying(false);
    } else {
      autoplayInstance.play();
      setIsPlaying(true);
    }
  };

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  if (!normalizedImages.length) return null;

  // If there's only 1 image, render clean static image without carousel overhead
  if (normalizedImages.length === 1) {
    const single = normalizedImages[0];
    return (
      <div className={cn("overflow-hidden rounded-sm bg-navy/5", className)}>
        <img
          src={single.src}
          alt={single.alt || title}
          className="w-full h-auto object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("w-full space-y-4", className)}
      aria-roledescription="carousel"
      aria-label={`${title} image gallery`}
    >
      <div className="relative group">
        <Carousel
          setApi={setApi}
          plugins={[autoplay.current]}
          opts={{
            loop: true,
          }}
          className="w-full overflow-hidden rounded-sm bg-navy/5"
        >
          <CarouselContent>
            {normalizedImages.map((img, idx) => (
              <CarouselItem
                key={idx}
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${normalizedImages.length}: ${img.title || title}`}
              >
                <div className="relative aspect-square md:aspect-[4/5] w-full overflow-hidden flex items-center justify-center bg-navy/5">
                  <img
                    src={img.src}
                    alt={img.alt || `${title} - slide ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                  {img.title && (
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded">
                      {img.title}
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {showArrows && (
            <>
              <CarouselPrevious
                type="button"
                className="left-3 h-9 w-9 bg-white/90 hover:bg-white text-navy shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                aria-label="Previous image"
              />
              <CarouselNext
                type="button"
                className="right-3 h-9 w-9 bg-white/90 hover:bg-white text-navy shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                aria-label="Next image"
              />
            </>
          )}

          {showPlayPauseToggle && (
            <button
              type="button"
              onClick={togglePlayPause}
              className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-xs transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={isPlaying ? "Pause automatic slideshow" : "Start automatic slideshow"}
              title={isPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          )}
        </Carousel>

        {/* Live region for screen readers */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Slide {current + 1} of {normalizedImages.length}: {normalizedImages[current]?.title || title}
        </div>
      </div>

      {/* Dot Indicators */}
      {showDots && (
        <div className="flex items-center justify-center gap-2 pt-1" role="tablist" aria-label="Slides">
          {normalizedImages.map((img, idx) => {
            const isSelected = idx === current;
            return (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Go to slide ${idx + 1}${img.title ? `: ${img.title}` : ""}`}
                onClick={() => scrollTo(idx)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent",
                  isSelected
                    ? "w-6 bg-accent"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            );
          })}
        </div>
      )}

      {/* Thumbnails */}
      {showThumbnails && normalizedImages.length > 1 && (
        <div
          className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-2"
          role="region"
          aria-label="Thumbnail previews"
        >
          {normalizedImages.map((img, idx) => {
            const isSelected = idx === current;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => scrollTo(idx)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded border-2 transition-all p-0.5 bg-navy/5 focus:outline-none focus:ring-2 focus:ring-accent",
                  isSelected
                    ? "border-accent ring-1 ring-accent"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
                aria-label={`Select ${img.title || `slide ${idx + 1}`}`}
                aria-current={isSelected ? "true" : undefined}
              >
                <img
                  src={img.src}
                  alt=""
                  className="w-full h-full object-cover rounded-[2px]"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CrossImageSlideshow;
