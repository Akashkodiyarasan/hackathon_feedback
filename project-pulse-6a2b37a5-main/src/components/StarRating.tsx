import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
}

const StarRating = ({ value, onChange, readonly = false, size = 28 }: StarRatingProps) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`transition-transform ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          <Star
            size={size}
            className={`transition-colors ${
              star <= (hover || value)
                ? "fill-star text-star"
                : "fill-transparent text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
