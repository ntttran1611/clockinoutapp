import { useNavigate } from "react-router-dom";
import { getStaff, updateStaffClockInStatus, updateStaff } from "../data";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useStaffUpdateClockStatusMutation() {
  const queryClient = useQueryClient();
  const staffClockInStatusMutation = useMutation({
    mutationFn: ({ staffID, isClockIn, currentClockId }) =>
      updateStaffClockInStatus(staffID, isClockIn, currentClockId),
    onSuccess: () => {
      // After successfully updating the clock-in status, refetch the staff data to get the latest information
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });

  return staffClockInStatusMutation;
}

export function useUpdateStaffMutation() {
  const queryClient = useQueryClient();
  const updateStaffMutation = useMutation({
    mutationFn: (updatedStaff) => updateStaff(updatedStaff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error) => {
      console.error("Error updating staff clock status: ", error);
    },
  });

  return updateStaffMutation;
}

export function useStaffInitialization() {
  const navigate = useNavigate();
  if (!localStorage.getItem("staff")) {
    navigate("/");
  }

  const query = useQuery({
    queryKey: ["staff"],
    queryFn: () => getStaff(localStorage.getItem("staff")),
    enabled: !!localStorage.getItem("staff"),
  });

  if (query.isError) {
    console.error("Error fetching staff data: ", query.error);
    localStorage.removeItem("staff");
    navigate("/"); //This can be replaced with a more user-friendly error handling in the future
    return;
  }

  /*
  const [tempStaff, setStaff] = useState();
  useEffect(() => {
    if (!localStorage.getItem("staff")) {
      
    } else {
      getStaff(localStorage.getItem("staff")).then((data) => {
        setStaff(data);
      });
    }
  }, [navigate]);*/

  return {
    tempStaff: query.data,
    refetchStaff: query.refetch,
    setStaff: query.setData,
  };
}
