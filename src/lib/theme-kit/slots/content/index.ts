import { registerSlot } from "../_registry-base";
import { StatCards } from "./stat-cards";
import { ChartArea } from "./chart-area";
import { DataTable } from "./data-table";
import { Kanban } from "./kanban";
import { DashboardStatsClassic } from "./dashboard-stats-classic";

registerSlot("stat-cards", StatCards);
registerSlot("chart-area", ChartArea);
registerSlot("data-table", DataTable);
registerSlot("kanban", Kanban);
registerSlot("dashboard-stats-classic", DashboardStatsClassic);
