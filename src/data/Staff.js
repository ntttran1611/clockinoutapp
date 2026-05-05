import { supabase } from "../api";

export async function getStaffList(staffStatusFilter, searchKeyword) {
  try {
    let query = supabase.from("staff").select();

    if (staffStatusFilter && staffStatusFilter !== "all") {
      if (staffStatusFilter === "active") {
        query = query.eq("isActive", true);
      } else if (staffStatusFilter === "inactive") {
        query = query.eq("isActive", false);
      }
    }

    if (searchKeyword && searchKeyword.trim() !== "") {
      query = query.or(
        `firstName.ilike.%${searchKeyword}%,lastName.ilike.%${searchKeyword}%`,
      );
    }

    const { data, error } = await query;

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

export async function getStaff(id) {
  try {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Unexpected error: ", error);
      return null;
    }

    return data; //use .then() of a Promise since this function takes time to fetch data, will be slower than a line of code calling it from somewhere
  } catch (err) {
    console.error("Unexpected error: ", err);
    return null;
  }
}

export async function updateStaff(staff) {
  try {
    const { data, error } = await supabase
      .from("staff")
      .update({
        firstName: staff.firstName,
        lastName: staff.lastName,
        payRateCents: staff.payRateCents,
        isClockIn: staff.isClockIn,
        currentClockId: staff.currentClockId,
      })
      .eq("id", staff.id);

    if (error) {
      //console.error("Error updating data: ", error);
      alert(error);
    } else {
      console.log("Update staff successfully");
    }
    return data;
  } catch (err) {
    //console.error("Unexpected error: ", err);
    return null;
  }
}

export async function updateStaffClockInStatus(
  staffId,
  isClockIn,
  currentClockId,
) {
  try {
    const { data, error } = await supabase
      .from("staff")
      .update({
        isClockIn: isClockIn,
        currentClockId: currentClockId,
      })
      .eq("id", staffId);

    if (error) {
      console.error("Error updating clock in status: ", error);
      alert(error);
    } else {
      console.log("Update staff clock in status successfully");
    }
  } catch (err) {
    console.error("Unexpected error: ", err);
  }
}
