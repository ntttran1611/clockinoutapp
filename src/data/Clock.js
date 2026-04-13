import { supabase } from "../api";
import dayjs from "dayjs";

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

export async function getTodayClockList(staffId, today) {
  try {
    const { data, error } = await supabase
      .from("clock")
      .select()
      .eq("staffId", staffId)
      .or(`endTime.is.null, startTime.ilike.%${today.format("YYYY-MM-DD")}%`)
      .order("startTime", { ascending: false });
    if (error) {
      console.error("Error fetching data: ", error);
      return null;
    }
    //console.log(data);
    return data;
  } catch (err) {
    console.error("Unexpected error: ", err);
    return null;
  }
}

export async function getClockListWithinRange(staffId, start, end) {
  const nextEndDay = dayjs(end).add(1, "day").startOf("day").toISOString();
  try {
    const { data, error } = await supabase
      .from("clock")
      .select()
      .eq("staffId", staffId)
      .gte("startTime", start)
      .lte("startTime", nextEndDay)
      .order("startTime", { ascending: false });

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

export async function checkAndAutoClockOut(staffId) {
  try {
    // Query for incomplete clock records: endTime IS NULL and clockoutMethod IS NULL
    const { data, error } = await supabase
      .from("clock")
      .select("id, startTime, endTime, clockoutMethod")
      .eq("staffId", staffId)
      .is("endTime", null)
      .is("clockoutMethod", null);

    if (error) {
      console.error("Error fetching incomplete clock records: ", error);
      return { success: false, updated: 0, error };
    }

    if (!data || data.length === 0) {
      console.log("No incomplete clock records found");
      return { success: true, updated: 0, message: "No incomplete records" };
    }

    const now = dayjs();
    const updates = [];

    // Check each record to see if it should be auto-clocked out
    for (const record of data) {
      const startTime = dayjs(record.startTime);
      const sixteenHoursLater = startTime.add(16, "hours");

      // If current time is after startTime + 16 hours
      if (now.isAfter(sixteenHoursLater)) {
        // Set endTime to 17:00 on the same date as startTime
        const endTime = startTime
          .set("hour", 17)
          .set("minute", 0)
          .set("second", 0)
          .toISOString();

        updates.push({
          id: record.id,
          endTime,
        });
      }
    }

    if (updates.length === 0) {
      console.log("No records met the auto clock-out criteria");
      return { success: true, updated: 0, message: "No records met criteria" };
    }

    // Batch update all qualifying records
    const updatePromises = updates.map((update) =>
      supabase
        .from("clock")
        .update({ endTime: update.endTime, clockoutMethod: "auto-generated" })
        .eq("id", update.id),
    );

    const results = await Promise.all(updatePromises);

    // Check for any errors in the batch update
    const failedUpdates = results.filter((result) => result.error);

    if (failedUpdates.length > 0) {
      console.error("Some updates failed:", failedUpdates);
      return {
        success: false,
        updated: updates.length - failedUpdates.length,
        failed: failedUpdates.length,
        errors: failedUpdates,
      };
    }

    console.log(`Successfully auto-clocked out ${updates.length} record(s)`);
    return { success: true, updated: updates.length, records: updates };
  } catch (err) {
    console.error("Unexpected error in checkAndAutoClockOut: ", err);
    return { success: false, error: err.message };
  }
}
