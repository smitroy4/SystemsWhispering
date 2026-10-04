import type { ComplexityRow } from '../../types/content.ts';
import './ui.css';

interface ComplexityTableProps {
  rows: ComplexityRow[];
  caption?: string;
}

export default function ComplexityTable({ rows, caption }: ComplexityTableProps) {
  if (rows.length === 0) return null;

  return (
    <div className="ui-table-wrap">
      <table className="ui-table">
        {caption ? <caption className="ui-table__caption">{caption}</caption> : null}
        <thead>
          <tr>
            <th scope="col">Operation</th>
            <th scope="col">Best</th>
            <th scope="col">Average</th>
            <th scope="col">Worst</th>
            <th scope="col">Space</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.operation}>
              <th scope="row">{row.operation}</th>
              <td>
                <code>{row.best}</code>
              </td>
              <td>
                <code>{row.average}</code>
              </td>
              <td>
                <code>{row.worst}</code>
              </td>
              <td>{row.space ? <code>{row.space}</code> : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
