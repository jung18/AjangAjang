import React, { useState, useEffect } from "react";
import "./MyReview.css";
import { fetchReviewList } from "../../api/reviewService";

function MyReview() {
  const [reviews, setReviews] = useState([]);
  const [maxHeight, setMaxHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchReviewList();
      setReviews(response.data);
      console.log(reviews);
      setIsLoading(false);
    };

    fetchData();

    const calculateMaxHeight = () => {
      const totalHeight = window.innerHeight;
      setMaxHeight(totalHeight - 210);
    };

    calculateMaxHeight();
    window.addEventListener("resize", calculateMaxHeight);

    return () => {
      window.removeEventListener("resize", calculateMaxHeight);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  return (
    <div className="review-container">
      <div className="boardTitle">리뷰 내역</div>
      <div className="boardPage" style={{ maxHeight: `${maxHeight}px` }}>
        {reviews.length === 0 ? (
          <div className="notFoundContent">내 리뷰가 존재하지 않습니다.</div>
        ) : (
          <div className="review-body" style={{ maxHeight: `${maxHeight}px` }}>
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-card-header">
                  <div className="review-score">★ {review.score}</div>
                </div>
                <div className="review-content">{review.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReview;
