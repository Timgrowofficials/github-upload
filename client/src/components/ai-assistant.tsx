import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  MessageCircle,
  Send,
  Loader2,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Lightbulb,
  BarChart3,
  Zap
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AIInsight {
  id: string;
  question: string;
  response: string;
  timestamp: string;
  businessContext?: any;
}

export default function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const queryClient = useQueryClient();

  // Predefined business questions
  const quickQuestions = [
    {
      icon: TrendingUp,
      text: "How can I increase my monthly revenue?",
      category: "Growth"
    },
    {
      icon: Users,
      text: "What strategies can help me retain more clients?",
      category: "Retention"
    },
    {
      icon: DollarSign,
      text: "How should I price my services competitively?",
      category: "Pricing"
    },
    {
      icon: Target,
      text: "What marketing channels work best for my business type?",
      category: "Marketing"
    },
    {
      icon: BarChart3,
      text: "How can I improve my operational efficiency?",
      category: "Operations"
    },
    {
      icon: Zap,
      text: "What trends should I watch in my industry?",
      category: "Trends"
    }
  ];

  // Get AI insights
  const getAIInsights = useMutation({
    mutationFn: async (data: { question: string; businessData?: any }) => {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    onSuccess: (data, variables) => {
      const newInsight: AIInsight = {
        id: Date.now().toString(),
        question: variables.question,
        response: data.response,
        timestamp: new Date().toISOString(),
        businessContext: data.businessContext
      };
      setInsights(prev => [newInsight, ...prev]);
      setQuestion("");
    },
    onError: (error) => {
      console.error('AI insights error:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    getAIInsights.mutate({ question: question.trim() });
  };

  const handleQuickQuestion = (questionText: string) => {
    setQuestion(questionText);
    getAIInsights.mutate({ question: questionText });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative h-16 flex-col gap-2 hover:scale-105 transition-transform">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs">AI Assistant</span>
          {insights.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 bg-green-500">
              {insights.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            AI Business Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col gap-4">
          {/* Quick Questions */}
          <div className="border-b pb-4">
            <h3 className="text-sm font-medium mb-3">Quick Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {quickQuestions.map((q, index) => {
                const Icon = q.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto p-3 text-left"
                    onClick={() => handleQuickQuestion(q.text)}
                    disabled={getAIInsights.isPending}
                  >
                    <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium">{q.category}</div>
                      <div className="text-xs text-muted-foreground">{q.text}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Question Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything about your business..."
              className="flex-1"
              disabled={getAIInsights.isPending}
            />
            <Button 
              type="submit" 
              disabled={!question.trim() || getAIInsights.isPending}
              className="bg-tim-green hover:bg-tim-green/90"
            >
              {getAIInsights.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* AI Insights */}
          <ScrollArea className="flex-1">
            <div className="space-y-4">
              {getAIInsights.isPending && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Getting AI insights...</span>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {insights.map((insight) => (
                <Card key={insight.id} className="border-l-4 border-l-tim-green">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-tim-green" />
                        <span className="text-sm font-medium">Question</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(insight.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.question}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">AI Assistant</span>
                    </div>
                    <div className="text-sm prose prose-sm max-w-none">
                      {insight.response.split('\n').map((line, index) => (
                        <p key={index} className="mb-2 last:mb-0">
                          {line}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {insights.length === 0 && !getAIInsights.isPending && (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Get AI-Powered Business Insights</h3>
                    <p className="text-muted-foreground mb-4">
                      Ask me anything about growing your business, improving operations, or strategic planning.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Choose a quick question above or type your own question.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}