import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2 } from 'lucide-react';

export const PopulateMovies = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePopulate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('populate-movies');
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: data.message || "Movies populated successfully",
      });
      
      // Refresh the page to show new movies
      window.location.reload();
    } catch (error) {
      console.error('Error populating movies:', error);
      toast({
        title: "Error",
        description: "Failed to populate movies from TMDB",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePopulate}
      disabled={loading}
      variant="outline"
      size="sm"
      className="ml-4"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      Load Trending Movies
    </Button>
  );
};