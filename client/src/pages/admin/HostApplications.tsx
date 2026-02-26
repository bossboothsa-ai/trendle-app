import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const AdminHostApplications: React.FC = () => {
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch host applications
  const { data: applications, isLoading, error } = useQuery({
    queryKey: [api.hostApplications.list.path],
    queryFn: async () => {
      const response = await apiRequest("GET", api.hostApplications.list.path);
      return response.json();
    },
  });

  // Approve application mutation
  const approveApplication = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", buildUrl(api.hostApplications.approve.path, { id }));
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Approved",
        description: "Host application has been approved",
        className: "bg-green-500 text-white border-none",
      });
      queryClient.invalidateQueries({ queryKey: ["hostApplications"] });
      setIsApprovalDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reject application mutation
  const rejectApplication = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const response = await apiRequest("POST", buildUrl(api.hostApplications.reject.path, { id }), { reason });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Rejected",
        description: "Host application has been rejected",
        className: "bg-red-500 text-white border-none",
      });
      queryClient.invalidateQueries({ queryKey: ["hostApplications"] });
      setIsRejectionDialogOpen(false);
      setRejectionReason("");
    },
    onError: (error: Error) => {
      toast({
        title: "Rejection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Request correction mutation
  const requestCorrection = useMutation({
    mutationFn: async ({ id, message }: { id: number; message: string }) => {
      const response = await apiRequest("POST", buildUrl(api.hostApplications.requestCorrection.path, { id }), { message });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Correction Requested",
        description: "Host has been requested to correct their application",
        className: "bg-blue-500 text-white border-none",
      });
      queryClient.invalidateQueries({ queryKey: ["hostApplications"] });
      setIsDetailsOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter applications based on status
  const filteredApplications = applications && Array.isArray(applications) ? (
    selectedStatusFilter === "all"
      ? applications
      : applications.filter((app: any) => app.hostApplicationStatus === selectedStatusFilter)
  ) : [];

  if (isLoading) return <div className="p-6">Loading applications...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading applications: {(error as Error).message}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Host Applications</h1>
          <p className="text-slate-500 mt-1">Review and manage Social Host membership applications</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedStatusFilter} onValueChange={setSelectedStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="correction">Correction Required</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">Applications</h2>

        {filteredApplications.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            No applications found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app: any) => (
              <div
                key={app.id}
                className="p-4 border rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedApplication(app);
                  setIsDetailsOpen(true);
                }}
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{app.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{app.displayName}</h3>
                    <p className="text-sm text-slate-500">@{app.username}</p>
                    <p className="text-sm text-slate-600 mt-1">{app.email}</p>
                  </div>

                  <div className="text-right">
                    <Badge
                      className={
                        app.hostApplicationStatus === "approved" ? "bg-green-100 text-green-800" :
                          app.hostApplicationStatus === "rejected" ? "bg-red-100 text-red-800" :
                            app.hostApplicationStatus === "correction" ? "bg-yellow-100 text-yellow-800" :
                              "bg-blue-100 text-blue-800"
                      }
                    >
                      {app.hostApplicationStatus === "approved" ? "Approved" :
                        app.hostApplicationStatus === "rejected" ? "Rejected" :
                          app.hostApplicationStatus === "correction" ? "Correction Required" :
                            "Pending Review"}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">
                      {app.hostMembershipTier === "starter" ? "Starter Tier" :
                        app.hostMembershipTier === "active" ? "Active Tier" :
                          "Pro Tier"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Applied: {new Date(app.hostApplicationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review complete host application information
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{selectedApplication.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-slate-900">{selectedApplication.displayName}</h3>
                  <p className="text-sm text-slate-500">@{selectedApplication.username}</p>
                  <p className="text-sm text-slate-600">{selectedApplication.email}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-slate-900 mb-2">Host Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-slate-500">Host Name</Label>
                    <p className="font-medium">{selectedApplication.hostName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-500">Membership Tier</Label>
                    <Badge>
                      {selectedApplication.hostMembershipTier === "starter" ? "Starter" :
                        selectedApplication.hostMembershipTier === "active" ? "Active" : "Pro"}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="text-sm text-slate-500">Host Bio</Label>
                  <p className="mt-1">{selectedApplication.hostBio}</p>
                </div>

                <div className="mt-4">
                  <Label className="text-sm text-slate-500">Categories</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedApplication.hostCategories?.map((category: string) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-slate-900 mb-2">Payment Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-slate-500">Payment Reference</Label>
                    <p className="font-medium">{selectedApplication.paymentReference}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-500">Payment Date</Label>
                    <p className="font-medium">{new Date(selectedApplication.paymentDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="text-sm text-slate-500">Payment Status</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      className={selectedApplication.paymentVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {selectedApplication.paymentVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                </div>

                {selectedApplication.proofOfPayment && (
                  <div className="mt-4">
                    <Label className="text-sm text-slate-500">Proof of Payment</Label>
                    <div className="mt-1">
                      <a
                        href={selectedApplication.proofOfPayment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Payment Proof
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="pt-6">
                {selectedApplication.hostApplicationStatus === "pending" && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => {
                        setIsDetailsOpen(false);
                        setIsApprovalDialogOpen(true);
                      }}
                    >
                      Approve Application
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsDetailsOpen(false);
                        setIsRejectionDialogOpen(true);
                      }}
                    >
                      Reject Application
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => requestCorrection.mutate({
                        id: selectedApplication.id,
                        message: "Please provide additional information about your hosting experience"
                      })}
                    >
                      Request Correction
                    </Button>
                  </>
                )}
                {selectedApplication.hostApplicationStatus === "correction" && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => {
                        setIsDetailsOpen(false);
                        setIsApprovalDialogOpen(true);
                      }}
                    >
                      Approve Application
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsDetailsOpen(false);
                        setIsRejectionDialogOpen(true);
                      }}
                    >
                      Reject Application
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Host Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this host application?
            </DialogDescription>
          </DialogHeader>

          <p>This will grant the user host privileges and activate their membership.</p>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsApprovalDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                approveApplication.mutate(selectedApplication.id);
              }}
              disabled={approveApplication.isPending}
            >
              {approveApplication.isPending ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Host Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this host application.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsRejectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                rejectApplication.mutate({
                  id: selectedApplication.id,
                  reason: rejectionReason
                });
              }}
              disabled={rejectionReason.trim().length === 0 || rejectApplication.isPending}
            >
              {rejectApplication.isPending ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminHostApplications;
