import { supabase } from "../SupabaseClient.js";
//fixed the import path to match the actual file structure. Please ensure that the path is correct based on your project setup.
export async function getBranchList(searchKeyword) {
  try {
    const query = supabase
      .from("branch")
      .select()
      .order("name", { ascending: true });
    if (searchKeyword && searchKeyword.trim() !== "") {
      query.ilike("name", `%${searchKeyword}%`);
    }
    const { data, error } = await query;
    if (error) return { data: null, status: "error", message: error.message };
    return { data, status: "success" };
  } catch (error) {
    console.error("Error fetching branch list:", error);
    return { data: null, status: "error", message: error.message };
  }
}

export async function addBranch(branchData) {
  try {
    const { error } = await supabase.from("branch").insert(branchData);
    if (error) return { status: "error", message: error.message };
    return { status: "success" };
  } catch (error) {
    console.error("Error adding branch:", error);
    return { status: "error", message: error.message };
  }
}

export async function updateBranch(branchData) {
  try {
    const { error } = await supabase
      .from("branch")
      .update(branchData)
      .eq("id", branchData.id);
    if (error) return { status: "error", message: error.message };
    return { status: "success" };
  } catch (error) {
    console.error("Error updating branch:", error);
    return { status: "error", message: error.message };
  }
}

export async function deleteBranch(branchId) {
  try {
    const { error } = await supabase.from("branch").delete().eq("id", branchId);
    if (error) return { status: "error", message: error.message };
    return { status: "success" };
  } catch (error) {
    console.error("Error deleting branch:", error);
    return { status: "error", message: error.message };
  }
}
