import { LArrow, LBox, LNote } from './lldPrimitives.tsx';

/** One fat contract fans out into client-shaped pieces. */
export default function IspSplit() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="Fat interface segregated by client">
      <LBox x={30} y={80} w={170} title="EmployeeOps" rows={['create/update/delete', 'payroll', 'leave', 'reviews']} tone="bad" />
      <LArrow x1={200} y1={110} x2={250} y2={70} />
      <LArrow x1={200} y1={120} x2={250} y2={120} active />
      <LArrow x1={200} y1={130} x2={250} y2={170} />
      <LBox x={250} y={20} w={180} title="EmployeeMgmt" rows={['CRUD only']} tone="good" />
      <LBox x={250} y={95} w={180} title="PayrollService" rows={['payroll only']} tone="good" />
      <LBox x={250} y={170} w={180} title="LeaveMgmt" rows={['leave only']} tone="good" />
      <LNote x={490} y={120}>payroll holds one</LNote>
    </svg>
  );
}
