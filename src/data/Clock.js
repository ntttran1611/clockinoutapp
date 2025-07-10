import { supabase } from "../api/SupabaseClient";

export async function getClockList(staffId) {
  try {
    const { data, error } = await supabase
      .from("clock")
      .select()
      .eq("staffId", staffId);
    if (error) {
      console.error("Error fetching data: ", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Unexpected error: ", err);
    return null;
  }
}

export async function getCurrentClock(currentClockId) {
  try {
    const { data, error } = await supabase
      .from("clock")
      .select()
      .eq("id", currentClockId)
      .single();

    if (error) {
      console.error("Error fetching data: ", error);
      alert(error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Unexpected error: ", err);
    return null;
  }
}

export async function addClock(clock) {
  try {
    const { data, error } = await supabase.from("clock").insert(clock).select();

    if (error) {
      console.error("Error updating data: ", error);
      alert(error);
      return null;
    } else {
      console.log("Add clock successfully");
      return data;
    }
  } catch (err) {
    console.error("Unexpected error: ", err);
    return null;
  }
}

export async function updateClock(clock) {
  try {
    const { data, error } = await supabase
      .from("clock")
      .update({
        startTime: clock.startTime,
        endTime: clock.endTime,
        branch: clock.branch,
        staffId: clock.staffId,
      })
      .eq("id", clock.id);

    if (error) {
      console.error("Error updating data: ", error);
      alert(error);
    } else {
      console.log("Update clock successfully");
    }
    return data;
  } catch (err) {
    console.error("Unexpected error: ", err);
    return null;
  }
}
