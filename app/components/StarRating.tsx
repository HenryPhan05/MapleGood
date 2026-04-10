export default function StarRating({ rate }: { rate: number }) {
  return (
    <div className="flex flex-row gap-0.5 mt-2 ml-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rate >= star;
        const half = !filled && rate >= star - 0.5;

        return (
          <span key={star} className="relative inline-block text-gray-300 text-xl">
            ★
            {(filled || half) && (
              <span
                className="absolute top-0 left-0 overflow-hidden text-yellow-400"
                style={{ width: filled ? "100%" : "50%" }}
              >
                ★
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
