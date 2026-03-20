"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Layers, User, Mail, Phone, MapPin, ReceiptText } from "lucide-react";

interface TransferDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: any;
}

export function TransferDetailModal({
  isOpen,
  onClose,
  transfer,
}: TransferDetailModalProps) {
  if (!transfer) return null;

  const isCluster = transfer.assets && transfer.assets.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-8 bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-serif italic flex items-center gap-2">
                {isCluster ? (
                  <Layers className="h-5 w-5 text-blue-500" />
                ) : (
                  <ReceiptText className="h-5 w-5 text-emerald-500" />
                )}
                Transfer Manifest
              </DialogTitle>
              <DialogDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Ref ID: {transfer._id}
              </DialogDescription>
            </div>
            <Badge
              className={`uppercase text-[10px] font-black px-3 py-1 ${
                transfer.status === "pending"
                  ? "bg-amber-500/10 text-amber-600"
                  : "bg-emerald-500/10 text-emerald-600"
              }`}
            >
              {transfer.status}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* SENDER & RECIPIENT INFO */}
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-tighter flex items-center gap-2">
                  <User className="h-3 w-3" /> Counterparty Details
                </h4>
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border dark:border-slate-800">
                  <DetailItem
                    label="Full Name"
                    value={`${transfer.recipientFirstName} ${transfer.recipientLastName}`}
                  />
                  <DetailItem
                    icon={<Mail className="h-3 w-3" />}
                    label="Email"
                    value={transfer.recipientEmail}
                  />
                  <DetailItem
                    icon={<Phone className="h-3 w-3" />}
                    label="Phone"
                    value={transfer.recipientPhone}
                  />
                  <DetailItem
                    icon={<MapPin className="h-3 w-3" />}
                    label="Address"
                    value={transfer.recipientAddress}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-tighter">
                  Instructions
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-blue-50/50 dark:bg-blue-500/5 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  "
                  {transfer.transferInstruction ||
                    "No specific instructions provided."}
                  "
                </p>
              </div>
            </div>

            {/* FINANCIAL SUMMARY */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-tighter">
                Financial Summary
              </h4>
              <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] uppercase font-bold opacity-50 mb-1">
                    Total Valuation
                  </p>
                  <h2 className="text-4xl font-mono italic font-bold">
                    €
                    {(
                      transfer.totalValue ||
                      transfer.valueAtTransfer ||
                      0
                    ).toLocaleString()}
                  </h2>
                  <div className="mt-4 flex gap-4 text-[10px] font-bold uppercase">
                    <div>
                      <p className="opacity-40">Assets</p>
                      <p>
                        {transfer.totalAssets ||
                          (isCluster ? transfer.assets.length : 1)}
                      </p>
                    </div>
                    <div>
                      <p className="opacity-40">Shares</p>
                      <p>{transfer.totalShares || transfer.shares || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 opacity-10">
                  <Layers className="h-24 w-24" />
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8 dark:bg-slate-800" />

          {/* ASSET BREAKDOWN (CLUSTERS) */}
          {isCluster && (
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                Asset Breakdown
              </h4>
              <div className="border dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
                    <tr>
                      <th className="p-3 font-bold uppercase text-[9px]">
                        Asset
                      </th>
                      <th className="p-3 font-bold uppercase text-[9px]">
                        Shares
                      </th>
                      <th className="p-3 font-bold uppercase text-[9px]">
                        Avg Price
                      </th>
                      <th className="p-3 font-bold text-right uppercase text-[9px]">
                        Total Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {transfer.assets.map((asset: any, i: number) => (
                      <tr key={i} className="dark:text-slate-300">
                        <td className="p-3 font-bold">
                          {asset.assetName}{" "}
                          <span className="text-[10px] text-slate-500 font-normal">
                            ({asset.symbol})
                          </span>
                        </td>
                        <td className="p-3 font-mono">{asset.shares}</td>
                        <td className="p-3 text-slate-500">
                          €{asset.avgBuyPrice?.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-black">
                          €{asset.totalValue?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({ label, value, icon }: any) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1">
        {icon} {label}
      </span>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
        {value || "N/A"}
      </span>
    </div>
  );
}
