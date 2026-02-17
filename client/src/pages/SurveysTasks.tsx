import { useSurveys, useSubmitSurvey, useDailyTasks, useCompleteDailyTask } from "@/hooks/use-trendle";
import { Check, Gift, Sparkles, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export default function SurveysTasks() {
  const { data: surveys } = useSurveys();
  const { data: dailyTasks } = useDailyTasks();
  const submitSurvey = useSubmitSurvey();
  const completeDailyTask = useCompleteDailyTask();
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [surveyAnswers, setSurveyAnswers] = useState<any>({});

  const handleSurveySubmit = () => {
    if (selectedSurvey) {
      submitSurvey.mutate({
        id: selectedSurvey.id,
        answers: surveyAnswers,
      });
      setSelectedSurvey(null);
      setSurveyAnswers({});
    }
  };

  const handleTaskComplete = (taskId: number) => {
    completeDailyTask.mutate(taskId);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 py-6">
        <h1 className="text-3xl font-display font-bold mb-2">Surveys & Tasks</h1>
        <p className="text-muted-foreground">Complete surveys and daily tasks to earn points!</p>
      </header>

      <main className="px-4 grid grid-cols-1 gap-8">
        {/* Surveys Section */}
        <section>
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Surveys
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {surveys?.map((survey) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-4 border border-border shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{survey.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{survey.description}</p>
                  </div>
                  <div className="bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full">
                    {survey.points} pts
                  </div>
                </div>
                <Dialog onOpenChange={(open) => !open && setSurveyAnswers({})}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Start Survey
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl bg-background border-none shadow-2xl rounded-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b border-border/50 text-left">
                      <DialogTitle className="font-display text-xl">{survey.title}</DialogTitle>
                      <DialogDescription className="text-muted-foreground mr-8">
                        Complete this survey to earn {survey.points} points!
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                      {(survey.questions as any[]).map((question: any, index: number) => (
                        <div key={index} className="space-y-3">
                          <p className="font-display font-semibold text-lg">{index + 1}. {question.question}</p>
                          <div className="grid grid-cols-1 gap-2">
                            {question.options.length > 0 ? (
                              question.options.map((option: string, optIndex: number) => (
                                <button
                                  key={optIndex}
                                  onClick={() =>
                                    setSurveyAnswers((prev: any) => ({
                                      ...prev,
                                      [index]: option,
                                    }))
                                  }
                                  className={`p-4 rounded-2xl border text-left transition-all duration-200 ${surveyAnswers[index] === option
                                    ? "border-primary bg-primary/5 shadow-inner scale-[0.98] ring-2 ring-primary/20"
                                    : "border-border/50 hover:bg-muted/50 active:scale-95"
                                    }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                      surveyAnswers[index] === option ? "border-primary bg-primary" : "border-muted-foreground/30"
                                    )}>
                                      {surveyAnswers[index] === option && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <span className="font-medium">{option}</span>
                                  </div>
                                </button>
                              ))
                            ) : (
                              <textarea
                                className="w-full p-4 rounded-2xl border border-border/50 bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[100px] resize-none"
                                placeholder="Share your thoughts..."
                                value={surveyAnswers[index] || ""}
                                onChange={(e) =>
                                  setSurveyAnswers((prev: any) => ({
                                    ...prev,
                                    [index]: e.target.value,
                                  }))
                                }
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <DialogFooter className="p-6 border-t border-border/50 bg-background/50 backdrop-blur-sm sm:flex-row flex-col gap-3">
                      <Button
                        variant="ghost"
                        className="rounded-xl sm:order-1"
                        onClick={() => setSurveyAnswers({})}
                      >
                        Reset
                      </Button>
                      <Button
                        onClick={handleSurveySubmit}
                        className="flex-1 rounded-xl py-6 text-lg font-bold shadow-lg shadow-primary/20 sm:order-2"
                        disabled={
                          Object.keys(surveyAnswers).length < (survey.questions as any[]).length ||
                          submitSurvey.isPending
                        }
                      >
                        {submitSurvey.isPending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Complete & Collect Points"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
            {(!surveys || surveys.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No surveys available at the moment. Check back later!
              </div>
            )}
          </div>
        </section>

        {/* Daily Tasks Section */}
        <section>
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Daily Tasks
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {dailyTasks?.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-4 border border-border shadow-sm flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold text-primary">+{task.points} pts</div>
                  {task.completed ? (
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Check className="w-5 h-5" />
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleTaskComplete(task.id)}
                      disabled={completeDailyTask.isPending}
                      size="sm"
                    >
                      {completeDailyTask.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Complete"
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
            {(!dailyTasks || dailyTasks.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No daily tasks available at the moment. Check back tomorrow!
              </div>
            )}
          </div>
        </section>
      </main>    </div>
  );
}
