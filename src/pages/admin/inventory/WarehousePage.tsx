import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Building2, MapPin, Download, Edit, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import { exportSingleSheetToExcel } from "../../../utils/reportGenerator";
import { inventoryApi } from "../../../services/api";
import { useCurrentUser, useNotifications } from "../../../context/AppContext";

interface Warehouse {
  id: string; // DataTable expects string-like id
  name: string;
  location: string;
  status: string;
}

export const WarehousePage: React.FC = () => {
  const currentUser = useCurrentUser();
  const companyId = parseInt((currentUser as any)?.companyId || "1", 10);

  const { showNotification } = useNotifications();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWarehouses = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.getWarehouses(companyId);
      if (res.success && res.data) {
        const items = (res.data.items || res.data || []) as any[];
        setWarehouses(
          items.map((w) => ({
            id: String(w.id ?? w.ID ?? ""),
            name: w.name ?? "",
            location: w.location ?? "",
            status: w.status ?? "Active",
          }))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const handleExport = () => {
    const headers = ["Warehouse Name", "Location", "Status"];
    const data = warehouses.map((wh) => [wh.name, wh.location, wh.status]);
    exportSingleSheetToExcel(headers, data, "Warehouses");
  };

  const handleAdd = async () => {
    const name = window.prompt("Warehouse name?");
    if (name === null) return;
    const location = window.prompt("Location?");
    if (location === null) return;
    const status = window.prompt("Status (Active / Maintenance)?", "Active");

    const payload = {
      companyId,
      name: name.trim(),
      location: (location || "").trim(),
      status: (status || "Active").trim(),
    };

    const res = await inventoryApi.createWarehouse(payload);
    if (res.success) {
      showNotification({ type: "success", title: "Warehouse Added", message: "Warehouse created successfully." });
      await loadWarehouses();
    } else {
      showNotification({ type: "error", title: "Add Failed", message: res.message || "Failed to add warehouse." });
    }
  };

  const handleEdit = async (item: Warehouse) => {
    const name = window.prompt("Warehouse name?", item.name);
    if (name === null) return;
    const location = window.prompt("Location?", item.location);
    if (location === null) return;
    const status = window.prompt("Status (Active / Maintenance)?", item.status);

    const payload = {
      name: name.trim(),
      location: (location || "").trim(),
      status: (status || "Active").trim(),
    };

    const res = await inventoryApi.updateWarehouse(parseInt(item.id, 10), payload);
    if (res.success) {
      showNotification({ type: "success", title: "Warehouse Updated", message: "Warehouse updated successfully." });
      await loadWarehouses();
    } else {
      showNotification({ type: "error", title: "Update Failed", message: res.message || "Failed to update warehouse." });
    }
  };

  const handleDelete = async (item: Warehouse) => {
    const ok = window.confirm(`Delete warehouse "${item.name}"?`);
    if (!ok) return;

    const res = await inventoryApi.deleteWarehouse(parseInt(item.id, 10));
    if (res.success) {
      showNotification({ type: "success", title: "Warehouse Deleted", message: "Warehouse deleted successfully." });
      await loadWarehouses();
    } else {
      showNotification({ type: "error", title: "Delete Failed", message: res.message || "Failed to delete warehouse." });
    }
  };

  const columns = [
    {
      key: "name" as const,
      label: "Warehouse",
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#002147] shadow-sm border border-slate-100">
            <Building2 size={20} />
          </div>
          <div>
            <div className="font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#002147] transition-colors">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: "location" as const,
      label: "Location",
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <MapPin size={14} className="text-slate-400" />
          {value}
        </div>
      ),
    },
    {
      key: "status" as const,
      label: "Status",
      filterable: true,
      render: (value: string) => {
        if (value === "Active") {
          return (
            <div className="flex items-center gap-1.5 text-emerald-600">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[11px] font-bold uppercase tracking-widest">Available</span>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Maintenance</span>
          </div>
        );
      },
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Warehouses</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />} onClick={handleExport}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={handleAdd}
          >
            Add Warehouse
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Locations', 'Active Hubs', 'Under Maintenance', 'Export Terminals'].map((chip, idx) => (
          <button key={chip} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
            {chip}
          </button>
        ))}
      </div>

      {/* Premium Info Banner Section */}
      <div className="bg-[#002147] py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-[1.5rem] shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 scale-125 rotate-12 pointer-events-none">
          <Building2 size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-300 border border-indigo-500/10 shadow-inner">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-slate-400 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Infrastructure Hub</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Storage Network</span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="text-indigo-400 font-bold text-sm">{warehouses.length} Active Storage Locations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          data={warehouses}
          columns={columns}
          searchable
          filterable
          paginated
          pageSize={10}
          loading={loading}
          actions={[
            {
              label: 'Edit',
              icon: <Edit size={16} />,
              onClick: (item: Warehouse) => handleEdit(item),
              variant: 'secondary'
            },
            {
              label: 'Delete',
              icon: <Trash2 size={16} />,
              onClick: (item: Warehouse) => handleDelete(item),
              variant: 'danger'
            }
          ]}
        />
      </div>
    </motion.div>
  );
};

