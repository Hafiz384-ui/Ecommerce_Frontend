import { useState } from "react";
import productStore from "../../store/productStore";
import { toast } from "react-toastify";
import { Star, X, Sparkles } from "lucide-react";

interface IProps {
  onClose: () => void;
  productId: string;
}

const RATING_LABELS = [
  "Select a rating",
  "Poor - Needs Improvement",
  "Fair - Acceptable",
  "Good - Met Expectations",
  "Very Good - Recommended",
  "Excellent - Exceptional Quality",
];

const PopupCard: React.FC<IProps> = ({ onClose, productId }) => {
  const { createReview } = productStore();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const reviewHandler = async () => {
    if (!comment.trim()) {
      toast.info("Please write a short comment about your experience");
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        productId,
        rating,
        comment: comment.trim(),
      };
      const result = await createReview(data);
      if (!result.success) {
        toast.error(result.message || "Unable to submit review");
      } else {
        toast.success(result.message || "Thank you for sharing your review!");
        setTimeout(() => onClose(), 400);
      }
    } catch {
      toast.error("An error occurred while submitting your review");
    } finally {
      setSubmitting(false);
    }
  };

  const currentRating = hoverRating ?? rating;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xl transform transition-all duration-200 animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <Sparkles size={13} className="text-amber-500" />
              <span>Verified Purchase</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Rate & Review Product
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Your feedback helps fellow tech enthusiasts make informed decisions.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Rating Stars Section */}
        <div className="py-5 flex flex-col items-center">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => setRating(star)}
                className="p-1 rounded-lg transition-transform hover:scale-115 active:scale-95 cursor-pointer focus:outline-none"
              >
                <Star
                  size={32}
                  className={`transition-colors duration-150 ${
                    star <= currentRating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200 hover:text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>

          <p className="mt-2 text-xs font-semibold text-slate-700 min-h-[18px]">
            {RATING_LABELS[currentRating] || "Select your rating"}
          </p>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-1.5 mb-5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="How was the build quality, performance, battery life, and overall feel? Tell us more..."
            className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-sm text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black transition-all resize-none"
          />
          <p className="text-[11px] text-slate-400 text-right">
            {comment.length} characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-100 hover:text-black transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={reviewHandler}
            disabled={submitting || !comment.trim()}
            className="px-6 py-2.5 rounded-full bg-black text-white text-xs sm:text-sm font-bold shadow-md hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-40 disabled:hover:bg-black disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupCard;
