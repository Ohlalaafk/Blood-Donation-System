import { useState, useEffect } from "react";
import { inventoryService, BloodInventory } from "../services/inventoryService";

export function useInventory() {
  const [inventory, setInventory] = useState<BloodInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await inventoryService.getInventory();
        setInventory(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch inventory"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const refreshInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getInventory();
      setInventory(data);
      setError(null);
    } catch (err) {
      console.error("Error refreshing inventory:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to refresh inventory"),
      );
    } finally {
      setLoading(false);
    }
  };

  const updateInventoryItem = async (
    inventoryId: string,
    updates: Partial<BloodInventory>,
  ) => {
    try {
      const updatedItem = await inventoryService.updateInventory(
        inventoryId,
        updates,
      );
      setInventory((prev) =>
        prev.map((item) => (item.id === inventoryId ? updatedItem : item)),
      );
      return updatedItem;
    } catch (err) {
      console.error("Error updating inventory item:", err);
      throw err;
    }
  };

  return { inventory, loading, error, refreshInventory, updateInventoryItem };
}
