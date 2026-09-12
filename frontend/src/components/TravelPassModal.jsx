import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, QrCode, Train, Calendar, Clock, Navigation, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const TravelPassModal = ({ isOpen, onClose, data }) => {
  const printRef = useRef(null);

  if (!isOpen || !data) return null;

  const qrPayload = JSON.stringify({
    pnr: data.pnr || "12345678",
    trainNumber: data.trainNumber || "12002",
    trainName: data.trainName || "Express Train",
    station: data.stationName || "Station",
    platform: data.platform || 1,
    congestionLevel: data.congestionLevel || "NORMAL",
    journeyDate: data.journeyDate || "2026-04-27",
    verifiedBy: "RailWatch AI Engine",
  });

  const handlePrintPass = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to generate your Travel Pass PDF.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>RailWatch_Travel_Pass_${data.pnr || "Ticket"}</title>
          <style>
            @page { size: A5 portrait; margin: 12mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              margin: 0;
              padding: 10px;
              background: #f8fafc;
            }
            .ticket {
              background: #ffffff;
              border: 2px solid #334155;
              border-radius: 12px;
              padding: 24px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .header {
              border-bottom: 2px dashed #cbd5e1;
              padding-bottom: 16px;
              margin-bottom: 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo {
              font-size: 20px;
              font-weight: 800;
              color: #4338ca;
              letter-spacing: -0.5px;
            }
            .badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              background: #e0e7ff;
              color: #3730a3;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 14px;
              margin-bottom: 18px;
            }
            .item {
              border-left: 3px solid #6366f1;
              padding-left: 10px;
            }
            .label {
              font-size: 10px;
              color: #64748b;
              text-transform: uppercase;
              font-weight: 600;
            }
            .value {
              font-size: 14px;
              font-weight: 700;
              color: #0f172a;
              margin-top: 2px;
            }
            .advisory-box {
              background: #f1f5f9;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 14px;
              margin-top: 14px;
              font-size: 11px;
              line-height: 1.5;
            }
            .footer {
              margin-top: 20px;
              padding-top: 12px;
              border-top: 1px solid #e2e8f0;
              font-size: 9px;
              color: #94a3b8;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <div>
                <div class="logo">🚆 RailWatch Digital Boarding Pass</div>
                <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
                  High-Density Station Congestion & Commuter Safety Pass
                </div>
              </div>
              <div class="badge">${data.congestionLevel || "NORMAL"} CONGESTION</div>
            </div>

            <div style="font-size: 16px; font-weight: 800; color: #1e293b; margin-bottom: 14px;">
              ${data.trainName || "Express Train"} 
              <span style="font-size: 12px; font-weight: 500; color: #6366f1;">(#${data.trainNumber || "12002"})</span>
            </div>

            <div class="grid">
              <div class="item">
                <div class="label">PNR Number</div>
                <div class="value">${data.pnr || "2458963214"}</div>
              </div>
              <div class="item">
                <div class="label">Assigned Platform</div>
                <div class="value" style="color: #4338ca;">PLATFORM ${data.platform || 1}</div>
              </div>
              <div class="item">
                <div class="label">Boarding Station</div>
                <div class="value">${data.stationName || "Station"}</div>
              </div>
              <div class="item">
                <div class="label">Journey Date & Time</div>
                <div class="value">${data.journeyDate || "2026-04-27"} at ${data.departureTime || "06:00"}</div>
              </div>
              <div class="item">
                <div class="label">Coach & Class</div>
                <div class="value">${data.coachType || "CC"} (${data.bookingStatus || "CONFIRMED"})</div>
              </div>
              <div class="item">
                <div class="label">Reserved Passengers</div>
                <div class="value">${data.reservedPassengers || 1} Passenger(s)</div>
              </div>
            </div>

            <div class="advisory-box">
              <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px;">
                Safety & Gate Advisory:
              </div>
              <div>• <b>Optimal Entry Gate:</b> ${data.travelAdvisory?.optimalEntryGate || "Main Station Portico"}</div>
              <div>• <b>Concourse FOB:</b> ${data.travelAdvisory?.recommendedFob || "Central Foot Overbridge"}</div>
              <div>• <b>Recommended Arrival:</b> ${data.travelAdvisory?.recommendedArrivalTime || "Arrive 45 mins prior to departure"}</div>
              <div style="margin-top: 6px; color: #475569;">${data.travelAdvisory?.safetyAdvisory || "Maintain queue discipline at all times."}</div>
            </div>

            <div class="footer">
              RailWatch AI Predictive Station Engine © 2026 • Verified Token: RW-IR-${data.pnr || "0000"} • Present at Gate Security
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Digital Boarding & Safety Pass
              </h3>
              <p className="text-xs text-slate-400">
                Official RailWatch Travel Certificate
              </p>
            </div>
          </div>

          {/* Ticket Card Blueprint */}
          <div ref={printRef} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4 text-xs">
            {/* Train Title */}
            <div className="flex justify-between items-start border-b border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Train className="w-4 h-4 text-indigo-400" />
                  {data.trainName || "Express Train"}
                </h4>
                <span className="text-[11px] text-slate-400">
                  #{data.trainNumber || "12002"} • {data.stationName}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                data.congestionLevel === "HIGH"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : data.congestionLevel === "MEDIUM"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              }`}>
                {data.congestionLevel}
              </span>
            </div>

            {/* Grid specs */}
            <div className="grid grid-cols-2 gap-3 text-slate-300">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">PNR</span>
                <span className="font-mono font-bold text-white text-xs">{data.pnr || "2458963214"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Platform</span>
                <span className="font-bold text-indigo-400 text-xs">Platform {data.platform}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Journey Date</span>
                <span className="text-white text-xs">{data.journeyDate || "2026-04-27"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Departure</span>
                <span className="text-white text-xs">{data.departureTime || "06:00"}</span>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="p-3 rounded-lg bg-white flex flex-col items-center justify-center shadow-inner">
              <QRCodeSVG
                value={qrPayload}
                size={140}
                level="M"
                includeMargin={false}
              />
              <span className="text-[9px] text-slate-600 font-mono mt-1 font-semibold tracking-wider">
                SCAN FOR GATE CONCOURSE CLEARANCE
              </span>
            </div>

            {/* Advisory guidance */}
            {data.travelAdvisory && (
              <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200">
                <span className="font-bold text-white">Recommended Gate: </span>
                {data.travelAdvisory.optimalEntryGate}
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="mt-5">
            <button
              type="button"
              onClick={handlePrintPass}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF Travel Pass
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TravelPassModal;
