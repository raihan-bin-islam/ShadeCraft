import { registerSlot } from "../_registry";
import { StatCards } from "./stat-cards";
import { ChartArea } from "./chart-area";
import { DataTable } from "./data-table";
import { Kanban } from "./kanban";

registerSlot("content-stat-cards", StatCards);
registerSlot("content-chart-area", ChartArea);
registerSlot("content-data-table", DataTable);
registerSlot("content-kanban", Kanban);
