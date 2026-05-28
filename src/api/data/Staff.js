import { supabase } from "../SupabaseClient.js";
import { generateId } from "../../lib";
import { signUpStaffAccount } from "../auth/auth.js";

async function isIdUnique(id) {
  try {
    const { data, error } = await supabase
      .from("staff")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error checking ID uniqueness: ", error);
      return false;
    }

    return !data; // Returns true if ID doesn't exist (is unique)
  } catch (err) {
    console.error("Unexpected error checking ID uniqueness: ", err);
    return false;
  }
}

async function generateUniqueId() {
  let id = generateId();
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const isUnique = await isIdUnique(id);
    if (isUnique) {
      return id;
    }
    id = generateId();
    attempts++;
  }

  throw new Error("Failed to generate a unique ID after multiple attempts");
}

async function upsertStaffProfile(userId) {
  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        user_role: "staff",
      },
      { onConflict: "id" },
    );

  if (error) {
    console.error("Error updating profile role: ", error);
    throw error;
  }
}

export async function addStaff(staffData) {
  try {
    const uniqueId = await generateUniqueId();
    const password = staffData.password || uniqueId;

    const authUser = await signUpStaffAccount(staffData.email, password);
    await upsertStaffProfile(authUser.id);
    
    const { error } = await supabase.from("staff").insert({
      id: uniqueId,
      firstName: staffData.firstName,
      lastName: staffData.lastName,
      payRateCents: staffData.payRateCents,
      isActive: staffData.isActive,
      availability: staffData.availability,
      isClockIn: false,
      currentClockId: null,
      authId: authUser.id,
      email: authUser.email
    });

    if (error) {
      console.error("Error adding staff: ", error);
      throw error;
    }

    return {
      id: uniqueId,
      authUserId: authUser.id,
    };
  } catch (err) {
    console.error("Unexpected error adding staff: ", err);
    throw err;
  }
}

export async function getStaffList(staffStatusFilter, searchKeyword) {
  try {
    let query = supabase
      .from("staff")
      .select()
      .order("firstName", { ascending: true });

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
        isActive: staff.isActive,
        availability: staff.availability,
        isClockIn: staff.isClockIn,
        currentClockId: staff.currentClockId,
      })
      .eq("id", staff.id);

    if (error) {
      console.error("Error updating staff: ", error);
      alert(error.message);
      return null;
    } else {
      console.log("Update staff successfully");
    }
    return data;
  } catch (err) {
    console.error("Unexpected error updating staff: ", err);
    alert(err.message);
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

// All foreign keys on the Staff, Profiles and Clock tables are ON DELETE CASCADE => only need to delete the root user
export async function deleteStaff(staffId) {
  try {
    const staff = await getStaff(staffId);

    if(!staff) return {success: false, message: "Staff is not found"};

    if (staff.isClockIn) return { success: false, message: "Clock is running" };

    const { data: authData, error: deleteError } = await supabase.functions.invoke(
      `create-staff?authUserId=${staff.authId}`, 
      {
        method: 'DELETE'
      }
    );

    if(deleteError){
      return {
        success: false,
        message: deleteError.message
      }
    }

    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}