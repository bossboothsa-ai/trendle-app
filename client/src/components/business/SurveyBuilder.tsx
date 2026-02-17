import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Plus,
    Trash2,
    GripVertical,
    Star,
    List,
    AlignLeft,
    Eye,
    Save,
    Calendar,
    Lock,
    Unlock
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface Question {
    id: string;
    text: string;
    type: "text" | "rating" | "choice";
    options?: string[];
}

export interface SurveyFormData {
    title: string;
    description: string;
    points: number;
    questions: Question[];
    accessRequirement: string;
    startDate?: Date;
    endDate?: Date;
}

interface SurveyBuilderProps {
    initialData?: SurveyFormData;
    onSubmit: (data: SurveyFormData) => void;
    isLoading?: boolean;
}

export default function SurveyBuilder({ initialData, onSubmit, isLoading }: SurveyBuilderProps) {
    const [formData, setFormData] = useState<SurveyFormData>(initialData || {
        title: "",
        description: "",
        points: 20,
        questions: [],
        accessRequirement: "must_check_in",
    });

    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        initialData?.startDate && initialData?.endDate
            ? { from: initialData.startDate, to: initialData.endDate }
            : { from: new Date(), to: addDays(new Date(), 30) }
    );

    const addQuestion = (type: "text" | "rating" | "choice") => {
        const newQuestion: Question = {
            id: Math.random().toString(36).substr(2, 9),
            text: "",
            type,
            options: type === "choice" ? ["Option 1", "Option 2"] : undefined
        };
        setFormData({ ...formData, questions: [...formData.questions, newQuestion] });
    };

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        setFormData({
            ...formData,
            questions: formData.questions.map(q => q.id === id ? { ...q, ...updates } : q)
        });
    };

    const removeQuestion = (id: string) => {
        setFormData({
            ...formData,
            questions: formData.questions.filter(q => q.id !== id)
        });
    };

    const handleOptionChange = (qId: string, optIndex: number, value: string) => {
        setFormData({
            ...formData,
            questions: formData.questions.map(q => {
                if (q.id === qId && q.options) {
                    const newOptions = [...q.options];
                    newOptions[optIndex] = value;
                    return { ...q, options: newOptions };
                }
                return q;
            })
        });
    };

    const addOption = (qId: string) => {
        setFormData({
            ...formData,
            questions: formData.questions.map(q => {
                if (q.id === qId && q.options) {
                    return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
                }
                return q;
            })
        });
    };

    const removeOption = (qId: string, optIndex: number) => {
        setFormData({
            ...formData,
            questions: formData.questions.map(q => {
                if (q.id === qId && q.options) {
                    const newOptions = q.options.filter((_, idx) => idx !== optIndex);
                    return { ...q, options: newOptions };
                }
                return q;
            })
        });
    }

    const handleSubmit = () => {
        // VALIDATION
        if (!formData.title.trim() || !formData.description.trim()) {
            // Toast would need to be passed in or used here
            alert("Title and description are required."); // Fallback if toast not available in props
            return;
        }

        if (formData.questions.length === 0) {
            alert("Please add at least one question.");
            return;
        }

        for (const q of formData.questions) {
            if (!q.text.trim()) {
                alert("All questions must have text.");
                return;
            }
            if (q.type === 'choice' && (!q.options || q.options.length < 2)) {
                alert("Multiple choice questions must have at least 2 options.");
                return;
            }
            if (q.type === 'choice' && q.options && q.options.some(o => !o.trim())) {
                alert("All options must have text.");
                return;
            }
        }

        onSubmit({
            ...formData,
            startDate: dateRange?.from,
            endDate: dateRange?.to,
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-6 h-full">
            {/* Builder Column */}
            <div className="lg:col-span-2 space-y-8 overflow-y-auto pr-2">

                {/* Header */}
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 border-l-4 border-purple-600 pl-4">Create Feedback Survey</h2>
                    <p className="text-gray-500 pl-4">Gather structured feedback from verified visitors</p>
                </div>

                {/* Configuration Section */}
                <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="title" className="text-sm font-bold text-gray-700">Survey Title <span className="text-red-500">*</span></Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Example: Post-Visit Experience"
                                className="h-11 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-200 transition-all font-medium"
                                required
                            />
                            <p className="text-[11px] text-gray-400">Keep it short and outcome-focused.</p>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="description" className="text-sm font-bold text-gray-700">Description <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Explain what this survey covers..."
                                className="min-h-[100px] rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-200 transition-all resize-none"
                                required
                            />
                            <p className="text-[11px] text-gray-400">This description will be visible to users before they submit feedback.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="points" className="text-sm font-bold text-gray-700">Points Reward</Label>
                                <div className="relative">
                                    <Input
                                        id="points"
                                        type="number"
                                        value={formData.points}
                                        onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                                        className="h-11 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-200 transition-all pl-10"
                                        required
                                        min={0}
                                    />
                                    <span className="absolute left-3 top-3 text-gray-400 font-bold text-xs">PTS</span>
                                </div>
                                <p className="text-[11px] text-gray-400">Users earn Trendle points after completing this survey.</p>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="access" className="text-sm font-bold text-gray-700">Access Requirement</Label>
                                <Select
                                    value={formData.accessRequirement}
                                    onValueChange={(value) => setFormData({ ...formData, accessRequirement: value })}
                                >
                                    <SelectTrigger id="access" className="h-11 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-200">
                                        <SelectValue placeholder="Select access requirement" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="must_check_in">
                                            <div className="flex items-center">
                                                <Lock className="w-3 h-3 mr-2 text-purple-600" /> Must Check-In
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="open_to_all">
                                            <div className="flex items-center">
                                                <Unlock className="w-3 h-3 mr-2 text-green-600" /> Open to All Visitors
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[11px] text-gray-400">"Must Check-In" prevents fake feedback and builds trust.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-gray-700">Active Period</Label>
                            <DatePickerWithRange date={dateRange} setDate={setDateRange} className="w-full" />
                            <p className="text-[11px] text-gray-400">Optional but important for structure.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Questions Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-lg font-bold text-gray-800">Questions Section</Label>
                    </div>

                    {formData.questions.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
                                <List className="text-gray-400" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900">No questions added</h3>
                            <p className="text-xs text-gray-500 mt-1 mb-4">Add at least one question to activate this survey.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {formData.questions.map((q, index) => (
                                <Card key={q.id} className="border-none shadow-sm bg-white rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                                    <CardContent className="p-0">
                                        <div className="flex items-stretch">
                                            <div className="w-10 bg-gray-50 flex items-center justify-center cursor-move text-gray-400 hover:text-gray-600 border-r border-gray-100">
                                                <GripVertical className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 p-5 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold bg-gray-900 text-white px-2 py-0.5 rounded-md">Q{index + 1}</span>
                                                        <span className="text-xs uppercase text-gray-500 font-bold tracking-wider">
                                                            {q.type === "rating" && "Rating Question"}
                                                            {q.type === "choice" && "Multiple Choice"}
                                                            {q.type === "text" && "Text Feedback"}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                        onClick={() => removeQuestion(q.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <Input
                                                    value={q.text}
                                                    onChange={e => updateQuestion(q.id, { text: e.target.value })}
                                                    placeholder={
                                                        q.type === "rating" ? "e.g., How would you rate your experience?" :
                                                            q.type === "choice" ? "e.g., What did you visit us for?" :
                                                                "e.g., What could we improve?"
                                                    }
                                                    className="border-0 border-b border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-purple-600 font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal bg-transparent"
                                                />

                                                {q.type === "choice" && q.options && (
                                                    <div className="pl-4 space-y-3 pt-2">
                                                        {q.options.map((opt, idx) => (
                                                            <div key={idx} className="flex items-center gap-3 group/opt">
                                                                <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                                                                <Input
                                                                    value={opt}
                                                                    onChange={e => handleOptionChange(q.id, idx, e.target.value)}
                                                                    className="h-9 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-purple-200 text-sm"
                                                                    placeholder={`Option ${idx + 1}`}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-gray-300 hover:text-red-500 opacity-0 group-hover/opt:opacity-100 transition-all"
                                                                    onClick={() => removeOption(q.id, idx)}
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 pl-0 -ml-2"
                                                            onClick={() => addOption(q.id)}
                                                        >
                                                            <Plus className="w-3 h-3 mr-1" /> Add Option
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="space-y-4 pt-4">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Question Types</p>
                        <div className="grid grid-cols-1 gap-4">
                            <Button
                                variant="outline"
                                onClick={() => addQuestion("rating")}
                                type="button"
                                className="h-20 rounded-2xl border-2 border-gray-100 bg-white hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all flex items-center justify-between px-6 shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                                        <Star className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-gray-900">Add Rating</div>
                                        <div className="text-xs text-gray-500 font-medium">Capture numerical satisfaction scores</div>
                                    </div>
                                </div>
                                <Plus className="w-5 h-5 text-gray-300" />
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => addQuestion("choice")}
                                type="button"
                                className="h-20 rounded-2xl border-2 border-gray-100 bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all flex items-center justify-between px-6 shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                                        <List className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-gray-900">Add Multiple Choice</div>
                                        <div className="text-xs text-gray-500 font-medium">Let users pick from predefined options</div>
                                    </div>
                                </div>
                                <Plus className="w-5 h-5 text-gray-300" />
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => addQuestion("text")}
                                type="button"
                                className="h-20 rounded-2xl border-2 border-gray-100 bg-white hover:bg-pink-50 hover:border-pink-200 hover:text-pink-700 transition-all flex items-center justify-between px-6 shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-pink-100 rounded-xl text-pink-600">
                                        <AlignLeft className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-gray-900">Add Text Feedback</div>
                                        <div className="text-xs text-gray-500 font-medium">Gather detailed written customer reviews</div>
                                    </div>
                                </div>
                                <Plus className="w-5 h-5 text-gray-300" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Final Actions */}
                <div className="pt-6 border-t border-gray-100 flex gap-4">
                    <Button
                        onClick={handleSubmit}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-12 font-bold shadow-lg shadow-gray-200"
                        disabled={isLoading || formData.questions.length === 0}
                    >
                        {isLoading ? "Saving..." : "Save Survey"}
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold border-gray-200 text-gray-500 hover:text-gray-900">
                        Save as Draft
                    </Button>
                </div>
            </div>

            {/* Preview Column */}
            <div className="hidden lg:block">
                <div className="sticky top-6">
                    <div className="flex items-center gap-2 mb-4 text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">How This Appears to Users</span>
                    </div>

                    {/* Phone Mockup */}
                    <div className="border-[8px] border-gray-900 rounded-[3rem] overflow-hidden shadow-2xl bg-white aspect-[9/19] relative max-w-[320px] mx-auto">
                        <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 z-10 flex justify-center">
                            <div className="w-24 h-4 bg-black rounded-b-xl"></div>
                        </div>

                        <div className="h-full overflow-y-auto pt-10 px-4 pb-8 bg-gray-50 no-scrollbar">
                            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
                                    <List className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-lg leading-tight mb-2 text-gray-900">{formData.title || "Survey Title"}</h3>
                                <p className="text-sm text-gray-500 mb-4">{formData.description || "Survey description will appear here..."}</p>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold">
                                    <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                                    Earn {formData.points} pts
                                </div>
                            </div>

                            <div className="space-y-4">
                                {formData.questions.length === 0 ? (
                                    <div className="opacity-50 text-center py-10">
                                        <p className="text-xs text-gray-400">Questions will appear here</p>
                                    </div>
                                ) : (
                                    formData.questions.map((q, i) => (
                                        <div key={q.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <p className="text-sm font-bold text-gray-900 mb-3">{q.text || "Question text..."}</p>

                                            {q.type === "rating" && (
                                                <div className="flex justify-between">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star key={star} className="w-6 h-6 text-gray-200 fill-gray-100" />
                                                    ))}
                                                </div>
                                            )}

                                            {q.type === "choice" && (
                                                <div className="space-y-2">
                                                    {q.options?.map((opt, idx) => (
                                                        <div key={idx} className="flex items-center p-2 rounded-lg border border-gray-100">
                                                            <div className="h-4 w-4 rounded-full border border-gray-300 mr-2"></div>
                                                            <span className="text-xs text-gray-600">{opt}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {q.type === "text" && (
                                                <div className="h-20 bg-gray-50 rounded-lg border border-gray-100"></div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-8">
                                <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-200">
                                    Submit Feedback
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
