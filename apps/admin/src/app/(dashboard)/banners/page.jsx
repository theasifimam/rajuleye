/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element */
"use client";
import React from "react";
import dynamic from "next/dynamic";
import {
  Plus,
  Image as ImageIcon,
  Trash2,
  Edit2,
  Eye,
  TrendingUp,
  Clock,
  Layout,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/PageHeader";
const BannerDialog = dynamic(
  () =>
    import("@/components/admin/BannerDialog").then((mod) => mod.BannerDialog),
  { ssr: false },
);
import {
  useGetBannersQuery,
  useDeleteBannerMutation,
  useUpdateBannerMutation,
} from "@/store/bannerApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
export default function BannersPage() {
  const { data: result, isLoading } = useGetBannersQuery();
  const banners = result?.data || [];
  const [deleteBanner] = useDeleteBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingBanner, setEditingBanner] = React.useState(null);
  const handleToggleStatus = async (banner) => {
    const newStatus = banner.status === "Active" ? "Inactive" : "Active";
    const formData = new FormData();
    formData.append("status", newStatus);
    // Ensure image is appended otherwise backend might cry, wait, backend in update doesn't require image.
    // It checks if req.file exists. If not it skips image update.
    // I will just send the status update!
    try {
      await updateBanner({ id: banner.id, formData }).unwrap();
      toast.success(`Campaign ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await deleteBanner(id).unwrap();
      toast.success("Campaign removed successfully");
    } catch (error) {
      toast.error("Failed to delete campaign");
    }
  };
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setIsDialogOpen(true);
  };
  const handleCreateNew = () => {
    setEditingBanner(null);
    setIsDialogOpen(true);
  };
  const activeCampaigns = React.useMemo(
    () => banners.filter((b) => b.status === "Active").length,
    [banners],
  );
  const scheduledCampaigns = React.useMemo(
    () => banners.filter((b) => b.status === "Scheduled").length,
    [banners],
  );
  const totalInteractions = React.useMemo(
    () => banners.reduce((acc, b) => acc + (b.clicks || 0), 0),
    [banners],
  );
  const campaignStats = React.useMemo(
    () => [
      {
        label: "Active Banners",
        value: `${activeCampaigns} Active`,
        icon: Sparkles,
        color: "primary",
      },
      {
        label: "Scheduled Banners",
        value: `${scheduledCampaigns} Banners`,
        icon: Clock,
        color: "blue",
      },
      { label: "Click Rate", value: "N/A", icon: TrendingUp, color: "purple" },
    ],
    [activeCampaigns, scheduledCampaigns],
  );
  return (
    <div className="space-y-8 md:space-y-12 pb-10">
      <BannerDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        banner={editingBanner}
      />
      <PageHeader
        badgeIcon={ImageIcon}
        badgeText="Banners"
        titleMain="Marketing"
        titleAccent="Banners"
        description="Manage your store's promotional banners and marketing campaigns."
      >
        <div className="h-16 md:h-20 px-6 md:px-8 rounded-2xl md:rounded-[2rem] bg-card/80 backdrop-blur-md border-2 border-primary/10 shadow-sm flex flex-col justify-center gap-0.5 md:gap-1 min-w-[180px] md:min-w-[200px] hover:border-primary/30 transition-all duration-500">
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
            Total Clicks
          </p>
          <div className="flex items-end justify-between">
            <h4 className="text-xl md:text-2xl font-black italic leading-none">
              {totalInteractions.toLocaleString()}
            </h4>
            <div className="flex items-center gap-1 text-primary text-[9px] md:text-[10px] font-black italic uppercase">
              <TrendingUp className="h-3 w-3" />
            </div>
          </div>
        </div>
        <Button
          variant="signature"
          size="xl"
          className="h-16 md:h-20 w-full sm:w-auto"
          onClick={handleCreateNew}
        >
          <div className="flex flex-col items-center gap-0.5 md:gap-1">
            <Plus className="h-4 w-4 md:h-5 md:w-5 group-hover/btn:rotate-90 transition-transform duration-500" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em]">
              Add Banner
            </span>
          </div>
        </Button>
      </PageHeader>

      {/* Campaign Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
        {campaignStats.map((stat, i) => (
          <div
            key={i}
            className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-card border shadow-sm border-primary/5 hover:border-primary/20 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div
                className={cn(
                  "h-12 w-12 md:h-16 md:w-16 rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                  stat.color === "primary"
                    ? "bg-primary text-primary-foreground shadow-primary/20"
                    : "bg-muted text-muted-foreground shadow-sm",
                )}
              >
                <stat.icon className="h-5 w-5 md:h-7 md:w-7" />
              </div>
              <div>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <h3 className="text-xl md:text-3xl font-black tracking-tighter italic">
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid of Banners - Enhanced High-Fidelity Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-0">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-[3rem]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-0">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="group rounded-[3rem] bg-card border shadow-sm border-primary/5 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-700"
            >
              {/* Banner Preview Image */}
              <div className="relative h-72 overflow-hidden bg-muted">
                <img
                  src={
                    banner.image.startsWith("http")
                      ? banner.image
                      : banner.image.startsWith("/")
                        ? banner.image
                        : `/${banner.image}`
                  }
                  alt={banner.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/20",
                        banner.status === "Active"
                          ? "bg-primary/20 text-primary border-primary/30"
                          : banner.status === "Scheduled"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-muted/20 text-muted-foreground",
                      )}
                    >
                      {banner.status}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                      <Layout className="h-3 w-3" /> {banner.placement}
                    </span>
                  </div>
                  <h4 className="text-2xl font-black text-white italic tracking-tight">
                    {banner.title}
                  </h4>
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-500">
                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    onClick={() => handleEdit(banner)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-destructive hover:border-destructive"
                    onClick={() => handleDelete(banner.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Banner Stats Footer */}
              <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-card relative z-10">
                <div className="flex items-center gap-4 md:gap-8">
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
                      <Eye className="h-3 w-3" /> Interactions
                    </p>
                    <p className="text-xs md:text-sm font-black italic">
                      {banner.clicks.toLocaleString()} clicks
                    </p>
                  </div>
                  <div className="h-8 w-px bg-border/50" />
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Expiry
                    </p>
                    <p className="text-xs md:text-sm font-black italic">
                      {banner.expiry
                        ? new Date(banner.expiry).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-primary/5 sm:justify-end">
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mr-auto sm:mr-0">
                    Visibility
                  </p>
                  <button
                    onClick={() => handleToggleStatus(banner)}
                    className={cn(
                      "h-6 w-12 rounded-full relative transition-all duration-500 p-1 shrink-0",
                      banner.status === "Active"
                        ? "bg-primary shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                        : "bg-muted",
                    )}
                  >
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-500 transform",
                        banner.status === "Active"
                          ? "translate-x-6"
                          : "translate-x-0",
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Create New Campaign - Placeholder Card */}
          <div
            onClick={handleCreateNew}
            className="group rounded-[3rem] bg-muted/20 border border-dashed border-primary/20 overflow-hidden flex flex-col items-center justify-center p-10 hover:bg-primary/2 hover:border-primary/40 transition-all duration-500 cursor-pointer min-h-[400px]"
          >
            <div className="h-20 w-20 rounded-[2rem] bg-card border shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
              <Plus className="h-10 w-10" />
            </div>
            <div className="text-center mt-6">
              <h4 className="text-xl font-black uppercase tracking-tight italic">
                Add New Banner
              </h4>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 max-w-[200px] mx-auto opacity-60 leading-relaxed">
                Deploy a signature campaign to captivate your audience.
              </p>
            </div>
            <Button
              variant="ghost"
              className="mt-8 rounded-xl font-black uppercase tracking-widest text-[9px] group-hover:text-primary"
            >
              Open Banner Editor <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
