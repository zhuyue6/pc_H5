import { get } from "@/shared/http";

interface ApprovalProcess {
  id: number;
  idNo: string;
  mobile: string;
  name: string;
  reason: string;
  status: number;
  processStatus: number;
}

export function getApprovalProcess() {
  return get<ApprovalProcess>("approval/process");
}
