import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { hostCategories, hostMembershipPlans, HostCategory, HostMembershipTier } from "@shared/schema";
import { Upload, CreditCard, FileText, CheckCircle2 } from "lucide-react";

interface HostApplicationFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HostApplicationFlow({ open, onOpenChange }: HostApplicationFlowProps) {
  const [step, setStep] = useState(1);
  const [hostName, setHostName] = useState("");
  const [hostBio, setHostBio] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<HostCategory[]>([]);
  const [selectedTier, setSelectedTier] = useState<HostMembershipTier>("starter");
  const [paymentReference, setPaymentReference] = useState("");
  const [proofOfPayment, setProofOfPayment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleCategoryChange = (category: HostCategory, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Validate all fields
      if (!hostName.trim() || hostName.length < 2) {
        toast({
          title: "Error",
          description: "Host name must be at least 2 characters",
          variant: "destructive",
        });
        return;
      }

      if (!hostBio.trim() || hostBio.length < 20) {
        toast({
          title: "Error",
          description: "Host bio must be at least 20 characters",
          variant: "destructive",
        });
        return;
      }

      if (selectedCategories.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one event category",
          variant: "destructive",
        });
        return;
      }

      if (!paymentReference.trim()) {
        toast({
          title: "Error",
          description: "Please enter a payment reference",
          variant: "destructive",
        });
        return;
      }

      if (!proofOfPayment.trim()) {
        toast({
          title: "Error",
          description: "Please upload proof of payment",
          variant: "destructive",
        });
        return;
      }

      // Submit application
      const response = await apiRequest(
        "POST",
        api.hostApplications.create.path,
        {
          hostName: hostName.trim(),
          hostBio: hostBio.trim(),
          hostCategories: selectedCategories,
          membershipTier: selectedTier,
          paymentReference: paymentReference.trim(),
          proofOfPayment: proofOfPayment.trim(),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your application has been submitted! We'll review it within 24-48 hours.",
          variant: "default",
        });
        setStep(5);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to submit application",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  const renderStep1 = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="hostName" className="text-sm font-medium">
            Host Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="hostName"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            placeholder="e.g., Jenna's Socials"
            className="mt-1"
            minLength={2}
            maxLength={50}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            This is how you'll appear as a host
          </p>
        </div>

        <div>
          <Label htmlFor="hostBio" className="text-sm font-medium">
            Host Bio <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="hostBio"
            value={hostBio}
            onChange={(e) => setHostBio(e.target.value)}
            placeholder="Tell people what kind of events you host..."
            className="mt-1"
            rows={3}
            minLength={20}
            maxLength={200}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Minimum 20 characters
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">
            Event Categories <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {hostCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category, !!checked)
                  }
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-sm font-medium"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground">Select a membership plan</h3>
        <div className="grid gap-4">
          {Object.entries(hostMembershipPlans).map(([tier, plan]) => (
            <Card
              key={tier}
              className={`cursor-pointer transition-all hover:border-primary ${selectedTier === tier
                  ? "border-primary bg-primary/5"
                  : "border-border"
                }`}
              onClick={() => setSelectedTier(tier as HostMembershipTier)}
            >
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">R{plan.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">/month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    return (
      <div className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-bold mb-2">Invoice Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan:</span>
              <span>{hostMembershipPlans[selectedTier].name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Due:</span>
              <span className="font-bold">R{hostMembershipPlans[selectedTier].price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Reference:</span>
              <span className="font-mono">{paymentReference || "Enter your reference"}</span>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="paymentReference" className="text-sm font-medium">
            Payment Reference <span className="text-destructive">*</span>
          </Label>
          <Input
            id="paymentReference"
            value={paymentReference}
            onChange={(e) => setPaymentReference(e.target.value)}
            placeholder="e.g., TRND-HOST-1234"
            className="mt-1"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Please use your Trendle user ID or username as reference
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">Banking Details</h5>
          <div className="space-y-1 text-sm text-blue-800">
            <p><strong>Bank:</strong> Standard Bank</p>
            <p><strong>Account Name:</strong> Trendle Events Pty Ltd</p>
            <p><strong>Account Number:</strong> 123456789</p>
            <p><strong>Branch Code:</strong> 021905</p>
            <p><strong>Reference:</strong> {paymentReference || "Your payment reference"}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-lg">Upload Proof of Payment</h3>
          <p className="text-sm text-muted-foreground">
            Please upload a screenshot or PDF of your payment confirmation
          </p>
        </div>

        <div>
          <Label htmlFor="proofOfPayment" className="text-sm font-medium">
            Proof of Payment <span className="text-destructive">*</span>
          </Label>
          <Input
            id="proofOfPayment"
            value={proofOfPayment}
            onChange={(e) => setProofOfPayment(e.target.value)}
            placeholder="https://example.com/payment-confirmation.png"
            className="mt-1"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter a direct URL to your payment receipt
          </p>
        </div>
      </div>
    );
  };

  const renderStep5 = () => {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-bold text-xl">Application Submitted!</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Thank you for applying to become a Social Host. Your application will be reviewed once payment is received and verified. Approval typically takes 24–48 hours.
        </p>
        <Card className="bg-muted/50 border-none">
          <CardContent className="pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Application Status:</span>
                <span className="font-medium text-blue-600">Pending Review</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Selected Plan:</span>
                <span className="font-medium">{hostMembershipPlans[selectedTier].name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Reference:</span>
                <span className="font-mono text-xs">{paymentReference}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i <= step
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                    }`}
                />
              ))}
            </div>
            <DialogTitle className="text-xl">
              {step === 1 && "Host Details"}
              {step === 2 && "Membership Selection"}
              {step === 3 && "Payment Instructions"}
              {step === 4 && "Upload Proof of Payment"}
              {step === 5 && "Application Submitted"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {step === 1 && "Tell us about yourself and the events you want to host"}
            {step === 2 && "Choose a membership plan that fits your needs"}
            {step === 3 && "Complete payment to continue your application"}
            {step === 4 && "Upload proof of payment to verify your subscription"}
            {step === 5 && "Your application is being processed"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}

          {step < 5 && (
            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button variant="outline" onClick={previousStep}>
                  Back
                </Button>
              ) : (
                <div />
              )}
              {step < 4 ? (
                <Button onClick={nextStep} disabled={isSubmitting}>
                  {isSubmitting ? "Loading..." : "Next"}
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="pt-4">
              <Button
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}