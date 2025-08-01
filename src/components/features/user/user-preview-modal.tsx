"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppUser } from "@/lib/fake-generators";
import { Skeleton } from "@/components/ui/skeleton";
import { AtSign, MapPin, Phone } from "lucide-react";

export interface UserPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user?: AppUser;
}

export function UserPreviewModal({ isOpen, onOpenChange, user }: UserPreviewModalProps) {
  const renderContent = () => {
    if (!user) {
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <Skeleton className="h-[120px] w-[120px] rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4 space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="relative h-[120px] w-[120px] flex-shrink-0">
            <Image
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              fill
              sizes="120px"
              className="rounded-full object-cover border-4 border-primary/20"
            />
          </div>
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-foreground">{`${user.firstName} ${user.lastName}`}</h3>
            <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start">
              <AtSign className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start">
              <Phone className="h-4 w-4" />
              <span>{user.phone}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg mb-2">Address</h4>
          <div className="flex items-start gap-3 text-muted-foreground">
            <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
            <p>{`${user.address.address}, ${user.address.city}, ${user.address.state} ${user.address.postalCode}`}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}