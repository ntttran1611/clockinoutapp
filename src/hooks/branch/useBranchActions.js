import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addBranch, updateBranch, deleteBranch } from "../../api";

export function useAddBranchMutation() {
  const queryClient = useQueryClient();
  const addBranchMutation = useMutation({
    mutationFn: (branchData) => addBranch(branchData),
    onSuccess: () => {
      queryClient.invalidateQueries("branchList");
    },
    onError: (error) => {  
        console.error("Error adding branch: ", error);
    }
  });
  return addBranchMutation;
}   

export function useEditBranchMutation() {
  const queryClient = useQueryClient();
  const editBranchMutation = useMutation({
    mutationFn: ( { branchData } ) => updateBranch(branchData),
    onSuccess: () => {
      queryClient.invalidateQueries("branchList");
    },
    onError: (error) => {
      console.error("Error editing branch: ", error);
    }
  });
  return editBranchMutation;
}

export function useDeleteBranchMutation() {
  const queryClient = useQueryClient();
  const deleteBranchMutation = useMutation({
    mutationFn: (branchId) => deleteBranch(branchId),
    onSuccess: () => {
      queryClient.invalidateQueries("branchList");
    },
    onError: (error) => {
      console.error("Error deleting branch: ", error);
    }
  });
  return deleteBranchMutation;
}
