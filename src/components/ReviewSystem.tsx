import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  notHelpful: number;
}

interface ReviewSystemProps {
  movieId: string;
  movieTitle: string;
}

export const ReviewSystem = ({ movieId, movieTitle }: ReviewSystemProps) => {
  const [reviews] = useState<Review[]>([
    {
      id: "1",
      user: { name: "Alex Johnson", avatar: "https://i.pravatar.cc/40?img=1" },
      rating: 5,
      comment: "Absolutely incredible! The cinematography is breathtaking and the story keeps you on the edge of your seat. A must-watch for any movie enthusiast.",
      date: "2024-01-15",
      helpful: 24,
      notHelpful: 2
    },
    {
      id: "2",
      user: { name: "Sarah Chen", avatar: "https://i.pravatar.cc/40?img=2" },
      rating: 4,
      comment: "Great movie with excellent character development. The plot twists were unexpected and well-executed. Highly recommended!",
      date: "2024-01-12",
      helpful: 18,
      notHelpful: 1
    },
    {
      id: "3",
      user: { name: "Mike Rodriguez", avatar: "https://i.pravatar.cc/40?img=3" },
      rating: 3,
      comment: "Good movie overall, but felt a bit slow in the middle. The ending made up for it though. Worth watching if you're into this genre.",
      date: "2024-01-10",
      helpful: 12,
      notHelpful: 5
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleStarClick = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = async () => {
    if (newReview.rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating before submitting your review.",
        variant: "destructive",
      });
      return;
    }

    if (newReview.comment.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please write at least 10 characters for your review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Review submitted!",
        description: "Thank you for your review. It will help other users discover great content.",
      });
      
      setNewReview({ rating: 0, comment: "" });
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const renderStars = (rating: number, interactive = false, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${size} ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : interactive
            ? "text-muted-foreground hover:text-yellow-400 cursor-pointer"
            : "text-muted-foreground"
        } transition-colors`}
        onClick={interactive ? () => handleStarClick(index + 1) : undefined}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Reviews & Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-sm text-muted-foreground">{reviews.length} reviews</div>
            </div>
            
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(r => r.rating === star).length;
                const percentage = (count / reviews.length) * 100;
                
                return (
                  <div key={star} className="flex items-center space-x-2 text-sm">
                    <span className="w-2">{star}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center space-x-1 mb-2">
              {renderStars(newReview.rating, true, "w-6 h-6")}
            </div>
            <p className="text-sm text-muted-foreground">
              {newReview.rating === 0 ? "Select a rating" : `You rated this ${newReview.rating} star${newReview.rating !== 1 ? 's' : ''}`}
            </p>
          </div>
          
          <Textarea
            placeholder={`Share your thoughts about ${movieTitle}...`}
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            className="min-h-[100px] bg-secondary/50 border-border"
          />
          
          <Button 
            onClick={handleSubmitReview}
            disabled={isSubmitting || newReview.rating === 0}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="glass-card border-0">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={review.user.avatar} />
                  <AvatarFallback>{review.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{review.user.name}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      {review.rating}/5
                    </Badge>
                  </div>
                  
                  <p className="text-foreground leading-relaxed">{review.comment}</p>
                  
                  <div className="flex items-center space-x-4 pt-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <ThumbsDown className="w-3 h-3 mr-1" />
                      Not helpful ({review.notHelpful})
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};